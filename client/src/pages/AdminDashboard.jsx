// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const AdminDashboard = () => {
//   const [fixers, setFixers] = useState([]);
//   const [activeTab, setActiveTab] = useState('fixers');

//   // Fetch data from MongoDB
//   useEffect(() => {
//     axios.get('http://localhost:5000/api/admin/fixers')
//       .then(res => setFixers(res.data))
//       .catch(err => console.log(err));
//   }, []);

//   const deleteFixer = (id) => {
//     axios.delete(`http://localhost:5000/api/admin/fixers/${id}`)
//       .then(() => setFixers(fixers.filter(f => f._id !== id)));
//   };

//   return (
//     <div className="container-fluid bg-dark text-white min-vh-100 p-4">
//       <h1 className="text-success border-bottom pb-3">HR-SUPPLY Admin</h1>
      
//       <div className="row mt-4">
//         {/* Sidebar */}
//         <div className="col-md-2">
//           <button onClick={() => setActiveTab('fixers')} className="btn btn-outline-success w-100 mb-2">Manage Fixers</button>
//           <button onClick={() => setActiveTab('users')} className="btn btn-outline-success w-100 mb-2">Manage Users</button>
//           <button onClick={() => setActiveTab('bookings')} className="btn btn-outline-success w-100 mb-2">Bookings</button>
//         </div>

//         {/* Content Area */}
//         <div className="col-md-10">
//           <div className="bg-black p-4 rounded-4 border border-secondary">
//             <h3>{activeTab.toUpperCase()} Management</h3>
//             <table className="table table-dark table-hover mt-3">
//               <thead>
//                 <tr>
//                   <th>Name</th>
//                   <th>Location</th>
//                   <th>Rate</th>
//                   <th>Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {fixers.map(fixer => (
//                   <tr key={fixer._id}>
//                     <td>{fixer.name}</td>
//                     <td>{fixer.location}</td>
//                     <td>{fixer.rate}€</td>
//                     <td>
//                       <button className="btn btn-sm btn-warning me-2">Edit</button>
//                       <button onClick={() => deleteFixer(fixer._id)} className="btn btn-sm btn-danger">Delete</button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//             <button className="btn btn-success mt-3">+ Add New {activeTab.slice(0,-1)}</button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;

import React from 'react';

const AdminDashboard = () => {
  return (
    <div className="container-fluid bg-dark text-white min-vh-100 p-0">
      <div className="row g-0">
        {/* Sidebar */}
        <div className="col-md-2 bg-black border-end border-secondary min-vh-100 p-3">
          <h4 className="text-success fw-bold mb-4">HR-ADMIN</h4>
          <ul className="nav flex-column">
            <li className="nav-item mb-2"><button className="btn btn-link text-white text-decoration-none">Fixers</button></li>
            <li className="nav-item mb-2"><button className="btn btn-link text-secondary text-decoration-none">Users</button></li>
            <li className="nav-item mb-2"><button className="btn btn-link text-secondary text-decoration-none">Bookings</button></li>
          </ul>
        </div>

        {/* Main Content */}
        <div className="col-md-10 p-5">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2>Manage Fixers</h2>
            <button className="btn btn-success">+ Add New Fixer</button>
          </div>
          
          <table className="table table-dark table-hover border border-secondary">
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Location</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {/* Data will be mapped here from MongoDB */}
              <tr>
                <td>Arun Ashok</td>
                <td>Developer</td>
                <td>Nidda</td>
                <td><span className="badge bg-success">Active</span></td>
                <td>
                  <button className="btn btn-sm btn-outline-info me-2">Edit</button>
                  <button className="btn btn-sm btn-outline-danger">Delete</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;