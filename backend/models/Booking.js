const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'El nombre del cliente es obligatorio'],
      trim: true,
      minlength: [2, 'El nombre debe tener al menos 2 caracteres'],
    },
    phone: {
      type: String,
      required: [true, 'El teléfono es obligatorio'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'El correo es obligatorio'],
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Ingresa un correo válido'],
    },
    service: {
      type: String,
      required: [true, 'El servicio es obligatorio'],
      enum: [
        'Corte Clásico',
        'Fade Premium',
        'Barba',
        'Corte + Barba',
        'Perfilado de Cejas',
      ],
    },
    barber: {
      type: String,
      required: [true, 'El barbero es obligatorio'],
      enum: ['Carlos Méndez', 'Diego Rojas', 'Sebastián Torres'],
    },
    date: {
      type: String,
      required: [true, 'La fecha es obligatoria'],
    },
    time: {
      type: String,
      required: [true, 'La hora es obligatoria'],
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [500, 'El comentario no puede superar los 500 caracteres'],
      default: '',
    },
    status: {
      type: String,
      enum: ['Pendiente', 'Confirmada', 'Cancelada'],
      default: 'Pendiente',
    },
    // ID del evento en Google Calendar (se guarda cuando se integre la API)
    googleCalendarEventId: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Índice para búsquedas por fecha y estado
bookingSchema.index({ date: 1, status: 1 });
bookingSchema.index({ email: 1 });

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
