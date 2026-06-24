const Booking = require('../models/Booking');
const { sendBookingNotification, sendCancellationNotification,
        sendClientBookingConfirmation, sendClientCancellationNotification } = require('../services/emailService');
const { createGoogleCalendarEvent, deleteGoogleCalendarEvent } = require('../services/calendarService');

const ALL_TIME_SLOTS = [
  '09:00','09:15','09:30','09:45',
  '10:00','10:15','10:30','10:45',
  '11:00','11:15','11:30','11:45',
  '12:00','12:15','12:30','12:45',
  '13:00','13:15','13:30','13:45',
  '14:00','14:15','14:30','14:45',
  '15:00','15:15','15:30','15:45',
  '16:00','16:15','16:30','16:45',
  '17:00','17:15','17:30','17:45',
  '18:00','18:15','18:30','18:45',
  '19:00','19:15','19:30','19:45',
];

const SERVICE_DURATIONS = {
  'Corte Clásico': 30,
  'Fade Premium': 45,
  'Barba': 25,
  'Corte + Barba': 60,
  'Perfilado de Cejas': 15,
};

const timeToMinutes = (t) => {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
};

// Verifica si dos rangos de tiempo se solapan
const hasOverlap = (startA, endA, startB, endB) => startA < endB && endA > startB;

// GET /api/bookings/available-slots?date=&barber=&service=
const getAvailableSlots = async (req, res, next) => {
  try {
    const { date, barber, service } = req.query;
    if (!date || !barber) {
      return res.status(400).json({ success: false, message: 'date y barber son requeridos.' });
    }

    // Duración del nuevo servicio que quiere reservar el cliente
    const newServiceDuration = SERVICE_DURATIONS[service] || 30;

    const activeBookings = await Booking.find({ date, barber, status: { $ne: 'Cancelada' } });

    // Rangos ocupados por reservas existentes (inicio + duración del servicio de cada una)
    const bookedRanges = activeBookings.map((b) => ({
      start: timeToMinutes(b.time),
      end: timeToMinutes(b.time) + (SERVICE_DURATIONS[b.service] || 30),
    }));

    // Un slot está disponible si el rango [slot, slot + newDuration] no se solapa
    // con ningún rango existente
    const available = ALL_TIME_SLOTS.filter((slot) => {
      const newStart = timeToMinutes(slot);
      const newEnd = newStart + newServiceDuration;
      return !bookedRanges.some((r) => hasOverlap(newStart, newEnd, r.start, r.end));
    });

    res.json({ success: true, data: available, total: available.length });
  } catch (error) {
    next(error);
  }
};

// GET /api/bookings
const getAllBookings = async (req, res, next) => {
  try {
    const { status, date, barber, service } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (date) filter.date = date;
    if (barber) filter.barber = barber;
    if (service) filter.service = service;

    const bookings = await Booking.find(filter).sort({ date: 1, time: 1 });
    res.json({ success: true, count: bookings.length, data: bookings });
  } catch (error) {
    next(error);
  }
};

// GET /api/bookings/:id
const getBookingById = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ success: false, message: 'Reserva no encontrada.' });
    res.json({ success: true, data: booking });
  } catch (error) {
    next(error);
  }
};

// POST /api/bookings
const createBooking = async (req, res, next) => {
  try {
    const { date, time, barber, service } = req.body;

    // Detectar conflictos de horario (solapamiento de duración)
    const activeBookings = await Booking.find({ date, barber, status: { $ne: 'Cancelada' } });
    const newStart = timeToMinutes(time);
    const newEnd = newStart + (SERVICE_DURATIONS[service] || 30);

    const conflict = activeBookings.find((b) => {
      const existStart = timeToMinutes(b.time);
      const existEnd = existStart + (SERVICE_DURATIONS[b.service] || 30);
      return hasOverlap(newStart, newEnd, existStart, existEnd);
    });

    if (conflict) {
      return res.status(409).json({
        success: false,
        message: 'Esta hora ya se encuentra reservada. Por favor seleccione otro horario.',
      });
    }

    const booking = await Booking.create(req.body);

    // Notificaciones (sin bloquear la respuesta si fallan)
    Promise.all([
      sendBookingNotification(booking),
      sendClientBookingConfirmation(booking),
      createGoogleCalendarEvent(booking).then((id) => {
        if (id) { booking.googleCalendarEventId = id; return booking.save(); }
      }),
    ]).catch((err) => console.error('Error en notificaciones post-reserva:', err.message));

    res.status(201).json({
      success: true,
      message: 'Reserva creada correctamente.',
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/bookings/:id
const updateBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!booking) return res.status(404).json({ success: false, message: 'Reserva no encontrada.' });
    res.json({ success: true, message: 'Reserva actualizada.', data: booking });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/bookings/cancel/:id
const cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ success: false, message: 'Reserva no encontrada.' });
    if (booking.status === 'Cancelada') {
      return res.status(400).json({ success: false, message: 'La reserva ya está cancelada.' });
    }

    booking.status = 'Cancelada';
    await booking.save();

    Promise.all([
      sendCancellationNotification(booking),
      sendClientCancellationNotification(booking),
      booking.googleCalendarEventId ? deleteGoogleCalendarEvent(booking.googleCalendarEventId) : Promise.resolve(),
    ]).catch((err) => console.error('Error en notificaciones post-cancelación:', err.message));

    res.json({ success: true, message: 'Reserva cancelada. Se notificó al barbero y al cliente.', data: booking });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/bookings/reactivate/:id
const reactivateBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ success: false, message: 'Reserva no encontrada.' });
    if (booking.status !== 'Cancelada') {
      return res.status(400).json({ success: false, message: 'Solo se pueden reactivar reservas canceladas.' });
    }

    // Verificar que el horario sigue disponible
    const activeBookings = await Booking.find({
      date: booking.date,
      barber: booking.barber,
      status: { $ne: 'Cancelada' },
      _id: { $ne: booking._id },
    });

    const newStart = timeToMinutes(booking.time);
    const newEnd = newStart + (SERVICE_DURATIONS[booking.service] || 30);

    const conflict = activeBookings.find((b) => {
      const s = timeToMinutes(b.time);
      return hasOverlap(newStart, newEnd, s, s + (SERVICE_DURATIONS[b.service] || 30));
    });

    if (conflict) {
      return res.status(409).json({
        success: false,
        message: 'No se puede reactivar. El horario ya está ocupado por otra reserva.',
      });
    }

    booking.status = 'Pendiente';
    const eventId = await createGoogleCalendarEvent(booking);
    if (eventId) booking.googleCalendarEventId = eventId;
    await booking.save();

    Promise.all([
      sendBookingNotification(booking),
      sendClientBookingConfirmation(booking),
    ]).catch((err) => console.error('Error en notificaciones post-reactivación:', err.message));

    res.json({ success: true, message: 'Reserva reactivada correctamente.', data: booking });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/bookings/:id
const deleteBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) return res.status(404).json({ success: false, message: 'Reserva no encontrada.' });
    res.json({ success: true, message: 'Reserva eliminada.' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAvailableSlots,
  getAllBookings,
  getBookingById,
  createBooking,
  updateBooking,
  cancelBooking,
  reactivateBooking,
  deleteBooking,
};
