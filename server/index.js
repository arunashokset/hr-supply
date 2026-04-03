const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// This is your temporary "Database" of workers
const hrSupplies = [
  { id: 1, name: "Arun", role: "Electrician", availability: "Available", rate: "25€/hr" },
  { id: 2, name: "Sarah", role: "Nurse", availability: "Busy", rate: "35€/hr" },
  { id: 3, name: "Thomas", role: "Plumber", availability: "Available", rate: "22€/hr" },
  { id: 4, name: "Julia", role: "Carer", availability: "Available", rate: "30€/hr" }
];

// Route to get the list of all technicians
app.get('/api/workers', (req, res) => {
  res.json(hrSupplies);
});

app.listen(PORT, () => {
  console.log(`✅ HR Server running on http://localhost:${PORT}`);
});