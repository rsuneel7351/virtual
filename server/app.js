require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');
const path = require('path'); // <-- 1. IMPORT THE PATH MODULE

const authRoutes = require('./routes/auth');
const prefRoutes = require('./routes/preferences');
const charRoutes = require('./routes/characters');
const chatRoutes = require('./routes/chat');
const coinsRoutes = require('./routes/coins');

const app = express();
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

const PORT = process.env.PORT || 4000;

// basic rate limiter (tune for prod)
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100 // Increased limit slightly for a combined API/frontend server
});
app.use(limiter);

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/preferences', prefRoutes);
app.use('/api/characters', charRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/coins', coinsRoutes);

// --- 2. SERVE STATIC FILES FROM THE REACT BUILD FOLDER ---
const buildPath = path.join(__dirname, '..', 'dist');
app.use(express.static(buildPath));

// --- 3. HANDLE CLIENT-SIDE ROUTING (React Router) ---
// This is a "catch-all" route that sends back the index.html file for any request
// that doesn't match an API route or a static file.
app.get('*', (req, res) => {
  res.sendFile(path.join(buildPath, 'index.html'));
});


// connect mongo
mongoose.connect(process.env.MONGO_URI, { })
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Frontend is being served from: ${buildPath}`);
    });
  })
  .catch(err => {
    console.error('Mongo connection error', err);
  });
