import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  // Quick Demo Account Helpers
  const fillDemoAccount = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setErrorMsg('');
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="card shadow-sm border-0 p-4 p-md-5">
            <div className="text-center mb-4">
              <div className="d-inline-flex p-3 rounded-circle bg-primary bg-opacity-10 text-primary fs-3 mb-2">
                <i className="bi bi-person-fill-lock"></i>
              </div>
              <h3 className="fw-bold">Sign In to HotelPro</h3>
              <p className="text-muted small">Access your bookings and management dashboard</p>
            </div>

            {errorMsg && <div className="alert alert-danger small p-2 mb-3">{errorMsg}</div>}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label small fw-semibold">Email Address</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="mb-4">
                <label className="form-label small fw-semibold">Password</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary w-100 py-2 fw-semibold mb-3" disabled={loading}>
                {loading ? <span className="spinner-border spinner-border-sm me-2"></span> : null}
                Sign In
              </button>
            </form>

            <div className="text-center small text-muted mb-4">
              Don't have an account?{' '}
              <Link to="/register" className="fw-semibold text-primary text-decoration-none">
                Register here
              </Link>
            </div>

            <hr />

            {/* Demo Quick Logins */}
            <div>
              <p className="small text-muted fw-semibold text-center mb-2">
                <i className="bi bi-lightning-charge-fill text-warning me-1"></i> Quick Demo Logins
              </p>
              <div className="d-flex flex-wrap gap-2 justify-content-center">
                <button
                  type="button"
                  onClick={() => fillDemoAccount('admin@hotelpro.com', 'password123')}
                  className="btn btn-outline-danger btn-sm"
                >
                  Admin
                </button>
                <button
                  type="button"
                  onClick={() => fillDemoAccount('staff@hotelpro.com', 'password123')}
                  className="btn btn-outline-warning text-dark btn-sm"
                >
                  Staff
                </button>
                <button
                  type="button"
                  onClick={() => fillDemoAccount('guest@hotelpro.com', 'password123')}
                  className="btn btn-outline-primary btn-sm"
                >
                  Guest
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
