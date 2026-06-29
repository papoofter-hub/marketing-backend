const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());

// Geocode a location name → lat/lon
app.get('/geocode', async (req, res) => {
  const q = req.query.q || '';
  try {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=1`;
    const r = await fetch(url, { headers: { 'User-Agent': 'MarketingLeadAgent/1.0' } });
    const data = await r.json();
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Search nearby businesses via Overpass
app.get('/places', async (req, res) => {
  const query = req.query.query || '';
  const overpassQuery = `[out:json][timeout:15];(${query});out body 20;`;
  try {
    const r = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      body: 'data=' + encodeURIComponent(overpassQuery),
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
    const data = await r.json();
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Running on port ${PORT}`));