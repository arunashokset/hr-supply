import React, { useState, useEffect } from 'react'; // Added useEffect
import axios from 'axios'; // Ensure axios is installed
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

import Navbar from '../components/Navbar';
import Fixers from '../components/Fixers';
import Services from '../components/Services';
import CoreValues from '../components/CoreValues';
import Testimonials from '../components/Testimonials';
import DynamicBanner from '../components/DynamicBanner';

const UserHome = ({ user, onLogout }) => {
  const [selectedFixer, setSelectedFixer] = useState(null);
  const [showBooking, setShowBooking] = useState(false);
  const [dynamicSections, setDynamicSections] = useState([]); // State for your API data

  // 🟢 1. FETCH DYNAMIC SECTIONS ON LOAD
  useEffect(() => {
    const fetchSections = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/sections');
        // Sort by order number (ascending)
        const sorted = res.data.sort((a, b) => a.order - b.order);
        setDynamicSections(sorted);
      } catch (err) {
        console.error("Error loading dynamic sections:", err);
      }
    };
    fetchSections();
  }, []);

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
      <Navbar user={user} onLogout={onLogout} />

      <div>
        <DynamicBanner scrollToServices={scrollToServices} />
      </div>

      {/* 🟢 2. RENDER DYNAMIC SECTIONS HERE */}
      <div className="dynamic-content">
        {dynamicSections.map((section) => (
          <section
            key={section._id}
            className="py-5 container"
            style={{
              backgroundColor: section.layoutType === 'standard' ? 'transparent' : '#111',
              borderBottom: '1px solid #222'
            }}
          >
            <div className={`row align-items-center ${section.imagePosition === 'right' ? 'flex-row-reverse' : ''}`}>

              {/* Media Column (If exists) */}
              {section.mediaType !== 'none' && (
                <div className="col-lg-6 mb-4 mb-lg-0">
                  {section.mediaType === 'image' ? (
                    <img
                      src={`http://localhost:5000${section.mediaPath}`}
                      alt={section.title}
                      className="img-fluid rounded-4 shadow"
                    />
                  ) : (
                    <video
                      src={`http://localhost:5000${section.mediaPath}`}
                      controls
                      className="img-fluid rounded-4 shadow"
                    />
                  )}
                </div>
              )}

              {/* Text Column */}
              <div className={section.mediaType === 'none' ? 'col-12 text-center' : 'col-lg-6'}>
                <h6 className="text-success text-uppercase fw-bold">{section.subtitle}</h6>
                <h2 className="display-5 fw-bold mb-3">{section.title}</h2>
                <p className="lead text-secondary" style={{ whiteSpace: 'pre-line' }}>
                  {section.content}
                </p>
                {section.showButton && (
                  <button className="btn btn-outline-success btn-lg mt-3 px-4">
                    Learn More
                  </button>
                )}
              </div>
            </div>
          </section>
        ))}
      </div>

      {/* 🟢 3. EXISTING SECTIONS REMAIN UNTOUCHED */}
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