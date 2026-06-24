const { google } = require('googleapis');

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  'urn:ietf:wg:oauth:2.0:oob'
);

const REFRESH_TOKEN = process.env.GOOGLE_REFRESH_TOKEN;
const IS_CONFIGURED = REFRESH_TOKEN && REFRESH_TOKEN !== 'tu_refresh_token_aqui';

if (IS_CONFIGURED) {
  oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });
  console.log('✅ Google Calendar configurado correctamente');
} else {
  console.warn('⚠️  Google Calendar no configurado — ejecuta: node scripts/getGoogleToken.js');
}

const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

const SERVICE_DURATIONS = {
  'Corte Clásico': 30,
  'Fade Premium': 45,
  'Barba': 25,
  'Corte + Barba': 60,
  'Perfilado de Cejas': 15,
};

const addMinutesToTime = (time, minutes) => {
  const [h, m] = time.split(':').map(Number);
  const total = h * 60 + m + minutes;
  const newH = Math.floor(total / 60) % 24;
  const newM = total % 60;
  return `${String(newH).padStart(2, '0')}:${String(newM).padStart(2, '0')}`;
};

const buildCalendarEvent = (booking) => {
  const duration = SERVICE_DURATIONS[booking.service] || 30;
  const endTime = addMinutesToTime(booking.time, duration);

  return {
    summary: `✂️ ${booking.service} — ${booking.name}`,
    description: [
      `Cliente: ${booking.name}`,
      `Teléfono: ${booking.phone}`,
      `Correo: ${booking.email}`,
      `Servicio: ${booking.service}`,
      `Duración: ${duration} minutos`,
      booking.notes ? `Comentario: ${booking.notes}` : '',
    ].filter(Boolean).join('\n'),
    start: {
      dateTime: `${booking.date}T${booking.time}:00`,
      timeZone: 'America/Santiago',
    },
    end: {
      dateTime: `${booking.date}T${endTime}:00`,
      timeZone: 'America/Santiago',
    },
    attendees: [{ email: booking.email, displayName: booking.name }],
    reminders: {
      useDefault: false,
      overrides: [
        { method: 'email', minutes: 60 },
        { method: 'popup', minutes: 30 },
      ],
    },
    colorId: '5',
  };
};

/**
 * Crea un evento en Google Calendar del barbero.
 * @returns {string|null} ID del evento creado
 */
const createGoogleCalendarEvent = async (booking) => {
  if (!IS_CONFIGURED) {
    console.log('📅 [CALENDAR] No configurado — omitiendo creación de evento');
    return null;
  }

  try {
    const event = buildCalendarEvent(booking);
    const response = await calendar.events.insert({
      calendarId: process.env.GOOGLE_CALENDAR_ID || 'primary',
      resource: event,
    });
    console.log(`✅ Evento creado en Google Calendar: ${response.data.id}`);
    return response.data.id;
  } catch (error) {
    console.error('❌ Error creando evento en Google Calendar:');
    console.error('   Código:', error.code);
    console.error('   Mensaje:', error.message);
    return null;
  }
};

/**
 * Elimina un evento de Google Calendar (al cancelar reserva).
 */
const deleteGoogleCalendarEvent = async (eventId) => {
  if (!IS_CONFIGURED || !eventId) return;

  try {
    await calendar.events.delete({
      calendarId: process.env.GOOGLE_CALENDAR_ID || 'primary',
      eventId,
    });
    console.log(`✅ Evento eliminado de Google Calendar: ${eventId}`);
  } catch (error) {
    console.error('❌ Error eliminando evento de Google Calendar:', error.message);
  }
};

/**
 * Actualiza un evento existente en Google Calendar.
 */
const updateGoogleCalendarEvent = async (eventId, booking) => {
  if (!IS_CONFIGURED || !eventId) return;

  try {
    const event = buildCalendarEvent(booking);
    await calendar.events.update({
      calendarId: process.env.GOOGLE_CALENDAR_ID || 'primary',
      eventId,
      resource: event,
    });
    console.log(`✅ Evento actualizado en Google Calendar: ${eventId}`);
  } catch (error) {
    console.error('❌ Error actualizando evento de Google Calendar:', error.message);
  }
};

module.exports = {
  createGoogleCalendarEvent,
  deleteGoogleCalendarEvent,
  updateGoogleCalendarEvent,
};
