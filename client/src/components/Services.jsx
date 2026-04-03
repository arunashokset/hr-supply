import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ServiceModal from './ServiceModal'; // Import the new modal

const Services = ({ user }) => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/services');
        setServices(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching services:", err);
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  const handleBookClick = (service) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  return (
    <section id="services" className="py-5 bg-black text-white">
      <div className="container">
        <h2 className="text-center mb-5 text-success fw-bold">Our Professional Services</h2>
        <div className="row g-4">
          {loading ? (
            <div className="text-center w-100"><div className="spinner-border text-success"></div></div>
          ) : (
            services.map((service) => (
              <div className="col-md-3" key={service._id}>
                <div className="card bg-dark border-secondary h-100 p-4 text-center">
                  <div className="mb-3">
                    <i className={`bi ${service.icon || 'bi-gear'} text-success fs-1`}></i>
                  </div>
                  <h4 className="text-white h5">{service.title}</h4>
                  <p className="small text-secondary">{service.description}</p>
                  
                  {/* NEW BOOK BUTTON */}
                  <button 
                    onClick={() => handleBookClick(service)} 
                    className="btn btn-success btn-sm mt-auto"
                  >
                    Book Service
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* RENDER THE MODAL */}
      <ServiceModal 
        isOpen={isModalOpen} 
        service={selectedService} 
        user={user}
        onClose={() => setIsModalOpen(false)} 
      />
    </section>
  );
};

export default Services;