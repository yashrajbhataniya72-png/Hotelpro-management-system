import React from 'react';
import { Link } from 'react-router-dom';

const RoomCard = ({ room }) => {
  const defaultImage =
    'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=800&q=80';

  const isAvailable = room.status === 'available';

  return (
    <div className="card h-100 overflow-hidden shadow-sm border-0">
      <div className="position-relative">
        <img
          src={room.images && room.images.length > 0 ? room.images[0] : defaultImage}
          className="card-img-top object-fit-cover"
          alt={`Room ${room.roomNumber}`}
          style={{ height: '220px' }}
        />
        <span
          className={`position-absolute top-0 end-0 m-3 badge ${
            isAvailable ? 'bg-success' : room.status === 'occupied' ? 'bg-danger' : 'bg-warning text-dark'
          }`}
        >
          {room.status.toUpperCase()}
        </span>
        <span className="position-absolute bottom-0 start-0 m-3 badge bg-dark bg-opacity-75">
          Room {room.roomNumber}
        </span>
      </div>

      <div className="card-body d-flex flex-column">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <span className="badge-room-type">{room.type}</span>
          <div className="text-secondary small">
            <i className="bi bi-people-fill me-1 text-primary"></i>
            Up to {room.maxOccupancy} Guests
          </div>
        </div>

        <p className="card-text text-muted small flex-grow-1" style={{ minHeight: '40px' }}>
          {room.description
            ? room.description.length > 100
              ? `${room.description.substring(0, 100)}...`
              : room.description
            : 'Experience unparalleled luxury and serenity in our premium accommodation.'}
        </p>

        {room.amenities && room.amenities.length > 0 && (
          <div className="d-flex flex-wrap gap-1 mb-3">
            {room.amenities.slice(0, 3).map((amenity, idx) => (
              <span key={idx} className="badge bg-light text-dark border small fw-normal">
                {amenity}
              </span>
            ))}
            {room.amenities.length > 3 && (
              <span className="badge bg-light text-secondary border small fw-normal">
                +{room.amenities.length - 3} more
              </span>
            )}
          </div>
        )}

        <hr className="my-2 border-light-subtle" />

        <div className="d-flex justify-content-between align-items-center pt-2">
          <div className="price-tag">
            ${room.pricePerNight} <span>/ night</span>
          </div>

          <Link
            to={`/rooms/${room._id}`}
            className={`btn btn-sm ${isAvailable ? 'btn-primary' : 'btn-outline-secondary'}`}
          >
            {isAvailable ? 'Book Room' : 'View Details'}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RoomCard;
