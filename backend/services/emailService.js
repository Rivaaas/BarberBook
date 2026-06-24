const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

transporter.verify((error) => {
  if (error) {
    console.error('\n❌ ERROR DE CORREO — Credenciales Gmail inválidas:');
    console.error('   Código:', error.code, '|', error.message);
  } else {
    console.log('✅ Servidor de correo listo — Gmail autenticado correctamente');
  }
});

const BARBER_EMAIL = process.env.GMAIL_USER;

// ─── Plantillas HTML ──────────────────────────────────────────────────────────

const headerHTML = (bg, title, subtitle) => `
  <div style="background:${bg};padding:28px 32px;text-align:center;">
    <h1 style="margin:0;color:#0F0F0F;font-size:22px;font-weight:900;">✂️ BarberBook Studio</h1>
    <p style="margin:6px 0 0;color:#333;font-size:14px;">${title}</p>
    ${subtitle ? `<p style="margin:4px 0 0;color:#555;font-size:12px;">${subtitle}</p>` : ''}
  </div>`;

const footerHTML = () => `
  <div style="padding:16px 32px;background:#111;text-align:center;font-size:11px;color:#555;border-top:1px solid #222;">
    BarberBook Studio · Av. Providencia 1234 · Santiago · contacto@barberbook.cl
  </div>`;

const wrapHTML = (inner) => `
  <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#1a1a1a;color:#fff;border-radius:10px;overflow:hidden;border:1px solid #2a2a2a;">
    ${inner}
    ${footerHTML()}
  </div>`;

const rowHTML = (label, value, highlight = false) => `
  <tr>
    <td style="padding:10px 0;color:#aaa;width:40%;font-size:14px;">${label}</td>
    <td style="padding:10px 0;font-size:14px;${highlight ? 'color:#D4AF37;font-weight:bold;' : ''}">${value}</td>
  </tr>`;

// ─── Email Barbero: Nueva Reserva ─────────────────────────────────────────────
const buildBarberBookingHTML = (b) => wrapHTML(`
  ${headerHTML('#D4AF37', 'Nueva reserva recibida')}
  <div style="padding:28px 32px;">
    <h2 style="color:#D4AF37;margin:0 0 20px;">📅 Nueva Reserva</h2>
    <table style="width:100%;border-collapse:collapse;">
      ${rowHTML('Cliente', b.name)}
      ${rowHTML('Teléfono', b.phone)}
      ${rowHTML('Correo', b.email)}
      ${rowHTML('Servicio', b.service, true)}
      ${rowHTML('Barbero', b.barber)}
      ${rowHTML('Fecha', b.date)}
      ${rowHTML('Hora', b.time + ' hrs')}
      ${b.notes ? rowHTML('Comentario', `<em>${b.notes}</em>`) : ''}
    </table>
  </div>`);

// ─── Email Barbero: Cancelación ───────────────────────────────────────────────
const buildBarberCancellationHTML = (b) => wrapHTML(`
  ${headerHTML('#ef4444', 'Reserva cancelada', 'El cliente canceló su hora')}
  <div style="padding:28px 32px;">
    <h2 style="color:#ef4444;margin:0 0 20px;">❌ Reserva Cancelada</h2>
    <table style="width:100%;border-collapse:collapse;">
      ${rowHTML('Cliente', b.name)}
      ${rowHTML('Servicio', b.service, true)}
      ${rowHTML('Barbero', b.barber)}
      ${rowHTML('Fecha', b.date)}
      ${rowHTML('Hora', b.time + ' hrs')}
    </table>
  </div>`);

// ─── Email Cliente: Confirmación de Reserva ───────────────────────────────────
const SERVICE_DURATIONS = { 'Corte Clásico':30,'Fade Premium':45,'Barba':25,'Corte + Barba':60,'Perfilado de Cejas':15 };

