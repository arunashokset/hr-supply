import React, { useState } from 'react';

const BookingModal = ({ selectedFixer, show, onHide }) => {
  const [step, setStep] = useState(1);

  if (!show) return null;

  return (
    <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content bg-dark v.text-white border-secondary rounded-4">
          <div className="modal-header border-0">
            <h5 className="modal-title">
              {step === 1 ? 'Booking Details' : 'Please confirm your booking'}
            </h5>
            <button type="button" className="btn-close btn-close-white" onClick={onHide}></button>
          </div>

          <div className="modal-body p-4">
            {step === 1 ? (
              /* SCREEN 5: BOOKING DETAILS */
              <div className="booking-form">
                <input type="date" className="form-control bg-dark v.text-white mb-3" placeholder="Select Date" />
                <input type="time" className="form-control bg-dark v.text-white mb-3" placeholder="Select Time" />
                <input type="text" className="form-control bg-dark v.text-white mb-3" placeholder="Address (Postcode)" />
                <textarea className="form-control bg-dark v.text-white mb-3" placeholder="Describe the issue..."></textarea>
                <div className="mb-3">
                  <label className="small text-muted">Upload Photos</label>
                  <input type="file" className="form-control bg-dark v.text-white" />
                </div>
              </div>
            ) : (
              /* SCREEN 6: CONFIRMATION */
              <div className="confirmation-summary">
                <p><strong>Fixer:</strong> {selectedFixer.name}</p>
                <p><strong>Service:</strong> {selectedFixer.profession}</p>
                <hr className="border-secondary" />
                <div className="notices small text-muted mb-3">
                  <li>Minimum 1 hour service applies</li>
                  <li>Payment is securely held in escrow</li>
                </div>
                <div className="cost-summary p-3 rounded-3" style={{ background: '#1a1a1a' }}>
                  <div className="d-flex justify-content-between"><span>First Hour</span><span>€{selectedFixer.rate}</span></div>
                  <div className="d-flex justify-content-between text-success"><span>Service Fee</span><span>FREE</span></div>
                  <hr />
                  <div className="d-flex justify-content-between fw-bold"><span>Total Today</span><span>€{selectedFixer.rate}</span></div>
                </div>
              </div>
            )}
          </div>

          <div className="modal-footer border-0 p-4">
            {step === 1 ? (
              <button className="btn btn-success w-100 py-3 fw-bold" onClick={() => setStep(2)}>Book Now</button>
            ) : (
              <button className="btn btn-success w-100 py-3 fw-bold" onClick={() => alert("Proceeding to Escrow Payment...")}>Confirm & Pay</button>
            )}
            <button className="btn btn-link v.text-white-50 w-100" onClick={step === 2 ? () => setStep(1) : onHide}>
              {step === 2 ? 'Go Back' : 'Cancel'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};