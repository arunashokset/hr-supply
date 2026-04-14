import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Logo from '../assets/images/logo.webp';

const AdminDashboard = ({ onLogout }) => {
  const navigate = useNavigate();
  const [banners, setBanners] = useState([]);
  const [sections, setSections] = useState([]);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Modal and Editing State
  const [showModal, setShowModal] = useState(false);
  const [showSectionModal, setShowSectionModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  // --- Initial States ---
  const initialFormState = {
    title: '', subtitle: '', buttonText: 'Hire Now',
    showButton: true, alignment: 'center', contentType: 'video', isActive: true
  };

  const initialSectionState = {
    sectionName: '',
    title: '',
    subtitle: '',
    content: '',
    layoutType: 'standard',
    mediaType: 'none',
    imagePosition: 'top',
    showButton: false,
    buttonText: '',
    formType: 'contact',
    isActive: true,
    order: 0
  };

  const [formData, setFormData] = useState(initialFormState);
  const [sectionData, setSectionData] = useState(initialSectionState);
  const [videoFile, setVideoFile] = useState(null);
  const [sectionMediaFile, setSectionMediaFile] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('hr_user');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        if (user.role === 'admin') {
          setIsAuthorized(true);
          setIsLoading(false);
          fetchBanners();
          fetchSections();
        } else { navigate('/login', { replace: true }); }
      } catch (e) { navigate('/login', { replace: true }); }
    } else { navigate('/login', { replace: true }); }
  }, [navigate]);

  const fetchBanners = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/banners');
      setBanners(res.data);
    } catch (err) { console.error("Error fetching banners:", err); }
  };

  const fetchSections = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/sections');
      setSections(res.data);
    } catch (err) { console.error("Error fetching sections:", err); }
  };

  // --- Banner Handlers ---
  const handleBannerSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    if (videoFile) data.append('video', videoFile);

    try {
      if (isEditing) await axios.put(`http://localhost:5000/api/banners/${editId}`, data);
      else await axios.post('http://localhost:5000/api/banners/add', data);
      resetForm();
      fetchBanners();
    } catch (err) { alert("Banner action failed."); }
  };

  const toggleBannerStatus = async (banner) => {
    try {
      const newStatus = !banner.isActive;
      await axios.put(`http://localhost:5000/api/banners/${banner._id}`, { ...banner, isActive: newStatus });
      setBanners(banners.map(b => b._id === banner._id ? { ...b, isActive: newStatus } : b));
    } catch (err) { alert("Status update failed"); }
  };

  const deleteBanner = async (id) => {
    if (window.confirm("Delete this banner?")) {
      await axios.delete(`http://localhost:5000/api/banners/${id}`);
      fetchBanners();
    }
  };

  // --- Section Handlers ---
  const handleSectionSubmit = async (e) => {
  e.preventDefault();
  
  const data = new FormData();
  
  // Explicitly append fields to ensure they are present
  data.append('sectionName', sectionData.sectionName);
  data.append('title', sectionData.title);
  data.append('subtitle', sectionData.subtitle || "");
  data.append('content', sectionData.content || "");
  data.append('layoutType', sectionData.layoutType);
  data.append('mediaType', sectionData.mediaType);
  data.append('imagePosition', sectionData.imagePosition);
  data.append('order', sectionData.order || 0);
  data.append('showButton', sectionData.showButton);
  data.append('buttonText', sectionData.buttonText || "");
  data.append('formType', sectionData.formType || "contact");
  data.append('isActive', sectionData.isActive);

  // Match the key name 'media' used in backend upload.single('media')
  if (sectionMediaFile) {
    data.append('media', sectionMediaFile);
  }

  try {
    const config = { headers: { 'Content-Type': 'multipart/form-data' } };
    
    if (isEditing) {
      await axios.put(`http://localhost:5000/api/sections/${editId}`, data, config);
    } else {
      await axios.post('http://localhost:5000/api/sections/add', data, config);
    }
    
    resetSectionForm();
    fetchSections();
  } catch (err) {
    console.error("Server Response Error:", err.response?.data);
    alert(err.response?.data?.message || "Section action failed.");
  }
};

  const toggleSectionStatus = async (section) => {
    try {
      const newStatus = !section.isActive;
      await axios.put(`http://localhost:5000/api/sections/${section._id}`, { ...section, isActive: newStatus });
      setSections(sections.map(s => s._id === section._id ? { ...s, isActive: newStatus } : s));
    } catch (err) { alert("Toggle failed"); }
  };

  const deleteSection = async (id) => {
    if (window.confirm("Permanently delete this section?")) {
      await axios.delete(`http://localhost:5000/api/sections/${id}`);
      fetchSections();
    }
  };

  // --- Resets ---
  const resetForm = () => {
    setFormData(initialFormState);
    setVideoFile(null);
    setIsEditing(false);
    setEditId(null);
    setShowModal(false);
  };

  const resetSectionForm = () => {
    setSectionData(initialSectionState);
    setSectionMediaFile(null);
    setIsEditing(false);
    setEditId(null);
    setShowSectionModal(false);
  };

  if (isLoading || !isAuthorized) return <div className="bg-black min-vh-100 text-white p-5 text-center">Loading...</div>;

  return (
    <div className="bg-black min-vh-100 text-white p-5">
      {/* 1. HEADER */}
      <div className="mb-5 d-flex align-items-center justify-content-between">
        <div style={{ flex: 1 }}><img src={Logo} alt="Logo" style={{ maxWidth: '140px' }} /></div>
        <div style={{ flex: 2 }} className="text-center"><h1 className="text-warning fw-bold mb-0">Zupply Control Center</h1></div>
        <div style={{ flex: 1 }} className="d-flex justify-content-end">
          <button className="btn btn-outline-danger btn-sm fw-bold px-3" onClick={onLogout}>Logout</button>
        </div>
      </div>

      {/* 2. BANNERS TABLE (FIRST) */}
      <div className="table-responsive bg-dark p-4 rounded shadow border border-secondary mb-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3 className="text-white mb-0">Hero Banners</h3>
          <button className="btn btn-success fw-bold px-4" onClick={() => { setIsEditing(false); setShowModal(true); }}>+ Add New Banner</button>
        </div>
        <table className="table table-dark table-hover border-secondary">
          <thead>
            <tr>
              <th>Type</th>
              <th>Alignment</th>
              <th>Title</th>
              <th className="text-center">Live Status</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {banners.map(b => (
              <tr key={b._id} className="align-middle">
                <td>{b.contentType === 'image' ? '🖼️' : '🎥'}</td>
                <td className="text-capitalize small">{b.alignment}</td>
                <td className="fw-bold">{b.title}</td>
                <td className="text-center">
                  <div className="form-check form-switch d-inline-block">
                    <input className="form-check-input" type="checkbox" checked={b.isActive} onChange={() => toggleBannerStatus(b)} />
                  </div>
                </td>
                <td className="text-center">
                  <button onClick={() => { setIsEditing(true); setEditId(b._id); setFormData(b); setShowModal(true); }} className="btn btn-outline-primary btn-sm me-2">Edit</button>
                  <button onClick={() => deleteBanner(b._id)} className="btn btn-outline-danger btn-sm">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 3. SECTIONS TABLE (SECOND) */}
      <div className="table-responsive bg-dark p-4 rounded shadow border border-secondary">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3 className="text-white mb-0">Website Sections</h3>
          <button className="btn btn-warning fw-bold px-4" onClick={() => { setIsEditing(false); setShowSectionModal(true); }}>+ Create Universal Section</button>
        </div>
        <table className="table table-dark table-hover border-secondary">
          <thead>
            <tr>
              <th>Internal Name</th>
              <th>Layout</th>
              <th>Order</th>
              <th className="text-center">Status</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sections.sort((a, b) => a.order - b.order).map(s => (
              <tr key={s._id} className="align-middle">
                <td className="fw-bold">{s.sectionName || "Untitled Section"}</td>
                <td className="text-uppercase small text-warning">{s.layoutType}</td>
                <td>{s.order}</td>
                <td className="text-center">
                  <div className="form-check form-switch d-inline-block">
                    <input className="form-check-input" type="checkbox" checked={s.isActive} onChange={() => toggleSectionStatus(s)} />
                  </div>
                </td>
                <td className="text-center">
                  <button onClick={() => { setIsEditing(true); setEditId(s._id); setSectionData(s); setShowSectionModal(true); }} className="btn btn-outline-primary btn-sm me-2">Edit</button>
                  <button onClick={() => deleteSection(s._id)} className="btn btn-outline-danger btn-sm">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* --- BANNER MODAL --- */}
      {showModal && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 1050 }}>
          <div className="card bg-dark border-secondary p-4 shadow-lg w-100" style={{ maxWidth: '700px' }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h3 className="text-white mb-0">{isEditing ? "📝 Edit Banner" : "✨ New Banner"}</h3>
              <button className="btn-close btn-close-white" onClick={resetForm}></button>
            </div>
            <form onSubmit={handleBannerSubmit} className="row g-3">
              <div className="col-md-6">
                <label className="text-muted small">Content Type</label>
                <select className="form-select bg-black text-white border-secondary" value={formData.contentType} onChange={(e) => setFormData({ ...formData, contentType: e.target.value })}>
                  <option value="video">🎥 Video</option><option value="image">🖼️ Photo</option>
                </select>
              </div>
              <div className="col-md-6">
                <label className="text-muted small">Alignment</label>
                <select className="form-select bg-black text-white border-secondary" value={formData.alignment} onChange={(e) => setFormData({ ...formData, alignment: e.target.value })}>
                  <option value="left">Left</option><option value="center">Center</option><option value="right">Right</option>
                </select>
              </div>
              <div className="col-md-6"><input type="text" placeholder="Title" className="form-control bg-black text-white border-secondary" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required /></div>
              <div className="col-md-6"><input type="text" placeholder="Subtitle" className="form-control bg-black text-white border-secondary" value={formData.subtitle} onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })} /></div>
              <div className="col-md-4">
                <div className="form-check form-switch mt-2">
                  <input className="form-check-input" type="checkbox" checked={formData.showButton} onChange={(e) => setFormData({ ...formData, showButton: e.target.checked })} />
                  <span className="ms-2 small text-white">Button {formData.showButton ? "On" : "Off"}</span>
                </div>
              </div>
              <div className="col-md-8">
                <input type="text" placeholder="Button Text" className="form-control bg-black text-white border-secondary" value={formData.buttonText} onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })} disabled={!formData.showButton} />
              </div>
              <div className="col-md-12"><input type="file" className="form-control bg-black text-white border-secondary" onChange={(e) => setVideoFile(e.target.files[0])} required={!isEditing} /></div>
              <div className="col-12 mt-4 d-flex gap-2">
                <button type="submit" className="btn btn-success flex-grow-1">{isEditing ? "Update" : "Publish"}</button>
                <button type="button" className="btn btn-outline-light px-4" onClick={resetForm}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- UNIVERSAL SECTION MODAL --- */}
      {/* 🟢 UNIVERSAL SECTION MODAL */}
      {showSectionModal && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100"
          style={{
            backgroundColor: 'rgba(0,0,0,0.9)',
            zIndex: 1100,
            overflowY: 'auto', // Allows the background to scroll
            paddingTop: '20px',
            paddingBottom: '20px'
          }}
        >
          {/* Removed align-items-center to prevent "Middle-Out" cutoff */}
          <div className="d-flex justify-content-center">
            <div className="card bg-dark border-warning p-4 shadow-lg w-100" style={{ maxWidth: '850px', marginBottom: '50px' }}>
              <div className="d-flex justify-content-between align-items-center mb-4 border-bottom border-secondary pb-3">
                <h3 className="text-warning fw-bold mb-0">
                  {isEditing ? "📝 Edit Section" : "📂 Section Builder"}
                </h3>
                <button className="btn-close btn-close-white" onClick={resetSectionForm}></button>
              </div>

              <form onSubmit={handleSectionSubmit} className="row g-3">
                {/* Internal ID & Sort */}
                <div className="col-md-8">
                  <label className="text-muted small">Internal Name</label>
                  <input type="text" className="form-control bg-black text-white border-secondary" value={sectionData.sectionName} onChange={(e) => setSectionData({ ...sectionData, sectionName: e.target.value })} placeholder="e.g. Home About Us" required />
                </div>
                <div className="col-md-4">
                  <label className="text-muted small">Order</label>
                  <input type="number" className="form-control bg-black text-white border-secondary" value={sectionData.order} onChange={(e) => setSectionData({ ...sectionData, order: e.target.value })} />
                </div>

                {/* Rest of your form fields... */}
                <div className="col-md-6"><label className="text-muted small">Display Title</label><input type="text" className="form-control bg-black text-white border-secondary" value={sectionData.title} onChange={(e) => setSectionData({ ...sectionData, title: e.target.value })} required /></div>
                <div className="col-md-6"><label className="text-muted small">Display Subtitle</label><input type="text" className="form-control bg-black text-white border-secondary" value={sectionData.subtitle} onChange={(e) => setSectionData({ ...sectionData, subtitle: e.target.value })} /></div>
                <div className="col-md-12"><label className="text-muted small">Content</label><textarea rows="3" className="form-control bg-black text-white border-secondary" value={sectionData.content} onChange={(e) => setSectionData({ ...sectionData, content: e.target.value })} /></div>

                <div className="col-md-4">
                  <label className="text-muted small">Media Type</label>
                  <select className="form-select bg-black text-white border-secondary" value={sectionData.mediaType} onChange={(e) => setSectionData({ ...sectionData, mediaType: e.target.value })}>
                    <option value="none">None</option><option value="image">🖼️ Image</option><option value="video">🎥 Video</option>
                  </select>
                </div>
                <div className="col-md-4">
                  <label className="text-muted small">Position</label>
                  <select className="form-select bg-black text-white border-secondary" value={sectionData.imagePosition} onChange={(e) => setSectionData({ ...sectionData, imagePosition: e.target.value })}>
                    <option value="top">Top</option><option value="left">Left</option><option value="right">Right</option><option value="background">Background</option>
                  </select>
                </div>
                <div className="col-md-4"><label className="text-muted small">File</label><input type="file" className="form-control bg-black text-white border-secondary" onChange={(e) => setSectionMediaFile(e.target.files[0])} disabled={sectionData.mediaType === 'none'} /></div>

                <div className="col-md-4">
                  <label className="text-muted small">Pattern</label>
                  <select className="form-select bg-black text-white border-secondary" value={sectionData.layoutType} onChange={(e) => setSectionData({ ...sectionData, layoutType: e.target.value })}>
                    <option value="standard">Standard</option><option value="slider">Slider</option><option value="card">Cards</option><option value="form">Form</option>
                  </select>
                </div>

                {sectionData.layoutType === 'form' && (
                  <div className="col-md-4">
                    <label className="text-muted small">Form Type</label>
                    <select className="form-select bg-black text-white border-secondary" value={sectionData.formType} onChange={(e) => setSectionData({ ...sectionData, formType: e.target.value })}>
                      <option value="contact">Contact</option><option value="booking">Booking</option>
                    </select>
                  </div>
                )}

                <div className="col-md-4 d-flex align-items-end pb-2">
                  <div className="form-check form-switch">
                    <input className="form-check-input" type="checkbox" checked={sectionData.showButton} onChange={(e) => setSectionData({ ...sectionData, showButton: e.target.checked })} />
                    <label className="small ms-2 text-white">Button</label>
                  </div>
                </div>

                <div className="col-md-12 mt-4 pt-3 border-top border-secondary d-flex gap-2">
                  <button type="submit" className="btn btn-warning flex-grow-1 fw-bold">{isEditing ? "SAVE CHANGES" : "DEPLOY SECTION"}</button>
                  <button type="button" className="btn btn-outline-light px-4" onClick={resetSectionForm}>CANCEL</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;