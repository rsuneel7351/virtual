require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');

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
  max: 60
});
app.use(limiter);

// routes
app.use('/api/auth', authRoutes);
app.use('/api/preferences', prefRoutes);
app.use('/api/characters', charRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/coins', coinsRoutes);


// connect mongo
mongoose.connect(process.env.MONGO_URI, { })
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Mongo connection error', err);
  });
