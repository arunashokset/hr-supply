import React, { useState } from 'react';
import axios from 'axios';

const OTPModal = ({ isOpen, bookingId, email, phone, onClose, onSuccess }) => {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleVerify = async () => {
    try {
      // In your backend, create this endpoint to check OTP and update status to 'pending'
      await axios.post(`http://localhost:5000/api/bookings/verify-otp`, {
        bookingId,
        otp
      });
      onSuccess(); // Triggers the "Awesome!" success popup
    } catch (err) {
      setError("Invalid OTP. Please try again.");
    }
  };

  return (
    <div className="modal d-block" style={{ background: 'rgba(0,0,0,0.9)', zIndex: 2000, position: 'fixed', top: 0, left: 0, width: '100%', height: '100%' }}>
      <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: '400px' }}>
        <div className="modal-content bg-dark text-white border-2 border-success shadow-lg text-center p-4">
          <div className="modal-body">
            <h3 className="fw-bold text-success mb-3">Verify Booking</h3>
            <p className="small text-secondary mb-4">
              We've sent an OTP to:<br/>
              <strong>{email}</strong> & <strong>{phone}</strong>
            </p>
            
            <input 
              type="text" 
              className="form-control bg-black text-white border-secondary text-center mb-3 fs-4" 
              placeholder="000000"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            
            {error && <p className="text-danger small">{error}</p>}

            <div className="d-grid gap-2 mt-4">
              <button onClick={handleVerify} className="btn btn-success py-2 fw-bold rounded-pill">
                Verify & Confirm
              </button>
              <button onClick={onClose} className="btn btn-outline-secondary py-2 fw-bold rounded-pill">
                Skip for now (Requested)
              </button>
            </div>
            <p className="extra-small text-muted mt-3">
              Note: Skipping will leave your booking as 'Requested' until manually verified.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OTPModal;