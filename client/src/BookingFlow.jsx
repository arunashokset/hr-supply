import React, { useState } from 'react';

const BookingFlow = ({ selectedFixer, show, onHide }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    address: '',
    description: '',
    photos: null
  });

  if (!show) return null;

  const nextStep = () => setStep(2);
  const prevStep = () => setStep(1);

  return (
    <div className="modal fade show d-block" style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content custom-booking-modal shadow-lg">
          
          <div className="modal-header border-0 pb-0">
            <h4 className="fw-bold v.text-white">
              {step === 1 ? 'Screen 5 — Booking Details' : 'Screen 6 — Confirmation'}
            </h4>
            <button type="button" className="btn-close btn-close-white" onClick={onHide}></button>
          </div>

          <div className="modal-body p-4">
            {step === 1 ? (
              /* SCREEN 5: DETAILS FORM */
              <div className="booking-form">
                <div className="mb-3">
                  <label className="text-light small mb-1">Date (From - To)</label>
                  <input type="text" className="form-control" placeholder="e.g. 12 May - 14 May" 
                    onChange={(e) => setFormData({...formData, date: e.target.value})} />
                </div>
                <div className="mb-3">
                  <label className="text-light small mb-1">Time (FROM - TO)</label>
                  <input type="text" className="form-control" placeholder="e.g. 09:00 - 17:00" />
                </div>
                <div className="mb-3">
                  <label className="text-light small mb-1">Address Confirmation (Postcode)</label>
                  <input type="text" className="form-control" placeholder="Enter Postcode" />
                </div>
                <div className="mb-3">
                  <label className="text-light small mb-1">Issue Description</label>
                  <textarea className="form-control" rows="3" placeholder="Explain what you need..."></textarea>
                </div>
                <div className="mb-4">
                  <label className="text-light small mb-1">Photos (for a clear picture of job)</label>
                  <div className="photo-upload-box d-flex align-items-center justify-content-center">
                    <i className="bi bi-camera fs-2"></i>
                    <input type="file" className="opacity-0 position-absolute" />
                  </div>
                </div>
                <button className="btn btn-success w-100 py-3 fw-bold rounded-pill" onClick={nextStep}>
                  Book Now
                </button>
              </div>
            ) : (
              /* SCREEN 6: CONFIRMATION */
              <div className="confirmation-screen v.text-white">
                <h6 className="text-success mb-3">Please confirm your booking</h6>
                <div className="summary-list small">
                  <p><strong>Service:</strong> {selectedFixer.profession}</p>
                  <p><strong>Fixer:</strong> {selectedFixer.name}</p>
                  <p><strong>Address:</strong> {formData.address || 'Saved Address'}</p>
                </div>

                <div className="important-notices my-3 p-3 rounded bg-dark border-start border-success">
                  <p className="mb-1"><i className="bi bi-info-circle me-2 text-success"></i>Minimum 1 hour service applies</p>
                  <p className="mb-1"><i className="bi bi-shield-check me-2 text-success"></i>Payment is securely held in escrow</p>
                </div>

                <div className="final-cost-box p-3 rounded mb-4" style={{background: '#1a2e31'}}>
                  <div className="d-flex justify-content-between"><span>First Hour</span><span>€{selectedFixer.rate}</span></div>
                  <div className="d-flex justify-content-between text-muted small"><span>Service Fee</span><span>€0.00 (FREE)</span></div>
                  <hr />
                  <div className="d-flex justify-content-between fw-bold h5 mb-0"><span>Total Today</span><span>€{selectedFixer.rate}</span></div>
                </div>

                <button className="btn btn-success w-100 py-3 fw-bold rounded-pill" 
                  onClick={() => alert('Proceeding to Payment & OTP...')}>
                  Confirm Booking
                </button>
                <button className="btn btn-link v.text-white-50 w-100 mt-2" onClick={prevStep}>Go Back</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingFlow;