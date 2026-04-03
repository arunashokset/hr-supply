import React from 'react';

const AlertPopup = ({ isOpen, message, type = 'success', onClose }) => {
  if (!isOpen) return null;

  // Determine colors based on type
  const isSuccess = type === 'success';
  const iconClass = isSuccess ? 'bi-check-circle-fill text-success' : 'bi-exclamation-triangle-fill text-danger';
  const borderClass = isSuccess ? 'border-success' : 'border-danger';

  return (
    <div className="modal d-block" style={{ background: 'rgba(0,0,0,0.85)', zAxix: 2000, position: 'fixed', top: 0, left: 0, width: '100%', height: '100%' }}>
      <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: '400px' }}>
        <div className={`modal-content bg-dark text-white border-2 ${borderClass} shadow-lg animate__animated animate__zoomIn`}>
          <div className="modal-body text-center p-5">
            <i className={`bi ${iconClass} display-1 mb-4`}></i>
            <h3 className="fw-bold mb-3">{isSuccess ? 'Awesome!' : 'Oops!'}</h3>
            <p className="text-secondary mb-4">{message}</p>
            <button 
              onClick={onClose} 
              className={`btn ${isSuccess ? 'btn-success' : 'btn-danger'} px-5 py-2 fw-bold rounded-pill`}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertPopup;