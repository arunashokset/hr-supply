import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ user, onLogout, onOpenAuth }) => {
  const navigate = useNavigate();

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-black sticky-top border-bottom border-secondary">
      <div className="container">
        <Link className="navbar-brand fw-bold text-success" to="/">HR-SUPPLY</Link>
        
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center">
            <li className="nav-item"><Link className="nav-link" to="/">Home</Link></li>
            <li className="nav-item"><a className="nav-link" href="#services">Services</a></li>
            <li className="nav-item"><a className="nav-link" href="#fixers">Fixers</a></li>
            
            {/* BOOK NOW BUTTON IN NAVBAR */}
            <li className="nav-item mx-lg-2">
              <a href="#fixers" className="btn btn-outline-success btn-sm px-3">Book Now</a>
            </li>

            {user ? (
              <li className="nav-item dropdown">
                <button className="nav-link btn btn-link dropdown-toggle text-white d-flex align-items-center" id="userMenu" data-bs-toggle="dropdown">
                  <i className="bi bi-person-circle fs-5 me-2"></i> Profile
                </button>
                <ul className="dropdown-menu dropdown-menu-dark dropdown-menu-end">
                  <li className="px-3 py-1 small text-success fw-bold text-uppercase">{user.role}</li>
                  <li><hr className="dropdown-divider" /></li>
                  {user.role === 'admin' && (
                    <li><button className="dropdown-item" onClick={() => navigate('/admin')}>Dashboard</button></li>
                  )}
                  <li><button className="dropdown-item text-danger" onClick={onLogout}>Logout</button></li>
                </ul>
              </li>
            ) : (
              <li className="nav-item">
                <button className="nav-link btn btn-link text-white" onClick={onOpenAuth}>Login</button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;