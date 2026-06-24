require('dotenv').config(); // DEBE ir primero

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const bookingRoutes = require('./routes/bookingRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const authRoutes = require('./routes/authRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

connectDB();

const allowedOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(',').map((o) => o.trim())
  : ['http://localhost:3000'];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error(`CORS: origen no permitido → ${origin}`));
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/services', serviceRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'BarberBook API funcionando', timestamp: new Date() });
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🔥 BarberBook API corriendo en http://localhost:${PORT}`);
  console.log(`📋 Ambiente: ${process.env.NODE_ENV}`);
  console.log(`📡 MongoDB: ${process.env.MONGODB_URI}\n`);
});

module.exports = app;
