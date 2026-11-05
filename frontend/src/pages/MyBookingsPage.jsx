import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

const MyBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [message, setMessage] = useState('');

  const fetchBookings = async () => {
    try {
      const response = await api.get('/bookings/my');
      if (response.data.success) {
        setBookings(response.data.data);
      }
    } catch (err) {
      console.error('Failed to load bookings', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this reservation?')) return;

    setActionLoading(bookingId);
    try {
      const response = await api.put(`/bookings/${bookingId}/cancel`);
      if (response.data.success) {
        setMessage('Booking successfully cancelled.');
        fetchBookings();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Could not cancel booking');
    } finally {
      setActionLoading(null);
    }
  };

  const handlePayment = async (bookingId) => {
    setActionLoading(bookingId);
    try {
      const response = await api.post(`/bookings/${bookingId}/pay`, {
        paymentMethod: 'Credit Card',
      });
      if (response.data.success) {
        setMessage('Payment successfully processed! Receipt generated.');
        fetchBookings();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Payment simulation failed');
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'confirmed':
        return <span className="badge bg-primary">Confirmed</span>;
      case 'checked-in':
        return <span className="badge bg-info text-dark">Checked In</span>;
      case 'checked-out':
        return <span className="badge bg-secondary">Checked Out</span>;
      case 'cancelled':
        return <span className="badge bg-danger">Cancelled</span>;
      default:
        return <span className="badge bg-light text-dark">{status}</span>;
    }
  };

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="fw-bold mb-1">My Reservations</h1>
          <p className="text-muted mb-0">Track and manage your upcoming stays and past bookings</p>
        </div>
        <Link to="/rooms" className="btn btn-primary btn-sm">
          <i className="bi bi-plus-lg me-1"></i> Book New Room
        </Link>
      </div>

      {message && <div className="alert alert-success alert-dismissible fade show">{message}</div>}

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status"></div>
        </div>
      ) : bookings.length === 0 ? (
        <div className="card text-center p-5 border-0 shadow-sm">
          <i className="bi bi-calendar-x fs-1 text-muted mb-3"></i>
          <h4>No Reservations Yet</h4>
          <p className="text-muted">You haven't reserved any accommodations with us so far.</p>
          <div className="mt-2">
            <Link to="/rooms" className="btn btn-primary">
              Explore Our Rooms
            </Link>
          </div>
        </div>
      ) : (
        <div className="row g-4">
          {bookings.map((booking) => (
            <div key={booking._id} className="col-12">
              <div className="card shadow-sm border-0 p-3 p-md-4">
                <div className="row g-3 align-items-center">
                  <div className="col-md-3">
                    <img
                      src={booking.room?.images?.[0] || 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=600&q=80'}
                      alt="Room"
                      className="img-fluid rounded-3 object-fit-cover w-100"
                      style={{ height: '140px' }}
                    />
                  </div>

                  <div className="col-md-5">
                    <div className="d-flex align-items-center gap-2 mb-1">
                      <h5 className="fw-bold mb-0">Room {booking.room?.roomNumber}</h5>
                      <span className="badge bg-light text-dark border">{booking.room?.type}</span>
                      {getStatusBadge(booking.status)}
                    </div>

                    <div className="text-muted small mb-2">
                      <i className="bi bi-calendar-event me-1"></i>
                      {new Date(booking.checkInDate).toLocaleDateString()} &rarr;{' '}
                      {new Date(booking.checkOutDate).toLocaleDateString()} ({booking.totalNights} nights)
                    </div>

                    <div className="text-muted small">
                      <i className="bi bi-person me-1"></i> {booking.guestCount} Guest(s)
                      {booking.specialRequests && (
                        <span className="ms-2 fst-italic">"{booking.specialRequests}"</span>
                      )}
                    </div>
                  </div>

                  <div className="col-md-2 text-md-center">
                    <div className="fw-bold fs-4 text-primary">${booking.totalPrice}</div>
                    <span
                      className={`badge ${
                        booking.paymentStatus === 'paid' ? 'bg-success' : 'bg-warning text-dark'
                      }`}
                    >
                      {booking.paymentStatus === 'paid' ? 'Paid' : 'Payment Pending'}
                    </span>
                  </div>

                  <div className="col-md-2 text-md-end d-flex flex-column gap-2">
                    {booking.paymentStatus === 'pending' && booking.status !== 'cancelled' && (
                      <button
                        onClick={() => handlePayment(booking._id)}
                        className="btn btn-success btn-sm w-100"
                        disabled={actionLoading === booking._id}
                      >
                        <i className="bi bi-credit-card me-1"></i> Pay Now
                      </button>
                    )}

                    {booking.status === 'confirmed' && (
                      <button
                        onClick={() => handleCancelBooking(booking._id)}
                        className="btn btn-outline-danger btn-sm w-100"
                        disabled={actionLoading === booking._id}
                      >
                        Cancel Stay
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookingsPage;
