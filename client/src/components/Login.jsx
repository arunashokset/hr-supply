import React, { useState } from 'react';

const Login = ({ onLogin }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', phone: '', location: '', role: 'user',
    experience: '', rate: '', availableHours: '', specializations: []
  });

  const specsList = ['Nurse', 'Plumber', 'Electrician', 'Cleaner', 'Carpenter'];

  const handleSpecChange = (spec) => {
    let updatedSpecs = [...formData.specializations];
    if (updatedSpecs.includes(spec)) {
      updatedSpecs = updatedSpecs.filter(s => s !== spec);
    } else if (updatedSpecs.length < 2) {
      updatedSpecs.push(spec);
    }
    setFormData({ ...formData, specializations: updatedSpecs });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const endpoint = isRegister ? 'http://localhost:5000/api/auth/register' : 'http://localhost:5000/api/auth/login';

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        if (isRegister) {
          alert("Registration Successful!");
          setIsRegister(false);
        } else {
          onLogin(data);
        }
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Connection failed. Is the server running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#000', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#fff', padding: '20px' }}>
      <form onSubmit={handleSubmit} style={{ width: '350px', padding: '20px', border: '1px solid #333', borderRadius: '10px', backgroundColor: '#000' }}>
        <h2 style={{ color: '#198754', textAlign: 'center' }}>HR-SUPPLY</h2>
        
        {/* Basic Fields */}
        {isRegister && (
          <>
            <input type="text" placeholder="Full Name" style={inputStyle} required onChange={(e) => setFormData({...formData, name: e.target.value})} />
            <input type="text" placeholder="Phone Number" style={inputStyle} required onChange={(e) => setFormData({...formData, phone: e.target.value})} />
            <input type="text" placeholder="Location (e.g. Nidda)" style={inputStyle} required onChange={(e) => setFormData({...formData, location: e.target.value})} />
            
            <select style={inputStyle} onChange={(e) => setFormData({...formData, role: e.target.value})}>
              <option value="user">Register as Customer</option>
              <option value="fixer">Register as Fixer</option>
            </select>
          </>
        )}

        <input type="email" placeholder="Email" style={inputStyle} required onChange={(e) => setFormData({...formData, email: e.target.value})} />
        <input type="password" placeholder="Password" style={inputStyle} required onChange={(e) => setFormData({...formData, password: e.target.value})} />

        {/* Dynamic Fixer Fields */}
        {isRegister && formData.role === 'fixer' && (
          <div style={{ borderTop: '1px solid #222', marginTop: '10px', paddingTop: '10px' }}>
            <p style={{ fontSize: '12px', color: '#888' }}>Fixer Details</p>
            <input type="number" placeholder="Experience (Years)" style={inputStyle} onChange={(e) => setFormData({...formData, experience: e.target.value})} />
            <input type="number" placeholder="Hourly Rate (€)" style={inputStyle} onChange={(e) => setFormData({...formData, rate: e.target.value})} />
            <input type="number" placeholder="Available Hours/Week" style={inputStyle} onChange={(e) => setFormData({...formData, availableHours: e.target.value})} />
            
            <p style={{ fontSize: '12px', color: '#888', marginTop: '10px' }}>Specializations (Max 2)</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
              {specsList.map(spec => (
                <button type="button" key={spec} onClick={() => handleSpecChange(spec)} 
                  style={{ ...specBtn, backgroundColor: formData.specializations.includes(spec) ? '#198754' : '#222' }}>
                  {spec}
                </button>
              ))}
            </div>
          </div>
        )}

        {error && <p style={{ color: '#ff4444', fontSize: '13px', textAlign: 'center' }}>{error}</p>}
        <button type="submit" disabled={loading} style={buttonStyle}>{loading ? '...' : (isRegister ? 'Register' : 'Login')}</button>
        <p onClick={() => setIsRegister(!isRegister)} style={{ cursor: 'pointer', textAlign: 'center', fontSize: '12px', marginTop: '10px', color: '#555' }}>
          {isRegister ? 'Back to Login' : 'New here? Create account'}
        </p>
      </form>
    </div>
  );
};

const inputStyle = { width: '100%', padding: '10px', margin: '5px 0', backgroundColor: '#111', border: '1px solid #333', color: '#fff', borderRadius: '5px' };
const buttonStyle = { width: '100%', padding: '12px', marginTop: '15px', backgroundColor: '#198754', color: '#fff', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' };
const specBtn = { padding: '5px 10px', fontSize: '11px', border: 'none', borderRadius: '3px', color: '#fff', cursor: 'pointer' };

export default Login;