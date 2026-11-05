import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-dark text-white pt-5 pb-4 mt-auto">
      <div className="container">
        <div className="row gy-4">
          <div className="col-lg-4 col-md-6">
            <h5 className="fw-bold mb-3 d-flex align-items-center gap-2">
              <i className="bi bi-building-check text-primary"></i> HotelPro
            </h5>
            <p className="text-secondary small">
              Next-generation hotel management ecosystem delivering seamless room bookings,
              guest services, real-time availability tracking, and automated operations.
            </p>
          </div>

          <div className="col-lg-2 col-md-6">
            <h6 className="fw-semibold text-uppercase text-light mb-3">Quick Links</h6>
            <ul className="list-unstyled text-secondary small">
              <li className="mb-2"><Link to="/" className="text-secondary text-decoration-none">Home</Link></li>
              <li className="mb-2"><Link to="/rooms" className="text-secondary text-decoration-none">Rooms & Suites</Link></li>
              <li className="mb-2"><Link to="/my-bookings" className="text-secondary text-decoration-none">Reservation Status</Link></li>
            </ul>
          </div>

          <div className="col-lg-3 col-md-6">
            <h6 className="fw-semibold text-uppercase text-light mb-3">Room Categories</h6>
            <ul className="list-unstyled text-secondary small">
              <li className="mb-2">Single Executive Rooms</li>
              <li className="mb-2">Deluxe Double Suites</li>
              <li className="mb-2">Presidential Penthouse</li>
              <li className="mb-2">Family Luxury Suites</li>
            </ul>
          </div>

          <div className="col-lg-3 col-md-6">
            <h6 className="fw-semibold text-uppercase text-light mb-3">Support & Security</h6>
            <p className="text-secondary small mb-2">
              <i className="bi bi-shield-check text-success me-2"></i> JWT 256-bit Encrypted Sessions
            </p>
            <p className="text-secondary small mb-2">
              <i className="bi bi-telephone text-primary me-2"></i> 24/7 Front Desk Concierge
            </p>
            <p className="text-secondary small">
              <i className="bi bi-envelope text-primary me-2"></i> support@hotelpro.com
            </p>
          </div>
        </div>

        <hr className="border-secondary my-4" />

        <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center text-secondary small">
          <p className="mb-0">&copy; {new Date().getFullYear()} HotelPro Inc. All rights reserved.</p>
          <p className="mb-0">Designed for modern hospitality enterprise operations.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
