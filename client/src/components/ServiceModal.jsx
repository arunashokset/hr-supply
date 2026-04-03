import React, { useState } from 'react';
import axios from 'axios';
import AlertPopup from './AlertPopup';
import OTPModal from './OTPModal'; // Ensure this import exists!

const ServiceModal = ({ isOpen, service, onClose, user }) => {
    const [showAlert, setShowAlert] = useState(false);
    const [alertMsg, setAlertMsg] = useState("");
    const [isSuccess, setIsSuccess] = useState(true);
    const [showOTP, setShowOTP] = useState(false);
    const [currentBooking, setCurrentBooking] = useState(null);

    const [formData, setFormData] = useState({
        customerName: '',
        email: '',
        phone: '',
        location: '',
        dateTime: '',
        duration: '1 Hour',
        requirements: ''
    });

    // Handle early return properly
    if (!isOpen && !showAlert && !showOTP) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const bookingData = {
            serviceTitle: service.title,
            customerName: user ? user.name : formData.customerName,
            email: user ? user.email : formData.email,
            phone: user ? user.phone : formData.phone,
            location: formData.location,
            dateTime: formData.dateTime,
            duration: formData.duration,
            category: service.category || 'General',
            requirements: formData.requirements,
            fixer: service.fixerId || null,
            user: user ? user.id : null,
            status: 'requested' 
        };

        try {
            const res = await axios.post('http://localhost:5000/api/bookings', bookingData);
            
            if (res.status === 201 || res.status === 200) {
                console.log("Data saved, switching to OTP:", res.data._id);
                setCurrentBooking(res.data); 
                setShowOTP(true); // This will now trigger the UI switch
            }
        } catch (err) {
            console.error("Submission failed:", err.response?.data || err.message);
            setAlertMsg("Submission failed. " + (err.response?.data?.message || "Check connection."));
            setIsSuccess(false);
            setShowAlert(true);
        }
    };

    const handleFinalClose = () => {
        setShowAlert(false);
        setShowOTP(false);
        onClose(); 
    };

    const handleOTPSuccess = () => {
        setShowOTP(false);
        setAlertMsg("Booking for " + service.title + " recorded successfully!");
        setIsSuccess(true);
        setShowAlert(true); 
    };

    const handleOTPSkip = () => {
        setShowOTP(false);
        onClose(); 
    };

    return (
        <>
            {/* 1. Main Booking Form - ONLY show if OTP and Alert are NOT active */}
            {isOpen && !showOTP && !showAlert && (
                <div className="modal d-block" style={{ background: 'rgba(0,0,0,0.9)', zIndex: 1050, position: 'fixed', top: 0, left: 0, width: '100%', height: '100%' }}>
                    <div className="modal-dialog modal-dialog-centered modal-lg">
                        <div className="modal-content bg-dark text-white border-success shadow-lg">
                            <div className="modal-header border-secondary">
                                <h5 className="modal-title text-success">Book {service.title}</h5>
                                <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
                            </div>

                            <form onSubmit={handleSubmit}>
                                <div className="modal-body px-4">
                                    {!user && (
                                        <div className="row mb-3 border-bottom border-secondary pb-3">
                                            <p className="text-secondary small mb-2">Contact Details (Guest)</p>
                                            <div className="col-md-4 mb-2">
                                                <input type="text" placeholder="Full Name" className="form-control bg-black text-white border-secondary" required
                                                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })} />
                                            </div>
                                            <div className="col-md-4 mb-2">
                                                <input type="email" placeholder="Email Address" className="form-control bg-black text-white border-secondary" required
                                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                                            </div>
                                            <div className="col-md-4 mb-2">
                                                <input type="tel" placeholder="Phone Number" className="form-control bg-black text-white border-secondary" required
                                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                                            </div>
                                        </div>
                                    )}

                                    {user && <p className="text-success small mb-3">Logged in as {user.role}. Profile info will be used.</p>}

                                    <div className="row mt-3">
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label small text-secondary">Location (Nidda/Gelnhausen)</label>
                                            <input type="text" className="form-control bg-black text-white border-secondary" required
                                                placeholder="Street, House No, City"
                                                onChange={(e) => setFormData({ ...formData, location: e.target.value })} />
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label small text-secondary">Date & Time</label>
                                            <input type="datetime-local" className="form-control bg-black text-white border-secondary" required
                                                onChange={(e) => setFormData({ ...formData, dateTime: e.target.value })} />
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label small text-secondary">Duration</label>
                                            <select className="form-select bg-black text-white border-secondary"
                                                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}>
                                                <option>1 Hour</option>
                                                <option>2-3 Hours</option>
                                                <option>Half Day (4h)</option>
                                                <option>Full Day (8h)</option>
                                            </select>
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label small text-secondary">Category</label>
                                            <input type="text" className="form-control bg-black text-white border-secondary" value={service.category || 'General'} readOnly />
                                        </div>
                                    </div>

                                    <div className="mb-2">
                                        <label className="form-label small text-secondary">Job Details</label>
                                        <textarea className="form-control bg-black text-white border-secondary" rows="3"
                                            placeholder="Tell us exactly what you need..."
                                            onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}></textarea>
                                    </div>
                                </div>

                                <div className="modal-footer border-secondary">
                                    <button type="button" className="btn btn-outline-secondary" onClick={onClose}>Cancel</button>
                                    <button type="submit" className="btn btn-success px-5 fw-bold">Confirm Booking Request</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* 2. OTP Modal */}
            {showOTP && (
                <OTPModal 
                    isOpen={showOTP}
                    bookingId={currentBooking?._id}
                    email={user ? user.email : formData.email}
                    phone={user ? user.phone : formData.phone}
                    onClose={handleOTPSkip}
                    onSuccess={handleOTPSuccess}
                />
            )}

            {/* 3. Reusable Alert Popup */}
            <AlertPopup
                isOpen={showAlert}
                message={alertMsg}
                type={isSuccess ? 'success' : 'danger'}
                onClose={handleFinalClose}
            />
        </>
    );
};

export default ServiceModal;