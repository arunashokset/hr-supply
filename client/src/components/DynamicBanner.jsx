import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import axios from 'axios';

// Import local fallback videos
import video1 from "../assets/videos/video1.mp4";
import video2 from "../assets/videos/video2.mp4";
import video3 from "../assets/videos/video3.mp4";
import video4 from "../assets/videos/video4.mp4";

const API_BASE_URL = "http://localhost:5000";

const DynamicBanner = ({ scrollToServices }) => {
  const defaultBanners = [
    { _id: 'd1', title: 'ZUPPLY SERVICES', subtitle: 'Expert Technicians at Your Doorstep', videoUrl: video1, isLocal: true, buttonText: 'Hire Now', showButton: true, alignment: 'center', contentType: 'video' },
    { _id: 'd2', title: 'FAST FIXING', subtitle: 'Professional Electricians & Plumbers', videoUrl: video2, isLocal: true, buttonText: 'Book Now', showButton: true, alignment: 'center', contentType: 'video' },
    { _id: 'd3', title: 'QUALITY CARE', subtitle: 'Certified Medical & Home Care Staff', videoUrl: video3, isLocal: true, buttonText: 'Explore', showButton: true, alignment: 'center', contentType: 'video' },
    { _id: 'd4', title: 'RELIABLE SKILLS', subtitle: 'On-Demand Service Providers', videoUrl: video4, isLocal: true, buttonText: 'Get Started', showButton: true, alignment: 'center', contentType: 'video' }
  ];

  const [banners, setBanners] = useState(defaultBanners);

 useEffect(() => {
  const fetchBanners = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/banners`);
      
      // Check if we actually got data back
      if (res.data && res.data.length > 0) {
        // 🟢 FILTER: Only show banners where isActive is true OR "true"
        const activeDBBanners = res.data.filter(b => 
          b.isActive === true || b.isActive === "true"
        );

        if (activeDBBanners.length > 0) {
          const formattedBanners = activeDBBanners.map(b => ({
            ...b,
            isLocal: false // Ensures it uses the API_BASE_URL for the video source
          }));
          setBanners(formattedBanners);
        } else {
          // If no banners are active in DB, keep the defaults
          console.log("No active banners found in DB, using defaults.");
        }
      }
    } catch (err) {
      console.warn("Server unreachable, using local fallback banners.");
    }
  };
  fetchBanners();
}, []);

  return (
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
        {banners.map((slide) => {
          const mediaSrc = slide.isLocal ? slide.videoUrl : `${API_BASE_URL}${slide.videoUrl}`;
          
          // 1. IMPROVED ALIGNMENT LOGIC
          // Added 'w-100' to ensure the flex container spans the full width for alignment to take effect
          const alignClasses = 
            slide.alignment === 'left' ? 'align-items-start text-start px-5' :
            slide.alignment === 'right' ? 'align-items-end text-end px-5' :
            'align-items-center text-center';

          return (
            <SwiperSlide key={slide._id}>
              <div className="position-relative w-100 h-100 bg-black">
                
                {/* 2. MEDIA HANDLING */}
                {slide.contentType === 'image' ? (
                  <img 
                    src={mediaSrc} 
                    alt={slide.title}
                    className="position-absolute w-100 h-100 start-0 top-0" 
                    style={{ objectFit: 'cover', opacity: '0.4' }}
                  />
                ) : (
                  <video 
                    autoPlay muted loop playsInline 
                    key={mediaSrc}
                    className="position-absolute w-100 h-100 start-0 top-0" 
                    style={{ objectFit: 'cover', opacity: '0.4' }}
                  >
                    <source src={mediaSrc} type="video/mp4" />
                  </video>
                )}
                
                {/* 3. CONTENT CONTAINER */}
                <div className={`banner-content d-flex flex-column justify-content-center h-100 w-100 position-relative ${alignClasses}`}>
                  <h1 className="display-1 fw-bold text-white">
                    {slide.title.split(' ').map((word, idx) => (
                      <span key={idx} style={idx === 0 ? {color: '#2ecc71'} : {}}>
                        {word}{' '}
                      </span>
                    ))}
                  </h1>
                  <p className="lead fs-4 text-light px-3" style={{ maxWidth: '800px' }}>
                    {slide.subtitle}
                  </p>
                  
                  {/* 4. ROBUST BUTTON RENDERING */}
                  {/* Handles both Boolean (local) and String "false" (from Database FormData) */}
                  {slide.showButton !== false && slide.showButton !== "false" && (
                    <button onClick={scrollToServices} className="btn btn-success btn-lg mt-4 px-5 rounded-pill shadow">
                      {slide.buttonText || 'Hire Now'}
                    </button>
                  )}
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </header>
  );
};

export default DynamicBanner;