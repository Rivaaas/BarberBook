/**
 * SERVICIO DE EMAIL — Frontend (simulación)
 *
 * En producción, el envío de correos se hace desde el BACKEND (Node.js).
 * Este archivo simula la notificación en el frontend para mostrar feedback al usuario.
 *
 * La integración real está en: /backend/services/emailService.js
 *
 * Opciones para implementar en el backend:
 *   - Nodemailer + Gmail App Password
 *   - Resend (resend.com) — Recomendado
 *   - SendGrid
 *   - EmailJS (si se requiere solo frontend)
 */

/**
 * Simula el envío de notificación de nueva reserva.
 * En producción, esto lo hace el backend automáticamente al crear la reserva.
 * @param {Object} booking
 */
export const sendBookingNotification = async (booking) => {
  // ── SIMULACIÓN FRONTEND ───────────────────────────────────────
  console.log('[EMAIL SIMULADO] Nueva reserva:', {
    para: 'barbero@barberbook.cl',
    cliente: booking.name,
    servicio: booking.service,
    fecha: `${booking.date} ${booking.time}`,
  });
  // ─────────────────────────────────────────────────────────────

  // ── EMAILJS (si quieres enviar desde el browser sin backend) ──
  // import emailjs from '@emailjs/browser';
  // await emailjs.send('SERVICE_ID', 'TEMPLATE_ID', {
  //   to_name: 'Barbero',
  //   from_name: booking.name,
  //   service: booking.service,
  //   date: booking.date,
  //   time: booking.time,
  //   phone: booking.phone,
  //   email: booking.email,
  //   notes: booking.notes,
  // }, 'PUBLIC_KEY');
  // ─────────────────────────────────────────────────────────────

  return true;
};

/**
 * Simula el envío de notificación de cancelación.
 * @param {Object} booking
 */
export const sendCancellationNotification = async (booking) => {
  console.log('[EMAIL SIMULADO] Reserva cancelada:', {
    para: 'barbero@barberbook.cl',
    cliente: booking.name,
    servicio: booking.service,
    fecha: `${booking.date} ${booking.time}`,
  });
  return true;
};
