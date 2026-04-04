import React, { useState } from 'react';
import axios from 'axios'; // Ensure axios is installed

const FixerDashboard = ({ user, onLogout }) => {
    const dummyPhoto = "https://cdn-icons-png.flaticon.com/512/149/149071.png";

    // --- 👤 PROFILE & STATS STATE ---
    const [profile, setProfile] = useState({
        phone: user?.phone || '',
        location: user?.location || 'Nidda',
        availableTimings: '08:00 - 18:00',
        photo: user?.photo || null // Base64 string will be stored here
    });

    const [stats] = useState({ day: 85, week: 450, month: 1850 });

    // --- 📅 AVAILABILITY STATE ---
    const [selectedDates, setSelectedDates] = useState([
        { id: 1, date: '2026-04-10', startTime: '09:00', endTime: '17:00' }
    ]);

    // --- 💰 FINANCIAL DATA ---
    const [reports] = useState([
        { id: 101, date: '2026-03-28', location: 'Gelnhausen', work: 'Plumbing', gross: 120, hours: 3 },
        { id: 102, date: '2026-03-30', location: 'Nidda Zentrum', work: 'Electrician', gross: 200, hours: 5 },
        { id: 103, date: '2026-04-01', location: 'Echzell', work: 'Cleaning', gross: 45, hours: 2 },
    ]);

    const calculateCommission = (gross) => {
        if (gross <= 50) return 0.99;
        if (gross > 50 && gross <= 200) return 1.99;
        if (gross > 200) return 2.99;
        return 0;
    };

    // --- HANDLERS ---
    const handleProfileChange = (e) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    // 🚀 NEW: Function to send data to MongoDB
    const handleUpdateProfile = async () => {
        try {
            const res = await axios.put(`http://localhost:5000/api/users/update/${user._id}`, profile);
            if (res.status === 200) {
                alert("Profile & Photo saved successfully!");
            }
        } catch (err) {
            console.error(err);
            alert("Failed to save profile.");
        }
    };

    const addDateRow = () => {
        setSelectedDates([...selectedDates, { id: Date.now(), date: '', startTime: '09:00', endTime: '17:00' }]);
    };

    const updateDate = (id, field, value) => {
        setSelectedDates(selectedDates.map(d => d.id === id ? { ...d, [field]: value } : d));
    };

    const deleteDateRow = (id) => {
        setSelectedDates(selectedDates.filter(d => d.id !== id));
    };

    const isSaveDisabled = selectedDates.length === 0 || selectedDates.some(d => !d.date);

    return (
        <div className="min-vh-100 p-4 bg-black text-white font-monospace">
            {/* HEADER */}
            <div className="d-flex justify-content-between align-items-center mb-5 border-bottom border-secondary pb-3">
                <h2 className="text-success fw-bold">FIXER CONTROL PANEL</h2>
                <button onClick={onLogout} className="btn btn-sm btn-outline-danger px-3">Logout</button>
            </div>

            {/* TOP ROW: PROFILE & STATS */}
            <div className="row g-4 mb-4">
                <div className="col-md-6">
                    <div className="p-4 rounded-4 h-100 shadow-lg" style={{ backgroundColor: '#111', border: '1px solid #333' }}>
                        <h3 className="mb-4 text-success small uppercase tracking-wider"><i className="bi bi-person-gear"></i> Manage Profile</h3>
                        
                        {/* PHOTO SECTION */}
                        <div className="text-center mb-4">
                            <div className="position-relative d-inline-block">
                                <img 
                                    src={profile.photo || dummyPhoto} 
                                    alt="Profile" 
                                    className="rounded-circle border border-secondary shadow"
                                    style={{ width: '120px', height: '120px', objectFit: 'cover' }}
                                />
                                <label 
                                    htmlFor="photo-upload" 
                                    className="position-absolute bottom-0 end-0 bg-success rounded-circle d-flex align-items-center justify-content-center"
                                    style={{ width: '35px', height: '35px', cursor: 'pointer', border: '2px solid #111' }}
                                >
                                    <i className="bi bi-camera-fill text-black small"></i>
                                </label>
                                <input 
                                    id="photo-upload" 
                                    type="file" 
                                    accept="image/*" 
                                    className="d-none" 
                                    onChange={(e) => {
                                        const file = e.target.files[0];
                                        if (file) {
                                            const reader = new FileReader();
                                            reader.onloadend = () => setProfile({ ...profile, photo: reader.result });
                                            reader.readAsDataURL(file);
                                        }
                                    }}
                                />
                            </div>
                        </div>

                        <div className="mb-3">
                            <label className="small text-secondary">Phone Number</label>
                            <input type="text" name="phone" value={profile.phone} onChange={handleProfileChange} className="form-control form-control-sm bg-black text-white border-secondary" />
                        </div>
                        <div className="mb-3">
                            <label className="small text-secondary">Service Location</label>
                            <input type="text" name="location" value={profile.location} onChange={handleProfileChange} className="form-control form-control-sm bg-black text-white border-secondary" />
                        </div>
                        <button onClick={handleUpdateProfile} className="btn btn-success btn-sm w-100 mt-2 fw-bold">Update Profile & Photo</button>
                    </div>
                </div>

                {/* EARNINGS STATS */}
                <div className="col-md-6">
                    <div className="p-4 rounded-4 h-100" style={{ backgroundColor: '#111', border: '1px solid #333' }}>
                        <h3 className="mb-4 text-success small uppercase"><i className="bi bi-graph-up-arrow"></i> Earnings Overview</h3>
                        <div className="row text-center g-3">
                            {['Today', 'Weekly', 'Monthly'].map((label, i) => (
                                <div className="col-4" key={label}>
                                    <div className="p-3 bg-black rounded border border-secondary shadow-sm">
                                        <p className="small text-secondary mb-1">{label}</p>
                                        <h4 className="mb-0 text-success">€{[stats.day, stats.week, stats.month][i]}</h4>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* BOTTOM ROW: SCHEDULER & FINANCIALS */}
            <div className="row g-4">
                {/* SCHEDULER */}
                <div className="col-12 col-xl-5">
                    <div className="p-4 rounded-4 bg-dark border border-secondary shadow">
                        <h4 className="text-success mb-4 small uppercase"><i className="bi bi-calendar-check me-2"></i> Set Your Availability</h4>
                        <div className="table-responsive">
                            <table className="table table-dark table-hover align-middle x-small">
                                <thead>
                                    <tr className="text-secondary small">
                                        <th>Date</th>
                                        <th>Start</th>
                                        <th>End</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedDates.map((item) => (
                                        <tr key={item.id}>
                                            <td><input type="date" className="form-control form-control-sm bg-black text-white border-secondary" value={item.date} onChange={(e) => updateDate(item.id, 'date', e.target.value)} /></td>
                                            <td><input type="time" className="form-control form-control-sm bg-black text-white border-secondary" value={item.startTime} onChange={(e) => updateDate(item.id, 'startTime', e.target.value)} /></td>
                                            <td><input type="time" className="form-control form-control-sm bg-black text-white border-secondary" value={item.endTime} onChange={(e) => updateDate(item.id, 'endTime', e.target.value)} /></td>
                                            <td>
                                                <button className="btn btn-sm text-danger" onClick={() => deleteDateRow(item.id)}>
                                                    <i className="bi bi-trash-fill"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <button onClick={addDateRow} className="btn btn-outline-success btn-sm w-100 mt-2">+ Add Another Date</button>
                        <button className={`btn btn-sm w-100 mt-4 fw-bold ${isSaveDisabled ? 'btn-secondary opacity-50' : 'btn-success shadow'}`} disabled={isSaveDisabled}>
                            {isSaveDisabled ? "Select Dates to Save" : "Save All Schedules"}
                        </button>
                    </div>
                </div>

                {/* FINANCIAL LEDGER */}
                <div className="col-12 col-xl-7">
                    <div className="p-4 rounded-4 bg-dark border border-secondary shadow h-100">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h4 className="text-success m-0 small uppercase"><i className="bi bi-cash-stack me-2"></i> Financial Ledger</h4>
                            <span className="badge bg-success shadow-sm">
                                Total Net: €{reports.reduce((acc, job) => acc + (job.gross - calculateCommission(job.gross)), 0).toFixed(2)}
                            </span>
                        </div>
                        <div className="table-responsive">
                            <table className="table table-dark border-secondary x-small">
                                <thead className="table-secondary text-black">
                                    <tr className="small">
                                        <th>Date</th>
                                        <th>Location</th>
                                        <th>Service</th>
                                        <th>Hrs</th>
                                        <th>Gross</th>
                                        <th>Comm</th>
                                        <th>Net Pay</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {reports.map((job) => {
                                        const comm = calculateCommission(job.gross);
                                        const net = (job.gross - comm).toFixed(2);
                                        return (
                                            <tr key={job.id}>
                                                <td className="text-secondary">{job.date}</td>
                                                <td>{job.location}</td>
                                                <td className="fw-bold">{job.work}</td>
                                                <td className="text-info">{job.hours}h</td>
                                                <td>€{job.gross}</td>
                                                <td className="text-danger">-€{comm}</td>
                                                <td className="text-success fw-bold">€{net}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                        <div className="mt-3 p-2 rounded border border-secondary" style={{ backgroundColor: '#111', fontSize: '0.7rem' }}>
                            <p className="text-secondary mb-0 text-center italic">
                                <strong>Policy:</strong> &le;€50: €0.99 | €50-€200: €1.99 | &gt;€200: €2.99
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FixerDashboard;