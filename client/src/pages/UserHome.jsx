import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import Navbar from '../components/Navbar';
import Fixers from '../components/Fixers';
import Services from '../components/Services';
import CoreValues from '../components/CoreValues';
import Testimonials from '../components/Testimonials';

import video1 from "../assets/videos/video1.mp4";
import video2 from "../assets/videos/video2.mp4";
import video3 from "../assets/videos/video3.mp4";
import video4 from "../assets/videos/video4.mp4";

// ADDED PROPS HERE: { user, onLogout }
const UserHome = ({ user, onLogout }) => { 
  const [selectedFixer, setSelectedFixer] = useState(null);
  const [showBooking, setShowBooking] = useState(false);

  const scrollToServices = () => {
    const section = document.getElementById('services');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleBookClick = (fixer) => {
    setSelectedFixer(fixer);
    setShowBooking(true);
  };

  return (
    <div className="bg-black min-h-screen text-white">
      {/* Passing the props to Navbar */}
      <Navbar user={user} onLogout={onLogout} />

      <header id="home" className="banner-swiper" style={{ height: '80vh' }}>
        <Swiper 
          modules={[Navigation, Pagination, Autoplay]} 
          slidesPerView={1} 
          navigation 
          pagination={{ clickable: true }} 
          autoplay={{ delay: 8000 }} 
          loop 
          style={{ height: '100%' }}
        >
          {[video1, video2, video3, video4].map((vid, i) => (
            <SwiperSlide key={i}>
              <div className="position-relative w-100 h-100">
                <video autoPlay muted loop playsInline className="position-absolute w-100 h-100 start-0 top-0" style={{ objectFit: 'cover', opacity: '0.4' }}>
                  <source src={vid} type="video/mp4" />
                </video>
                <div className="banner-content d-flex flex-column justify-content-center align-items-center h-100 text-center position-relative">
                  <h1 className="display-1 fw-bold text-success">HR SUPPLY</h1>
                  <p className="lead fs-4">Expert Technicians & Medical Staff at Your Doorstep.</p>
                  <button onClick={scrollToServices} className="btn btn-success btn-lg mt-4 px-5">Hire Now</button>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </header>

      <div className="container mx-auto p-4">
        <section id="about" className="py-5 container text-center">
          <h2 className="fw-bold mb-4 text-success">About Our Agency</h2>
          <p className="lead text-secondary">
            We bridge the gap between skilled professionals and those who need them in the Nidda region.
          </p>
        </section>

        <div id="fixers">
          <Fixers onBookClick={handleBookClick} />
        </div>

        <div id="services">
          <Services />
        </div>

        <CoreValues />
        <Testimonials />

        <section className="py-5 bg-success text-center text-white rounded-4 my-5">
          <div className="container">
            <h2 className="fw-bold">Ready to Hire a Professional?</h2>
            <button onClick={scrollToServices} className="btn btn-dark btn-lg mt-3 px-5">Get Started Today</button>
          </div>
        </section>

        <section id="contact" className="py-5 container text-center">
          <h2 className="fw-bold text-success">Contact Us</h2>
          <p className="text-secondary">Email: support@hr-supply.de | Location: Nidda, Germany</p>
        </section>
      </div>
    </div>
  );
};

export default UserHome;