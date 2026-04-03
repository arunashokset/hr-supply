import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

const Testimonials = () => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/reviews');
        setReviews(res.data);
      } catch (err) {
        console.error("Error fetching reviews:", err);
      }
    };
    fetchReviews();
  }, []);

  return (
    <section className="py-5 bg-black text-white">
      <div className="container">
        <h2 className="text-center text-success fw-bold mb-5">Client Reviews</h2>
        
        <Swiper
          modules={[Autoplay, Pagination]}
          spaceBetween={30}
          slidesPerView={1}
          autoplay={{ delay: 5000 }}
          pagination={{ clickable: true }}
          breakpoints={{
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          className="pb-5"
        >
          {reviews.map((rev) => (
            <SwiperSlide key={rev._id}>
              <div className="card bg-dark border-secondary h-100 p-4 testimonial-card">
                <div className="d-flex align-items-center mb-3">
                  <img 
                    src={rev.userPhoto} 
                    alt={rev.userName} 
                    className="rounded-circle border border-success me-3"
                    style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                  />
                  <div>
                    <h5 className="mb-0 text-white">{rev.userName}</h5>
                    <p className="small text-success mb-0">{rev.designation}</p>
                    <p className="extra-small text-secondary">{rev.location}</p>
                  </div>
                </div>
                <p className="fst-italic text-light">"{rev.reviewText}"</p>
                <div className="text-warning mt-auto">
                  {Array.from({ length: rev.rating }).map((_, i) => (
                    <i key={i} className="bi bi-star-fill me-1"></i>
                  ))}
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default Testimonials;