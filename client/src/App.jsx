import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import UserHome from './pages/UserHome'; 
import AdminDashboard from './pages/AdminDashboard';
import FixerDashboard from './pages/FixerDashboard';

function App() {
  const [auth, setAuth] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('hr_user');
    if (savedUser) {
      try {
        setAuth(JSON.parse(savedUser));
      } catch (e) {
        console.error("Error parsing saved user", e);
        localStorage.removeItem('hr_user');
      }
    }
    setLoading(false);
  }, []);

  const handleLogin = (data) => {
    setAuth(data);
    localStorage.setItem('hr_user', JSON.stringify(data));
  };

  const handleLogout = () => {
    localStorage.removeItem('hr_user');
    setAuth(null);
  };

  if (loading) return <div className="bg-black min-h-screen"></div>;

  return (
    <Router>
      <Routes>
        {/* If not logged in, always show Login */}
        {!auth ? (
          <Route path="*" element={<Login onLogin={handleLogin} />} />
        ) : (
          <>
            {/* Role-Based Routing - Now passing 'auth' as 'user' prop */}
            {auth.role === 'admin' && (
              <Route path="/admin" element={<AdminDashboard user={auth} onLogout={handleLogout} />} />
            )}
            {auth.role === 'fixer' && (
              <Route path="/fixer" element={<FixerDashboard user={auth} onLogout={handleLogout} />} />
            )}
            {auth.role === 'user' && (
              <Route path="/home" element={<UserHome user={auth} onLogout={handleLogout} />} />
            )}
            
            {/* Redirect to correct home based on role if they hit a random URL */}
            <Route path="*" element={
              <Navigate to={auth.role === 'admin' ? "/admin" : auth.role === 'fixer' ? "/fixer" : "/home"} replace />
            } />
          </>
        )}
      </Routes>
    </Router>
  );
}

export default App;