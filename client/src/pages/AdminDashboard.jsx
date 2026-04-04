import React from 'react';

const AdminDashboard = () => {
  return (
    <div style={{ backgroundColor: '#000', minHeight: '100vh', color: '#fff', padding: '20px' }}>
      <h1 style={{ color: '#198754' }}>Admin Dashboard</h1>
      <p>Control Center: Manage Users, Bookings, and Services here.</p>
      <button onClick={() => { localStorage.clear(); window.location.reload(); }} 
              style={{ padding: '10px', backgroundColor: '#444', color: '#fff', border: 'none', cursor: 'pointer' }}>
        Logout
      </button>
    </div>
  );
};

export default AdminDashboard;
