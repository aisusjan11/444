require('dotenv').config();

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const connectDB = require('./src/config/db');
const bookRoutes = require('./src/routes/bookRoutes');
const orderRoutes = require('./src/routes/orderRoutes');
const authRoutes = require('./src/routes/authRoutes');
const { notFound, errorHandler } = require('./src/middleware/errorMiddleware');

const app = express();

// Basic environment checks
if (!process.env.MONGODB_URI) {
  console.error('Missing MONGODB_URI in .env');
  process.exit(1);
}
if (!process.env.JWT_SECRET) {
  console.error('Missing JWT_SECRET in .env');
  process.exit(1);
}

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Static files (simple interface)
app.use(express.static('public'));

// Routes
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/orders', orderRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1);
  });
