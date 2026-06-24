/**
 * SERVICIO DE GOOGLE CALENDAR — Frontend (simulación)
 *
 * En producción, la creación de eventos se hace desde el BACKEND (Node.js).
 * Este archivo simula la acción en el frontend para mostrar feedback al usuario.
 *
 * La integración real está en: /backend/services/calendarService.js
 *
 * Para implementar en el backend:
 *   1. npm install googleapis
 *   2. Configurar OAuth 2.0 en Google Cloud Console
 *   3. El barbero autoriza con su cuenta Google
 *   4. Guardar refresh_token en .env
 *   5. Descomentar implementación en backend/services/calendarService.js
 */

/**
 * Simula la creación de un evento en Google Calendar.
 * En producción, esto lo hace el backend automáticamente.
 * @param {Object} booking
 */
export const createGoogleCalendarEvent = async (booking) => {
  console.log('[CALENDAR SIMULADO] Evento creado:', {
    titulo: `✂️ ${booking.service} — ${booking.name}`,
    inicio: `${booking.date} ${booking.time}`,
    cliente: booking.name,
  });
  return `simulated_event_${Date.now()}`;
};

/**
 * Simula la eliminación de un evento de Google Calendar.
 * @param {string} eventId
 */
export const deleteGoogleCalendarEvent = async (eventId) => {
  console.log('[CALENDAR SIMULADO] Evento eliminado:', eventId);
  return true;
};
