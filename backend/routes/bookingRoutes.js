const express = require('express');
const router = express.Router();
const {
  getAvailableSlots, getAllBookings, getBookingById,
  createBooking, updateBooking, cancelBooking,
  reactivateBooking, deleteBooking,
} = require('../controllers/bookingController');
const { validateBooking } = require('../middleware/validateBooking');
const { authenticateJWT } = require('../middleware/auth');

// Rutas públicas (clientes)
router.get('/available-slots', getAvailableSlots);   // ANTES de /:id
router.post('/', validateBooking, createBooking);

// Rutas protegidas (solo barbero autenticado)
router.get('/', authenticateJWT, getAllBookings);
router.get('/:id', authenticateJWT, getBookingById);
router.put('/:id', authenticateJWT, updateBooking);
router.patch('/cancel/:id', authenticateJWT, cancelBooking);
router.patch('/reactivate/:id', authenticateJWT, reactivateBooking);
router.delete('/:id', authenticateJWT, deleteBooking);

module.exports = router;
