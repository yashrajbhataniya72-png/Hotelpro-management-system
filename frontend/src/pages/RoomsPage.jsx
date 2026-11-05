import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import RoomCard from '../components/RoomCard';

const RoomsPage = () => {
  const [searchParams] = useSearchParams();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [type, setType] = useState(searchParams.get('type') || 'All');
  const [maxPrice, setMaxPrice] = useState(500);
  const [occupancy, setOccupancy] = useState(searchParams.get('occupancy') || '');
  const [search, setSearch] = useState('');

  const fetchRooms = async () => {
    setLoading(true);
    try {
      const params = {};
      if (type !== 'All') params.type = type;
      if (maxPrice) params.maxPrice = maxPrice;
      if (occupancy) params.occupancy = occupancy;
      if (search) params.search = search;

      const response = await api.get('/rooms', { params });
      if (response.data.success) {
        setRooms(response.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch rooms', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, [type, maxPrice, occupancy]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchRooms();
  };

  const handleReset = () => {
    setType('All');
    setMaxPrice(500);
    setOccupancy('');
    setSearch('');
  };

  return (
    <div className="container py-5">
      <div className="mb-4">
        <h1 className="fw-bold">Rooms & Suites Catalog</h1>
        <p className="text-muted">
          Browse through our curated selection of luxury suites, executive rooms, and family apartments.
        </p>
      </div>

      <div className="row g-4">
        {/* Filters Sidebar */}
        <div className="col-lg-3">
          <div className="card p-3 shadow-sm border-0 sticky-top" style={{ top: '90px' }}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="fw-bold mb-0">Filters</h5>
              <button onClick={handleReset} className="btn btn-sm btn-link text-decoration-none p-0 text-primary">
                Reset
              </button>
            </div>

            {/* Keyword Search */}
            <form onSubmit={handleSearchSubmit} className="mb-3">
              <label className="form-label small fw-semibold">Search by Room / Description</label>
              <div className="input-group">
                <input
                  type="text"
                  className="form-control form-control-sm"
                  placeholder="e.g. 101, Balcony..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <button className="btn btn-primary btn-sm" type="submit">
                  <i className="bi bi-search"></i>
                </button>
              </div>
            </form>

            {/* Category Filter */}
            <div className="mb-3">
              <label className="form-label small fw-semibold">Category</label>
              <select className="form-select form-select-sm" value={type} onChange={(e) => setType(e.target.value)}>
                <option value="All">All Categories</option>
                <option value="Single">Single</option>
                <option value="Double">Double</option>
                <option value="Deluxe">Deluxe</option>
                <option value="Suite">Suite</option>
              </select>
            </div>

            {/* Price Filter */}
            <div className="mb-3">
              <div className="d-flex justify-content-between align-items-center mb-1">
                <label className="form-label small fw-semibold mb-0">Max Nightly Rate</label>
                <span className="badge bg-secondary">${maxPrice}</span>
              </div>
              <input
                type="range"
                className="form-range"
                min="50"
                max="500"
                step="10"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
            </div>

            {/* Occupancy Filter */}
            <div className="mb-2">
              <label className="form-label small fw-semibold">Min Capacity</label>
              <select
                className="form-select form-select-sm"
                value={occupancy}
                onChange={(e) => setOccupancy(e.target.value)}
              >
                <option value="">Any Capacity</option>
                <option value="1">1+ Guest</option>
                <option value="2">2+ Guests</option>
                <option value="3">3+ Guests</option>
                <option value="4">4+ Guests</option>
              </select>
            </div>
          </div>
        </div>

        {/* Room List View */}
        <div className="col-lg-9">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status"></div>
              <p className="mt-2 text-muted small">Loading accommodations...</p>
            </div>
          ) : rooms.length === 0 ? (
            <div className="alert alert-info p-4 text-center">
              <i className="bi bi-info-circle fs-3 d-block mb-2"></i>
              <h5>No rooms match your filter criteria</h5>
              <p className="mb-0 text-muted">Try broadening your search or resetting the price filter.</p>
            </div>
          ) : (
            <div>
              <p className="text-muted small mb-3">Showing <strong>{rooms.length}</strong> available options</p>
              <div className="row g-4">
                {rooms.map((room) => (
                  <div key={room._id} className="col-md-6">
                    <RoomCard room={room} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoomsPage;
