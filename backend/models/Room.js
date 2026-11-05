import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema(
  {
    roomNumber: {
      type: String,
      required: [true, 'Please provide a room number'],
      unique: true,
      trim: true,
    },
    type: {
      type: String,
      required: [true, 'Please specify room type'],
      enum: ['Single', 'Double', 'Deluxe', 'Suite'],
      default: 'Single',
    },
    pricePerNight: {
      type: Number,
      required: [true, 'Please specify price per night'],
      min: [0, 'Price must be positive'],
    },
    maxOccupancy: {
      type: Number,
      required: [true, 'Please specify max occupancy'],
      min: [1, 'Occupancy must be at least 1'],
      default: 2,
    },
    description: {
      type: String,
      required: [true, 'Please provide room description'],
      default: '',
    },
    amenities: {
      type: [String],
      default: ['WiFi', 'Air Conditioning', 'LED TV'],
    },
    images: {
      type: [String],
      default: [
        'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=800&q=80',
      ],
    },
    status: {
      type: String,
      enum: ['available', 'occupied', 'maintenance'],
      default: 'available',
    },
  },
  {
    timestamps: true,
  }
);

const Room = mongoose.model('Room', roomSchema);

export default Room;
