import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Pointing to your port 5000 backend
      const res = await axios.post('http://localhost:5000/api/auth/login', credentials);
      
      // Check if the user is actually an admin
      if (res.data.role === 'admin') {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('role', res.data.role);
        navigate('/admin'); // Teleport to Dashboard
      } else {
        setError('Unauthorized: Admin access only.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-black min-vh-100 d-flex align-items-center justify-content-center px-3">
      <div className="card bg-dark text-white p-4 p-md-5 border-secondary shadow-lg" style={{ maxWidth: '450px', width: '100%', borderRadius: '20px' }}>
        <div className="text-center mb-4">
          <h1 className="text-success fw-bold mb-0">HR-SUPPLY</h1>
          <p className="text-secondary small text-uppercase tracking-widest">Admin Control Center</p>
        </div>

        {error && <div className="alert alert-danger border-0 py-2 small text-center">{error}</div>}

        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label text-secondary small">System Email</label>
            <input 
              type="email" 
              name="email" 
              className="form-control bg-black text-white border-secondary py-2" 
              placeholder="admin@hr-supply.de"
              onChange={handleChange} 
              required 
            />
          </div>
          <div className="mb-4">
            <label className="form-label text-secondary small">Secure Password</label>
            <input 
              type="password" 
              name="password" 
              className="form-control bg-black text-white border-secondary py-2" 
              placeholder="••••••••"
              onChange={handleChange} 
              required 
            />
          </div>
          <button 
            type="submit" 
            className="btn btn-success w-100 fw-bold py-2 shadow"
            disabled={loading}
          >
            {loading ? 'Authenticating...' : 'Enter Dashboard'}
          </button>
        </form>
        
        <div className="text-center mt-4">
          <a href="/" className="text-secondary small text-decoration-none">← Return to Public Site</a>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;