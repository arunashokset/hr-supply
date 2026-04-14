import React, { useState } from 'react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

import Navbar from '../components/Navbar';
import Fixers from '../components/Fixers';
import Services from '../components/Services';
import CoreValues from '../components/CoreValues';
import Testimonials from '../components/Testimonials';
import DynamicBanner from '../components/DynamicBanner';


// ADDED PROPS HERE: { user, onLogout }
const UserHome = ({ user, onLogout }) => {
  const [selectedFixer, setSelectedFixer] = useState(null);
  const [showBooking, setShowBooking] = useState(false);
  const [dynamicSections, setDynamicSections] = useState([]);

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

      <div>
        <DynamicBanner scrollToServices={scrollToServices} />

      </div>

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