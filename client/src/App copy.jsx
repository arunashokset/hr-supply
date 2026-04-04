import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import axios from 'axios';
import AdminDashboard from './pages/AdminDashboard';
import FixerDashboard from './pages/FixerDashboard';
import UserInterface from './pages/UserHome.jsx';

// Assets & Styles
import './assets/sass/home.scss';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import video1 from './assets/videos/carer1.mp4';
import video2 from './assets/videos/fixer1.mp4';
import video3 from './assets/videos/carer2.mp4';
import video4 from './assets/videos/fixer2.mp4';

// Components & Pages
import AdminDashboard from "./pages/AdminDashboard.jsx";
import AdminLogin from './pages/AdminLogin';
import Navbar from './components/Navbar';
import Fixers from './components/Fixers';
import Services from './components/Services';
import AuthModal from "./components/AuthModal.jsx";
import CoreValues from './components/CoreValues';
import Testimonials from './components/Testimonials';


// --- SUB-COMPONENTS ---

const BookingFlow = ({ show, selectedFixer, onHide }) => {
  if (!show) return null;
  return (
    <div className="modal d-block" style={{ background: 'rgba(0,0,0,0.8)', zIndex: 9999, position: 'fixed', top: 0, left: 0, width: '100%', height: '100%' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content bg-dark text-white p-4 text-center">
          <h2>Booking for {selectedFixer?.name}</h2>
          <button className="btn btn-success mt-3" onClick={onHide}>Close</button>
        </div>
      </div>
    </div>
  );
};

// --- MAIN HOME PAGE COMPONENT ---

const Home = ({ openAuth, userRole }) => {
  const [showBooking, setShowBooking] = useState(false);
  const [selectedFixer, setSelectedFixer] = useState(null);


  const handleBookClick = (fixer) => {
    setSelectedFixer(fixer);
    setShowBooking(true);
  };

  return (
    <div className="bg-black text-white">
      {/* 2. Hero Banner */}
      <header id="home" className="banner-swiper" style={{ height: '80vh' }}>
        <Swiper modules={[Navigation, Pagination, Autoplay]} slidesPerView={1} navigation pagination autoplay={{ delay: 8000 }} loop style={{ height: '100%' }}>
          {[video1, video2, video3, video4].map((vid, i) => (
            <SwiperSlide key={i}>
              <div className="position-relative w-100 h-100">
                <video autoPlay muted loop playsInline className="position-absolute w-100 h-100 start-0 top-0" style={{ objectFit: 'cover', opacity: '0.5' }}>
                  <source src={vid} type="video/mp4" />
                </video>
                <div className="banner-content d-flex flex-column justify-content-center align-items-center h-100 text-center position-relative">
                  <h1 className="display-1 fw-bold text-success">HR SUPPLY</h1>
                  <p className="lead fs-4">Expert Technicians & Medical Staff at Your Doorstep.</p>
                  <button onClick={openAuth} className="btn btn-success btn-lg mt-4 px-5">Hire Now</button>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </header>

       {/* 3. ABOUT US  */}
      <section id="about" className="py-5 container text-center">
         <h2 className="fw-bold mb-4 text-success">About Our Agency</h2>
       <p className="lead text-secondary">
          We bridge the gap between skilled technicians and those who need them in the Nidda region.
        </p>
      </section>

      {/* 4. Fixers Section */}
      <Fixers onBookClick={handleBookClick} />

       {/* 5. Services Section */}
      <Services/>

      {/* Our Core Values */}
      <CoreValues />

       {/* 5. TESTIMONIALS  */}
       <Testimonials />

       {/* 6. CTA SECTION  */}
       <section className="py-5 bg-success text-center text-white">
        <div className="container">
           <h2 className="fw-bold">Ready to Hire a Professional?</h2>
           <button onClick={openAuth} className="btn btn-dark btn-lg mt-3">Get Started Today</button>
         </div>
       </section>

       {/* 7. CONTACT US  */}
       <section id="contact" className="py-5 container text-center">
         <h2 className="fw-bold text-success">Contact Us</h2>
         <p>Email: support@hr-supply.de | Location: Nidda, Germany</p>
       </section>

      <BookingFlow show={showBooking} selectedFixer={selectedFixer} onHide={() => setShowBooking(false)} />
    </div>
  );
};

// --- MAIN APP COMPONENT ---

function App() {
  const [user, setUser] = useState(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [showFixerModal, setShowFixerModal] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem('role');
    const token = localStorage.getItem('token');
    if (role && token) setUser({ role, token });
  }, []);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setIsAuthOpen(false);

    if (userData.role === 'admin') {
      window.location.href = "/admin";
    } else if (userData.role === 'fixer') {
      setShowFixerModal(true);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    window.location.href = "/";
  };


  if (!user) {
    return <Login onLoginSuccess={(userData) => setUser(userData)} />;
  }

  // Role-based Routing
  if (user.role === 'admin') {
    return <AdminDashboard token={user.token} />;
  } else if (user.role === 'fixer') {
    return <FixerDashboard token={user.token} />;
  } else {
    return <UserInterface />; // The current booking app
  }

  return (
    <Router>
      <Navbar 
        user={user} 
        onLogout={handleLogout} 
        onOpenAuth={() => setIsAuthOpen(true)} 
      />

      <Routes>
        <Route path="/" element={<Home onOpenAuth={() => setIsAuthOpen(true)} />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route 
          path="/admin" 
          element={user?.role === 'admin' ? <AdminDashboard /> : <Navigate to="/admin-login" />} 
        />
      </Routes>

      {/* FIXER ADDITIONAL INFO MODAL */}
      {showFixerModal && (
        <div className="modal d-block" style={{ background: 'rgba(0,0,0,0.9)', zIndex: 10000, position: 'fixed', top:0, left:0, width:'100%', height:'100%' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content bg-dark text-white p-5 border-success">
              <h2 className="text-success">Welcome, Fixer!</h2>
              <p>Please complete your profile information to start receiving bookings.</p>
              <div className="mb-3">
                <label className="form-label">Years of Experience</label>
                <input type="number" className="form-control bg-black text-white border-secondary" />
              </div>
              <button className="btn btn-success w-100" onClick={() => setShowFixerModal(false)}>Save Details</button>
            </div>
          </div>
        </div>
      )}

      <AuthModal 
        isOpen={isAuthOpen} 
        onClose={() => setIsAuthOpen(false)} 
        onLoginSuccess={handleLoginSuccess} 
      />
      
      <footer className="py-4 text-center text-secondary border-top border-secondary bg-black">
        <p>© 2026 HR-SUPPLY. Developed by: Arun Ashok.</p>
      </footer>
    </Router>
  );
}

export default App;