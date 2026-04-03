import React from 'react';

const CoreValues = () => {
  const values = [
    { id: 1, title: "Safety First", desc: "Safeguarding, compliance, identity verification" },
    { id: 2, title: "Transparency", desc: "Clear pricing, rules, expectations" },
    { id: 3, title: "Fairness", desc: "Behaviour and reliability scoring for all" },
    { id: 4, title: "Speed", desc: "Real-time matching, instant notifications" },
    { id: 5, title: "Accountability", desc: "Escrow, evidence, disputes, audit trails" },
    { id: 6, title: "Scalability", desc: "Modular architecture, multi-sector expansion" }
  ];

  return (
    <section className="py-5 bg-black">
      <div className="container">
        <h2 className="text-center text-success fw-bold mb-5">Our Core Values</h2>
        <div className="row g-4">
          {values.map((val) => (
            <div className="col-md-6 col-lg-4" key={val.id}>
              <div className="value-card position-relative p-4 bg-dark border-secondary h-100 shadow-sm">
                {/* The Number Circle */}
                <div className="value-number position-absolute top-0 start-50 translate-middle">
                  {val.id}
                </div>
                <div className="mt-3 pt-2">
                  <h4 className="text-white h5 mb-3">{val.title}</h4>
                  <p className="text-secondary small mb-0">{val.desc}</p>
                </div>
                {/* The Accent Line from your screenshot */}
                <div className="accent-line"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CoreValues;