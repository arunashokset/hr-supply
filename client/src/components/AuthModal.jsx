import React, { useState } from 'react';

const AuthModal = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);

  if (!isOpen) return null;

  // Close modal if user clicks the dark background overlay
  const handleOverlayClick = (e) => {
    if (e.target.className === 'modal-overlay') {
      onClose();
    }
  };

  const handleLogin = async (e) => {
  e.preventDefault();
  try {
    const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
    
    // 1. Save the credentials to the browser's memory
    localStorage.setItem('token', res.data.token);
    localStorage.setItem('role', res.data.role); // This will be 'admin', 'fixer', or 'customer'
    console.log("Role received:", res.data.role);
    // 2. The "Redirect Switch"
    if (res.data.role === 'admin') {
      console.log("Welcome Admin! Redirecting...");
      navigate('/admin'); 
    } else if (res.data.role === 'fixer') {
      navigate('/fixer-dashboard'); 
    } else {
      // Regular customers stay on the home page
      navigate('/');
      onClose(); // Closes the modal
    }
  } catch (err) {
    alert(err.response?.data?.message || "Login failed");
    console.error("Login Error:", err);
  }
};

  return (
    <div className="modal-overlay" onClick={handleOverlayClick} style={overlayStyle}>
      <div className="modal-content" style={modalStyle}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="text-success fw-bold">{isLogin ? 'Login' : 'Register'}</h2>
          <button onClick={onClose} className="btn-close btn-close-white"></button>
        </div>

        <form>
          {!isLogin && (
            <div className="mb-3">
              <label className="form-label text-secondary">Full Name</label>
              <input type="text" className="form-control bg-dark text-white border-secondary" placeholder="Enter name" />
            </div>
          )}
          <div className="mb-3">
            <label className="form-label text-secondary">Email Address</label>
            <input type="email" className="form-control bg-dark text-white border-secondary" placeholder="name@example.com" />
          </div>
          <div className="mb-3">
            <label className="form-label text-secondary">Password</label>
            <input type="password" className="form-control bg-dark text-white border-secondary" placeholder="••••••••" />
          </div>

          <button type="submit" className="btn btn-success w-100 py-2 mb-3 shadow">
            {isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <div className="text-center mt-3">
          <p className="text-secondary small">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button 
              onClick={() => setIsLogin(!isLogin)} 
              className="btn btn-link text-success p-0 ms-2"
              style={{ textDecoration: 'none' }}
            >
              {isLogin ? 'Register Here' : 'Login Here'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

// Simple inline styles for the overlay and modal
const overlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(0, 0, 0, 0.85)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 10000,
};

const modalStyle = {
  backgroundColor: '#1a1a1a',
  padding: '30px',
  borderRadius: '15px',
  width: '100%',
  maxWidth: '400px',
  border: '1px solid #333',
  boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
};

export default AuthModal;