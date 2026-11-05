import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const RoomDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Form states
  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  const [checkInDate, setCheckInDate] = useState(today);
  const [checkOutDate, setCheckOutDate] = useState(tomorrow);
  const [guestCount, setGuestCount] = useState(1);
  const [specialRequests, setSpecialRequests] = useState('');

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const response = await api.get(`/rooms/${id}`);
        if (response.data.success) {
          setRoom(response.data.data);
        }
      } catch (err) {
        setErrorMsg('Failed to load room details');
      } finally {
        setLoading(false);
      }
    };
    fetchRoom();
  }, [id]);

  // Calculate nights and price
  const calculateTotal = () => {
    if (!checkInDate || !checkOutDate || !room) return { nights: 0, total: 0 };
    const start = new Date(checkInDate);
    const end = new Date(checkOutDate);
    const diffTime = end - start;
    if (diffTime <= 0) return { nights: 0, total: 0 };
    const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return {
      nights,
      total: nights * room.pricePerNight,
    };
  };

  const { nights, total } = calculateTotal();

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (nights <= 0) {
      setErrorMsg('Check-out date must be strictly after check-in date');
      return;
    }

    setBookingLoading(true);

    try {
      const response = await api.post('/bookings', {
        roomId: room._id,
        checkInDate,
        checkOutDate,
        guestCount: Number(guestCount),
        specialRequests,
      });

      if (response.data.success) {
        setSuccessMsg('Reservation successfully confirmed! Redirecting to your bookings...');
        setTimeout(() => {
          navigate('/my-bookings');
        }, 1500);
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Could not complete reservation';
      setErrorMsg(msg);
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status"></div>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger">Room not found.</div>
        <Link to="/rooms" className="btn btn-primary">Back to Catalog</Link>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><Link to="/">Home</Link></li>
          <li className="breadcrumb-item"><Link to="/rooms">Rooms</Link></li>
          <li className="breadcrumb-item active" aria-current="page">Room {room.roomNumber}</li>
        </ol>
      </nav>

      <div className="row g-5">
        {/* Left Column: Room Overview & Photos */}
        <div className="col-lg-7">
          <div className="position-relative mb-4 overflow-hidden rounded-4 shadow-sm">
            <img
              src={room.images?.[0] || 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1200&q=80'}
              alt={`Room ${room.roomNumber}`}
              className="img-fluid w-100 object-fit-cover"
              style={{ maxHeight: '420px' }}
            />
            <span className="position-absolute top-0 end-0 m-3 badge bg-primary fs-6 px-3 py-2">
              {room.type} Suite
            </span>
          </div>

          <div className="d-flex justify-content-between align-items-center mb-3">
            <div>
              <h1 className="fw-bold mb-1">Room {room.roomNumber}</h1>
              <p className="text-muted mb-0">Max Occupancy: {room.maxOccupancy} Guests</p>
            </div>
            <div className="price-tag text-end">
              ${room.pricePerNight} <span>/ night</span>
            </div>
          </div>

          <hr className="my-4" />

          <h5 className="fw-bold mb-3">Description</h5>
          <p className="text-secondary lh-lg mb-4">
            {room.description ||
              'Experience premium hospitality with elegant interior styling, custom mattresses, and comprehensive digital guest assistance.'}
          </p>

          <h5 className="fw-bold mb-3">Room Amenities & Features</h5>
          <div className="row g-2 mb-4">
            {room.amenities?.map((amenity, idx) => (
              <div key={idx} className="col-sm-6">
                <div className="p-2 border rounded bg-light d-flex align-items-center gap-2">
                  <i className="bi bi-check-circle-fill text-success"></i>
                  <span className="small fw-semibold">{amenity}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Reservation Booking Card */}
        <div className="col-lg-5">
          <div className="card shadow-sm border-0 p-4 sticky-top" style={{ top: '90px' }}>
            <h4 className="fw-bold mb-3">Reserve This Room</h4>
            <p className="text-muted small mb-4">
              Instant confirmation • No reservation fees • Secure processing
            </p>

            {errorMsg && <div className="alert alert-danger small p-2 mb-3">{errorMsg}</div>}
            {successMsg && <div className="alert alert-success small p-2 mb-3">{successMsg}</div>}

            <form onSubmit={handleBookingSubmit}>
              <div className="row g-3 mb-3">
                <div className="col-6">
                  <label className="form-label small fw-semibold">Check-In</label>
                  <input
                    type="date"
                    className="form-control"
                    min={today}
                    value={checkInDate}
                    onChange={(e) => setCheckInDate(e.target.value)}
                    required
                  />
                </div>
                <div className="col-6">
                  <label className="form-label small fw-semibold">Check-Out</label>
                  <input
                    type="date"
                    className="form-control"
                    min={checkInDate || today}
                    value={checkOutDate}
                    onChange={(e) => setCheckOutDate(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label small fw-semibold">Guests</label>
                <select
                  className="form-select"
                  value={guestCount}
                  onChange={(e) => setGuestCount(e.target.value)}
                >
                  {[...Array(room.maxOccupancy).keys()].map((num) => (
                    <option key={num + 1} value={num + 1}>
                      {num + 1} Guest{num > 0 ? 's' : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label small fw-semibold">Special Requests (Optional)</label>
                <textarea
                  className="form-control"
                  rows="2"
                  placeholder="e.g. Quiet corner, late check-in..."
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                ></textarea>
              </div>

              {/* Price Calculation Breakdown */}
              {nights > 0 && (
                <div className="bg-light p-3 rounded-3 mb-3">
                  <div className="d-flex justify-content-between small text-muted mb-1">
                    <span>${room.pricePerNight} × {nights} night{nights > 1 ? 's' : ''}</span>
                    <span>${total}</span>
                  </div>
                  <div className="d-flex justify-content-between small text-muted mb-2">
                    <span>Taxes & Service fees</span>
                    <span className="text-success">Included</span>
                  </div>
                  <hr className="my-2" />
                  <div className="d-flex justify-content-between fw-bold">
                    <span>Total Amount</span>
                    <span className="text-primary fs-5">${total}</span>
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="btn btn-primary w-100 py-2 fw-semibold"
                disabled={bookingLoading || room.status !== 'available'}
              >
                {bookingLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Securing Reservation...
                  </>
                ) : room.status !== 'available' ? (
                  'Room Currently Unavailable'
                ) : isAuthenticated ? (
                  'Confirm Reservation'
                ) : (
                  'Sign In to Book'
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomDetailsPage;
