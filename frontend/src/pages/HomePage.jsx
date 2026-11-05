import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import RoomCard from '../components/RoomCard';

const HomePage = () => {
  const [featuredRooms, setFeaturedRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useState({
    type: 'All',
    occupancy: '1',
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await api.get('/rooms');
        if (response.data.success) {
          // Take top 3 rooms
          setFeaturedRooms(response.data.data.slice(0, 3));
        }
      } catch (err) {
        console.error('Failed to load featured rooms', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const query = new URLSearchParams();
    if (searchParams.type !== 'All') query.append('type', searchParams.type);
    if (searchParams.occupancy) query.append('occupancy', searchParams.occupancy);
    navigate(`/rooms?${query.toString()}`);
  };

  return (
    <div>
      {/* Hero Banner */}
      <section className="hero-banner text-center py-5">
        <div className="container py-lg-5">
          <span className="badge bg-primary px-3 py-2 text-uppercase mb-3">
            Luxury & Comfort Awaits
          </span>
          <h1 className="display-4 fw-bold mb-3">Elevate Your Hospitality Experience</h1>
          <p className="lead mx-auto text-light opacity-75 mb-5" style={{ maxWidth: '700px' }}>
            Book premium stays, manage reservations seamlessly, and enjoy automated 
            guest services with HotelPro's next-generation platform.
          </p>

          {/* Quick Search Widget */}
          <div className="card shadow-lg p-3 p-md-4 mx-auto text-start bg-white text-dark" style={{ maxWidth: '850px' }}>
            <form onSubmit={handleSearchSubmit} className="row g-3 align-items-end">
              <div className="col-md-5">
                <label className="form-label small fw-semibold text-muted">Room Category</label>
                <select
                  className="form-select"
                  value={searchParams.type}
                  onChange={(e) => setSearchParams({ ...searchParams, type: e.target.value })}
                >
                  <option value="All">All Categories</option>
                  <option value="Single">Single Executive</option>
                  <option value="Double">Double Deluxe</option>
                  <option value="Deluxe">Premium Deluxe</option>
                  <option value="Suite">Presidential Suite</option>
                </select>
              </div>

              <div className="col-md-4">
                <label className="form-label small fw-semibold text-muted">Guests</label>
                <select
                  className="form-select"
                  value={searchParams.occupancy}
                  onChange={(e) => setSearchParams({ ...searchParams, occupancy: e.target.value })}
                >
                  <option value="1">1 Guest</option>
                  <option value="2">2 Guests</option>
                  <option value="3">3 Guests</option>
                  <option value="4">4+ Guests</option>
                </select>
              </div>

              <div className="col-md-3">
                <button type="submit" className="btn btn-primary w-100 py-2 fw-semibold">
                  <i className="bi bi-search me-1"></i> Find Rooms
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="container py-5 my-4">
        <div className="text-center mb-5">
          <h2 className="fw-bold">Why Choose HotelPro?</h2>
          <p className="text-muted">Designed for guests seeking perfection and hoteliers demanding precision.</p>
        </div>

        <div className="row g-4 text-center">
          <div className="col-md-4">
            <div className="p-4 bg-white rounded-4 shadow-sm h-100 border">
              <div className="d-inline-flex p-3 rounded-circle bg-primary bg-opacity-10 text-primary fs-3 mb-3">
                <i className="bi bi-calendar-check-fill"></i>
              </div>
              <h5 className="fw-bold">Instant Booking Confirmation</h5>
              <p className="text-muted small">
                Real-time conflict detection prevents double bookings and guarantees your room reservation immediately.
              </p>
            </div>
          </div>

          <div className="col-md-4">
            <div className="p-4 bg-white rounded-4 shadow-sm h-100 border">
              <div className="d-inline-flex p-3 rounded-circle bg-success bg-opacity-10 text-success fs-3 mb-3">
                <i className="bi bi-shield-lock-fill"></i>
              </div>
              <h5 className="fw-bold">Role-Based Security</h5>
              <p className="text-muted small">
                Enterprise JWT authentication protects guest records and provides customized views for guests, front desk, and admins.
              </p>
            </div>
          </div>

          <div className="col-md-4">
            <div className="p-4 bg-white rounded-4 shadow-sm h-100 border">
              <div className="d-inline-flex p-3 rounded-circle bg-info bg-opacity-10 text-info fs-3 mb-3">
                <i className="bi bi-graph-up-arrow"></i>
              </div>
              <h5 className="fw-bold">Real-Time Operational Analytics</h5>
              <p className="text-muted small">
                Track occupancy rates, active stays, and revenue trends with real-time operational telemetry.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Rooms Showcase */}
      <section className="bg-light py-5">
        <div className="container">
          <div className="d-flex justify-content-between align-items-end mb-4">
            <div>
              <span className="text-primary fw-semibold small text-uppercase">Featured Accommodations</span>
              <h2 className="fw-bold mb-0">Popular Rooms & Suites</h2>
            </div>
            <Link to="/rooms" className="btn btn-outline-primary fw-semibold">
              View All Rooms <i className="bi bi-arrow-right ms-1"></i>
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status"></div>
            </div>
          ) : (
            <div className="row g-4">
              {featuredRooms.map((room) => (
                <div key={room._id} className="col-md-4">
                  <RoomCard room={room} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
