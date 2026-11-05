import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const AdminDashboardPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Add Room form state
  const [newRoom, setNewRoom] = useState({
    roomNumber: '',
    type: 'Single',
    pricePerNight: '',
    maxOccupancy: 2,
    description: '',
    amenities: 'WiFi, Air Conditioning, TV',
    images: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=800&q=80',
    status: 'available',
  });

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [statsRes, bookingsRes, roomsRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/bookings'),
        api.get('/rooms'),
      ]);

      if (statsRes.data.success) setStats(statsRes.data.data);
      if (bookingsRes.data.success) setBookings(bookingsRes.data.data);
      if (roomsRes.data.success) setRooms(roomsRes.data.data);

      if (user?.role === 'admin') {
        const usersRes = await api.get('/admin/users');
        if (usersRes.data.success) setUsers(usersRes.data.data);
      }
    } catch (err) {
      console.error('Failed to load dashboard data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [user]);

  // Handle booking status updates (Check-in, Check-out, etc.)
  const handleUpdateBookingStatus = async (bookingId, newStatus) => {
    try {
      const response = await api.put(`/admin/bookings/${bookingId}/status`, {
        status: newStatus,
      });
      if (response.data.success) {
        setMessage(`Booking status changed to ${newStatus}`);
        loadDashboardData();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status');
    }
  };

  // Handle Add Room
  const handleAddRoomSubmit = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      const payload = {
        ...newRoom,
        pricePerNight: Number(newRoom.pricePerNight),
        maxOccupancy: Number(newRoom.maxOccupancy),
        amenities: newRoom.amenities.split(',').map((a) => a.trim()),
        images: [newRoom.images],
      };

      const response = await api.post('/rooms', payload);
      if (response.data.success) {
        setMessage(`Room ${payload.roomNumber} created successfully!`);
        setNewRoom({
          roomNumber: '',
          type: 'Single',
          pricePerNight: '',
          maxOccupancy: 2,
          description: '',
          amenities: 'WiFi, Air Conditioning, TV',
          images: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=800&q=80',
          status: 'available',
        });
        loadDashboardData();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create room');
    } finally {
      setActionLoading(false);
    }
  };

  // Handle Toggle Room Status (e.g. maintenance)
  const handleToggleRoomStatus = async (roomId, currentStatus) => {
    const nextStatus =
      currentStatus === 'available'
        ? 'maintenance'
        : currentStatus === 'maintenance'
        ? 'available'
        : 'available';

    try {
      const response = await api.put(`/rooms/${roomId}`, { status: nextStatus });
      if (response.data.success) {
        setMessage('Room status updated');
        loadDashboardData();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update room');
    }
  };

  // Handle Role change
  const handleChangeRole = async (userId, newRole) => {
    try {
      const response = await api.put(`/admin/users/${userId}/role`, { role: newRole });
      if (response.data.success) {
        setMessage('User role updated');
        loadDashboardData();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to change role');
    }
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status"></div>
        <p className="mt-2 text-muted small">Loading Management Data...</p>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="fw-bold mb-1">HotelPro Operations Dashboard</h1>
          <p className="text-muted mb-0">
            Real-time occupancy tracking, reservation workflows, and inventory control
          </p>
        </div>
        <button onClick={loadDashboardData} className="btn btn-outline-secondary btn-sm">
          <i className="bi bi-arrow-clockwise me-1"></i> Refresh Data
        </button>
      </div>

      {message && (
        <div className="alert alert-success alert-dismissible fade show" role="alert">
          {message}
          <button type="button" className="btn-close" onClick={() => setMessage('')}></button>
        </div>
      )}

      {/* Analytics KPI Row */}
      {stats && (
        <div className="row g-3 mb-5">
          <div className="col-md-3 col-sm-6">
            <div className="card p-3 border-0 shadow-sm metric-card">
              <div className="text-muted small fw-semibold text-uppercase">Occupancy Rate</div>
              <div className="d-flex align-items-baseline gap-2 mt-1">
                <span className="fs-3 fw-bold">{stats.occupancyRate}%</span>
                <span className="small text-muted">({stats.occupiedRooms}/{stats.totalRooms} rooms)</span>
              </div>
            </div>
          </div>

          <div className="col-md-3 col-sm-6">
            <div className="card p-3 border-0 shadow-sm metric-card" style={{ borderLeftColor: '#10b981' }}>
              <div className="text-muted small fw-semibold text-uppercase">Total Revenue</div>
              <div className="fs-3 fw-bold mt-1 text-success">${stats.totalRevenue.toLocaleString()}</div>
            </div>
          </div>

          <div className="col-md-3 col-sm-6">
            <div className="card p-3 border-0 shadow-sm metric-card" style={{ borderLeftColor: '#f59e0b' }}>
              <div className="text-muted small fw-semibold text-uppercase">Active Bookings</div>
              <div className="fs-3 fw-bold mt-1 text-warning">{stats.activeBookings}</div>
            </div>
          </div>

          <div className="col-md-3 col-sm-6">
            <div className="card p-3 border-0 shadow-sm metric-card" style={{ borderLeftColor: '#8b5cf6' }}>
              <div className="text-muted small fw-semibold text-uppercase">Total Users</div>
              <div className="fs-3 fw-bold mt-1 text-purple">{stats.totalUsers}</div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <ul className="nav nav-pills mb-4 gap-2">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <i className="bi bi-calendar2-week me-1"></i> Guest Reservations ({bookings.length})
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'rooms' ? 'active' : ''}`}
            onClick={() => setActiveTab('rooms')}
          >
            <i className="bi bi-door-open me-1"></i> Room Inventory ({rooms.length})
          </button>
        </li>
        {user?.role === 'admin' && (
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === 'users' ? 'active' : ''}`}
              onClick={() => setActiveTab('users')}
            >
              <i className="bi bi-people me-1"></i> User Roster ({users.length})
            </button>
          </li>
        )}
      </ul>

      {/* TAB 1: Bookings Management */}
      {activeTab === 'overview' && (
        <div className="card border-0 shadow-sm p-3">
          <h5 className="fw-bold mb-3">All Guest Reservations</h5>
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th>Booking ID</th>
                  <th>Guest</th>
                  <th>Room</th>
                  <th>Dates</th>
                  <th>Amount</th>
                  <th>Payment</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b._id}>
                    <td><span className="small text-muted font-monospace">{b._id.slice(-6)}</span></td>
                    <td>
                      <div className="fw-semibold">{b.user?.name}</div>
                      <div className="small text-muted">{b.user?.email}</div>
                    </td>
                    <td>
                      <span className="fw-bold">Room {b.room?.roomNumber}</span>
                      <div className="small text-muted">{b.room?.type}</div>
                    </td>
                    <td className="small">
                      <div>{new Date(b.checkInDate).toLocaleDateString()}</div>
                      <div className="text-muted">&rarr; {new Date(b.checkOutDate).toLocaleDateString()}</div>
                    </td>
                    <td>
                      <span className="fw-semibold text-primary">${b.totalPrice}</span>
                    </td>
                    <td>
                      <span
                        className={`badge ${
                          b.paymentStatus === 'paid' ? 'bg-success' : 'bg-warning text-dark'
                        }`}
                      >
                        {b.paymentStatus}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`badge ${
                          b.status === 'confirmed'
                            ? 'bg-primary'
                            : b.status === 'checked-in'
                            ? 'bg-info text-dark'
                            : b.status === 'checked-out'
                            ? 'bg-secondary'
                            : 'bg-danger'
                        }`}
                      >
                        {b.status}
                      </span>
                    </td>
                    <td>
                      <div className="dropdown">
                        <button
                          className="btn btn-sm btn-outline-secondary dropdown-toggle"
                          type="button"
                          data-bs-toggle="dropdown"
                        >
                          Update Status
                        </button>
                        <ul className="dropdown-menu dropdown-menu-end">
                          <li>
                            <button
                              className="dropdown-item"
                              onClick={() => handleUpdateBookingStatus(b._id, 'checked-in')}
                              disabled={b.status === 'checked-in'}
                            >
                              <i className="bi bi-box-arrow-in-right text-success me-2"></i> Check-In Guest
                            </button>
                          </li>
                          <li>
                            <button
                              className="dropdown-item"
                              onClick={() => handleUpdateBookingStatus(b._id, 'checked-out')}
                              disabled={b.status === 'checked-out'}
                            >
                              <i className="bi bi-box-arrow-right text-secondary me-2"></i> Check-Out Guest
                            </button>
                          </li>
                          <li><hr className="dropdown-divider" /></li>
                          <li>
                            <button
                              className="dropdown-item text-danger"
                              onClick={() => handleUpdateBookingStatus(b._id, 'cancelled')}
                              disabled={b.status === 'cancelled'}
                            >
                              <i className="bi bi-x-circle me-2"></i> Cancel Reservation
                            </button>
                          </li>
                        </ul>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: Room Inventory & Add Room Form */}
      {activeTab === 'rooms' && (
        <div className="row g-4">
          <div className="col-lg-4">
            <div className="card border-0 shadow-sm p-4">
              <h5 className="fw-bold mb-3">Add New Room</h5>
              <form onSubmit={handleAddRoomSubmit}>
                <div className="mb-2">
                  <label className="form-label small fw-semibold">Room Number</label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    placeholder="e.g. 401"
                    value={newRoom.roomNumber}
                    onChange={(e) => setNewRoom({ ...newRoom, roomNumber: e.target.value })}
                    required
                  />
                </div>

                <div className="mb-2">
                  <label className="form-label small fw-semibold">Type</label>
                  <select
                    className="form-select form-select-sm"
                    value={newRoom.type}
                    onChange={(e) => setNewRoom({ ...newRoom, type: e.target.value })}
                  >
                    <option value="Single">Single</option>
                    <option value="Double">Double</option>
                    <option value="Deluxe">Deluxe</option>
                    <option value="Suite">Suite</option>
                  </select>
                </div>

                <div className="row g-2 mb-2">
                  <div className="col-6">
                    <label className="form-label small fw-semibold">Price / Night ($)</label>
                    <input
                      type="number"
                      className="form-control form-control-sm"
                      placeholder="120"
                      value={newRoom.pricePerNight}
                      onChange={(e) => setNewRoom({ ...newRoom, pricePerNight: e.target.value })}
                      required
                    />
                  </div>
                  <div className="col-6">
                    <label className="form-label small fw-semibold">Capacity</label>
                    <input
                      type="number"
                      className="form-control form-control-sm"
                      value={newRoom.maxOccupancy}
                      onChange={(e) => setNewRoom({ ...newRoom, maxOccupancy: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="mb-2">
                  <label className="form-label small fw-semibold">Amenities (comma-separated)</label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    value={newRoom.amenities}
                    onChange={(e) => setNewRoom({ ...newRoom, amenities: e.target.value })}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label small fw-semibold">Description</label>
                  <textarea
                    className="form-control form-control-sm"
                    rows="2"
                    value={newRoom.description}
                    onChange={(e) => setNewRoom({ ...newRoom, description: e.target.value })}
                    required
                  ></textarea>
                </div>

                <button type="submit" className="btn btn-primary btn-sm w-100" disabled={actionLoading}>
                  {actionLoading ? 'Saving...' : 'Add Room to Inventory'}
                </button>
              </form>
            </div>
          </div>

          <div className="col-lg-8">
            <div className="card border-0 shadow-sm p-3">
              <h5 className="fw-bold mb-3">Room Inventory Table</h5>
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>Room #</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Capacity</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rooms.map((r) => (
                      <tr key={r._id}>
                        <td className="fw-bold">Room {r.roomNumber}</td>
                        <td><span className="badge bg-light text-dark border">{r.type}</span></td>
                        <td>${r.pricePerNight}/night</td>
                        <td>{r.maxOccupancy} Guests</td>
                        <td>
                          <span
                            className={`badge ${
                              r.status === 'available'
                                ? 'bg-success'
                                : r.status === 'occupied'
                                ? 'bg-danger'
                                : 'bg-warning text-dark'
                            }`}
                          >
                            {r.status}
                          </span>
                        </td>
                        <td>
                          <button
                            onClick={() => handleToggleRoomStatus(r._id, r.status)}
                            className="btn btn-outline-secondary btn-sm"
                          >
                            {r.status === 'maintenance' ? 'Set Available' : 'Set Maintenance'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: User Management (Admin Only) */}
      {activeTab === 'users' && user?.role === 'admin' && (
        <div className="card border-0 shadow-sm p-3">
          <h5 className="fw-bold mb-3">System User Directory</h5>
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Current Role</th>
                  <th>Joined Date</th>
                  <th>Assign Role</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id}>
                    <td className="fw-semibold">{u.name}</td>
                    <td>{u.email}</td>
                    <td>
                      <span
                        className={`badge ${
                          u.role === 'admin'
                            ? 'bg-danger'
                            : u.role === 'staff'
                            ? 'bg-warning text-dark'
                            : 'bg-secondary'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="small text-muted">{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td>
                      <select
                        className="form-select form-select-sm w-auto"
                        value={u.role}
                        onChange={(e) => handleChangeRole(u._id, e.target.value)}
                        disabled={u._id === user._id}
                      >
                        <option value="guest">guest</option>
                        <option value="staff">staff</option>
                        <option value="admin">admin</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboardPage;
