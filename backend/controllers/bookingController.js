import Booking from '../models/Booking.js';
import Room from '../models/Room.js';
import Payment from '../models/Payment.js';

// @desc    Create a new booking with double-booking prevention
// @route   POST /api/bookings
// @access  Private (Guest/Staff/Admin)
export const createBooking = async (req, res, next) => {
  try {
    const { roomId, checkInDate, checkOutDate, guestCount, specialRequests } = req.body;

    // 1. Validate dates
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);

    if (isNaN(checkIn.getTime()) || isNaN(checkOut.getTime())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid check-in or check-out date provided',
      });
    }

    if (checkIn >= checkOut) {
      return res.status(400).json({
        success: false,
        message: 'Check-out date must be strictly after check-in date',
      });
    }

    // 2. Validate room exists and is not under maintenance
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found',
      });
    }

    if (room.status === 'maintenance') {
      return res.status(400).json({
        success: false,
        message: 'Selected room is currently undergoing maintenance',
      });
    }

    if (guestCount && guestCount > room.maxOccupancy) {
      return res.status(400).json({
        success: false,
        message: `Guest count exceeds maximum occupancy of ${room.maxOccupancy}`,
      });
    }

    // 3. Double-booking prevention algorithm:
    // Any existing active booking that overlaps the requested range:
    // checkIn < existing.checkOutDate && checkOut > existing.checkInDate
    const conflictingBooking = await Booking.findOne({
      room: roomId,
      status: { $in: ['confirmed', 'checked-in'] },
      $and: [
        { checkInDate: { $lt: checkOut } },
        { checkOutDate: { $gt: checkIn } },
      ],
    });

    if (conflictingBooking) {
      return res.status(400).json({
        success: false,
        message: 'Room is already reserved for the selected date range',
      });
    }

    // 4. Calculate total nights & price
    const oneDayMs = 1000 * 60 * 60 * 24;
    const totalNights = Math.max(1, Math.ceil((checkOut - checkIn) / oneDayMs));
    const totalPrice = totalNights * room.pricePerNight;

    // 5. Create booking record
    const booking = await Booking.create({
      user: req.user._id,
      room: roomId,
      checkInDate: checkIn,
      checkOutDate: checkOut,
      totalNights,
      totalPrice,
      guestCount: guestCount || 1,
      specialRequests: specialRequests || '',
      status: 'confirmed',
      paymentStatus: 'pending',
    });

    const populatedBooking = await Booking.findById(booking._id)
      .populate('room', 'roomNumber type pricePerNight amenities images')
      .populate('user', 'name email phone');

    res.status(201).json({
      success: true,
      data: populatedBooking,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in user's bookings
// @route   GET /api/bookings/my
// @access  Private
export const getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('room', 'roomNumber type pricePerNight amenities images')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single booking by ID
// @route   GET /api/bookings/:id
// @access  Private
export const getBookingById = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('room')
      .populate('user', 'name email phone');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    // Check ownership or staff/admin privileges
    const isOwner = booking.user._id.toString() === req.user._id.toString();
    const isStaffOrAdmin = ['staff', 'admin'].includes(req.user.role);

    if (!isOwner && !isStaffOrAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this booking',
      });
    }

    res.json({
      success: true,
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel a booking
// @route   PUT /api/bookings/:id/cancel
// @access  Private
export const cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    // Only owner or staff/admin can cancel
    const isOwner = booking.user.toString() === req.user._id.toString();
    const isStaffOrAdmin = ['staff', 'admin'].includes(req.user.role);

    if (!isOwner && !isStaffOrAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this booking',
      });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Booking is already cancelled',
      });
    }

    booking.status = 'cancelled';
    await booking.save();

    res.json({
      success: true,
      message: 'Booking cancelled successfully',
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Simulate payment processing for a booking
// @route   POST /api/bookings/:id/pay
// @access  Private
export const processBookingPayment = async (req, res, next) => {
  try {
    const { paymentMethod } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    if (booking.paymentStatus === 'paid') {
      return res.status(400).json({
        success: false,
        message: 'This booking has already been paid for',
      });
    }

    // Create payment transaction record
    const payment = await Payment.create({
      booking: booking._id,
      user: req.user._id,
      amount: booking.totalPrice,
      paymentMethod: paymentMethod || 'Credit Card',
      transactionId: `TXN-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
      status: 'completed',
    });

    booking.paymentStatus = 'paid';
    await booking.save();

    res.json({
      success: true,
      message: 'Payment completed successfully',
      data: {
        booking,
        payment,
      },
    });
  } catch (error) {
    next(error);
  }
};
