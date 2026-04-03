import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ServiceModal from './ServiceModal'; // Ensure path is correct

const Fixers = ({ user }) => {
  const [fixers, setFixers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // 1. FIX: Declare these states to avoid the ReferenceError
  const [selectedFixer, setSelectedFixer] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchFixers = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/fixers');
        setFixers(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching fixers:", err);
        setLoading(false);
      }
    };
    fetchFixers();
  }, []);

  // 2. FIX: Function to handle the click
  const handleBookClick = (fixer) => {
    setSelectedFixer({
      title: `Service with ${fixer.name}`,
      category: fixer.profession,
      fixerId: fixer._id // This passes the ID to the modal
    });
    setIsModalOpen(true);
  };

  return (
    <section id="fixers" className="py-5 bg-dark">
      <div className="container">
        <h2 className="text-center mb-5 text-success">Top Rated Fixers</h2>
        <div className="row g-4">
          {loading ? (
            <div className="text-center w-100"><div className="spinner-border text-success"></div></div>
          ) : (
            fixers.map((fixer) => (
              <div className="col-md-3" key={fixer._id}>
                <div className="card bg-black p-3 text-center text-white h-100">
                  <h5 className="text-success">{fixer.name}</h5>
                  <p className="small text-secondary">{fixer.profession}</p>
                  <p className="small">{fixer.loc} | {fixer.rate}/hr</p>
                  <button 
                    onClick={() => handleBookClick(fixer)} 
                    className="btn btn-outline-success btn-sm mt-auto"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 3. FIX: Ensure the modal uses the correct variable names */}
      <ServiceModal 
        isOpen={isModalOpen} 
        service={selectedFixer} 
        user={user} 
        onClose={() => setIsModalOpen(false)} 
      />
    </section>
  );
};

export default Fixers;