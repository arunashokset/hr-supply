import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../assets/images/logo.webp';

const Navbar = ({ user, onLogout }) => {
  const navigate = useNavigate();

  // Handle logout and redirect to login page
  const handleLogoutClick = () => {
    onLogout(); // Clears localStorage and auth state in App.jsx
    navigate('/'); // Redirects to login
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-black sticky-top border-bottom border-secondary py-2">
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center" to="/home">
          <img 
            src={Logo} 
            alt="HR-SUPPLY-ZUPPLY" 
            height="40" 
            className="d-inline-block align-top"
            style={{ filter: 'brightness(1.1)' }} // Optional: makes it pop on black
          />
         
          {/* <span className="ms-2 fw-bold text-success fs-4 d-none d-sm-inline">HR-SUPPLY</span> */}
        </Link>
        
        {/* Toggle button for mobile */}
        <button className="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center gap-2">
            <li className="nav-item">
              <Link className="nav-link text-white" to="/home">Home</Link>
            </li>
            <li className="nav-item">
              <a className="nav-link text-white" href="#services">Services</a>
            </li>
            <li className="nav-item">
              <a className="nav-link text-white" href="#fixers">Fixers</a>
            </li>
            
            <li className="nav-item mx-lg-2">
              <a href="#fixers" className="btn btn-outline-success btn-sm px-4 rounded-pill">Book Now</a>
            </li>

            {user ? (
              <li className="nav-item dropdown ms-lg-3">
                {/* Ensure data-bs-toggle is present for Bootstrap JS to work */}
                <button 
                  className="nav-link btn btn-link text-white d-flex align-items-center gap-2 dropdown-toggle border-0" 
                  id="userMenu" 
                  data-bs-toggle="dropdown"
                  type="button"
                  aria-expanded="false"
                >
                  <div className="bg-success rounded-circle d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px' }}>
                    <i className="bi bi-person text-black fw-bold"></i>
                  </div>
                  <span className="fw-medium">{user.name}</span>
                </button>
                
                <ul className="dropdown-menu dropdown-menu-dark dropdown-menu-end border-secondary shadow-lg mt-2" aria-labelledby="userMenu">
                  <li className="px-3 py-2">
                    <p className="mb-0 small text-secondary">Logged in as</p>
                    <p className="mb-0 fw-bold text-success small text-uppercase">{user.role}</p>
                  </li>
                  <li><hr className="dropdown-divider border-secondary" /></li>
                  
                  {(user.role === 'admin' || user.role === 'fixer') && (
                    <li>
                      <button className="dropdown-item py-2" onClick={() => navigate(`/${user.role}`)}>
                        <i className="bi bi-speedometer2 me-2"></i> Dashboard
                      </button>
                    </li>
                  )}
                  
                  <li>
                    <button className="dropdown-item py-2" onClick={() => navigate('/profile')}>
                      <i className="bi bi-person-gear me-2"></i> My Profile
                    </button>
                  </li>
                  
                  <li><hr className="dropdown-divider border-secondary" /></li>
                  <li>
                    {/* Fixed Logout call */}
                    <button className="dropdown-item py-2 text-danger" onClick={handleLogoutClick}>
                      <i className="bi bi-box-arrow-right me-2"></i> Logout
                    </button>
                  </li>
                </ul>
              </li>
            ) : (
              <li className="nav-item ms-lg-3">
                <button className="btn btn-success px-4 rounded-pill" onClick={() => navigate('/')}>
                  Login
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;