const buildClientConfirmationHTML = (b) => wrapHTML(`
  ${headerHTML('#D4AF37', '¡Tu hora está reservada!', 'Confirmación de reserva')}
  <div style="padding:28px 32px;">
    <h2 style="color:#D4AF37;margin:0 0 8px;">Hola, ${b.name} 👋</h2>
    <p style="color:#ccc;font-size:14px;margin:0 0 24px;line-height:1.6;">
      Tu reserva en <strong style="color:#D4AF37;">BarberBook Studio</strong> ha sido confirmada.
      Te esperamos el día indicado. ¡Nos vemos pronto!
    </p>
    <div style="background:#111;border:1px solid #2a2a2a;border-radius:8px;padding:20px;margin-bottom:20px;">
      <table style="width:100%;border-collapse:collapse;">
        ${rowHTML('📋 Servicio', b.service, true)}
        ${rowHTML('👤 Barbero', b.barber)}
        ${rowHTML('📅 Fecha', b.date)}
        ${rowHTML('🕐 Hora', b.time + ' hrs')}
        ${rowHTML('⏱ Duración', (SERVICE_DURATIONS[b.service] || 30) + ' minutos')}
        ${b.notes ? rowHTML('💬 Comentario', `<em>${b.notes}</em>`) : ''}
      </table>
    </div>
    <div style="background:#1a1a1a;border-left:3px solid #D4AF37;padding:14px 16px;border-radius:0 6px 6px 0;font-size:13px;color:#aaa;">
      📍 Av. Providencia 1234, Local 5 · Santiago<br>
      📞 +56 9 8765 4321 · ✉️ contacto@barberbook.cl<br>
      🕐 Lun–Vie 9:00–20:00 · Sáb 9:00–18:00
    </div>
    <p style="color:#666;font-size:12px;margin-top:20px;text-align:center;">
      ¿Necesitas cancelar? Contacta al barbero con al menos 2 horas de anticipación.
    </p>
  </div>`);

// ─── Email Cliente: Cancelación ───────────────────────────────────────────────
const buildClientCancellationHTML = (b) => wrapHTML(`
  ${headerHTML('#ef4444', 'Reserva cancelada', 'Tu hora fue cancelada')}
  <div style="padding:28px 32px;">
    <h2 style="color:#ef4444;margin:0 0 8px;">Hola, ${b.name}</h2>
    <p style="color:#ccc;font-size:14px;margin:0 0 24px;line-height:1.6;">
      Tu reserva en <strong style="color:#fff;">BarberBook Studio</strong> ha sido cancelada.
      Si deseas agendar nuevamente, puedes hacerlo desde nuestra web.
    </p>
    <div style="background:#111;border:1px solid #2a2a2a;border-radius:8px;padding:20px;">
      <table style="width:100%;border-collapse:collapse;">
        ${rowHTML('Servicio cancelado', b.service, true)}
        ${rowHTML('Barbero', b.barber)}
        ${rowHTML('Fecha', b.date)}
        ${rowHTML('Hora', b.time + ' hrs')}
      </table>
    </div>
    <p style="color:#666;font-size:12px;margin-top:20px;text-align:center;">
      Lamentamos el inconveniente. Puedes reservar nuevamente cuando quieras.
    </p>
  </div>`);

// ─── Funciones públicas ────────────────────────────────────────────────────────

const sendBookingNotification = async (booking) => {
  try {
    await transporter.sendMail({
      from: `BarberBook Studio <${BARBER_EMAIL}>`,
      to: BARBER_EMAIL,
      subject: `📅 Nueva reserva: ${booking.name} — ${booking.service} — ${booking.date} ${booking.time}`,
      html: buildBarberBookingHTML(booking),
    });
    console.log(`✅ Correo de reserva enviado al barbero (${BARBER_EMAIL})`);
  } catch (error) {
    console.error('❌ Error correo barbero (reserva):', error.message);
  }
};

const sendCancellationNotification = async (booking) => {
  try {
    await transporter.sendMail({
      from: `BarberBook Studio <${BARBER_EMAIL}>`,
      to: BARBER_EMAIL,
      subject: `❌ Cancelación: ${booking.name} — ${booking.service} — ${booking.date}`,
      html: buildBarberCancellationHTML(booking),
    });
    console.log(`✅ Correo de cancelación enviado al barbero`);
  } catch (error) {
    console.error('❌ Error correo barbero (cancelación):', error.message);
  }
};

const sendClientBookingConfirmation = async (booking) => {
  if (!booking.email) return;
  try {
    await transporter.sendMail({
      from: `BarberBook Studio <${BARBER_EMAIL}>`,
      to: booking.email,
      subject: `✅ Reserva confirmada — ${booking.service} el ${booking.date}`,
      html: buildClientConfirmationHTML(booking),
    });
    console.log(`✅ Correo de confirmación enviado al cliente (${booking.email})`);
  } catch (error) {
    console.error('❌ Error correo cliente (confirmación):', error.message);
  }
};

const sendClientCancellationNotification = async (booking) => {
  if (!booking.email) return;
  try {
    await transporter.sendMail({
      from: `BarberBook Studio <${BARBER_EMAIL}>`,
      to: booking.email,
      subject: `❌ Reserva cancelada — ${booking.service} el ${booking.date}`,
      html: buildClientCancellationHTML(booking),
    });
    console.log(`✅ Correo de cancelación enviado al cliente (${booking.email})`);
  } catch (error) {
    console.error('❌ Error correo cliente (cancelación):', error.message);
  }
};

module.exports = {
  sendBookingNotification,
  sendCancellationNotification,
  sendClientBookingConfirmation,
  sendClientCancellationNotification,
};
