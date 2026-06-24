/**
 * SCRIPT DE AUTORIZACIÓN GOOGLE CALENDAR — Ejecutar solo UNA vez
 *
 * REQUISITO PREVIO:
 *   En Google Cloud Console → Credenciales → tu cliente OAuth →
 *   agregar URI de redireccionamiento: http://localhost:4000
 *
 * CÓMO EJECUTAR:
 *   cd c:\APPS\BarberBook\backend
 *   node scripts/getGoogleToken.js
 *
 * El script abrirá una URL. Ábrela en el navegador, autoriza con la
 * cuenta Google del barbero y el refresh_token aparecerá automáticamente.
 */

require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const { google } = require('googleapis');
const http = require('http');
const url = require('url');

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = 'http://localhost:4000';
const PORT = 4000;

if (!CLIENT_ID || CLIENT_ID === 'tu_client_id_aqui') {
  console.error('\n❌ GOOGLE_CLIENT_ID no configurado en .env\n');
  process.exit(1);
}
if (!CLIENT_SECRET || CLIENT_SECRET === 'tu_client_secret_aqui') {
  console.error('\n❌ GOOGLE_CLIENT_SECRET no configurado en .env\n');
  process.exit(1);
}

const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

const authUrl = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: ['https://www.googleapis.com/auth/calendar'],
  prompt: 'consent',
});

console.log('\n══════════════════════════════════════════════════════════════');
console.log('📅  AUTORIZACIÓN GOOGLE CALENDAR — BarberBook Studio');
console.log('══════════════════════════════════════════════════════════════\n');
console.log('Abre esta URL en tu navegador e inicia sesión con la cuenta');
console.log('Google del barbero:\n');
console.log(authUrl);
console.log('\nEsperando autorización en http://localhost:' + PORT + ' ...\n');

// Servidor temporal que captura el código de autorización automáticamente
const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);

  if (parsedUrl.pathname !== '/') {
    res.end('');
    return;
  }

  const code = parsedUrl.query.code;
  const error = parsedUrl.query.error;

  if (error) {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(`<h2>❌ Error: ${error}</h2><p>Cierra esta ventana y vuelve a intentarlo.</p>`);
    server.close();
    console.error('\n❌ El usuario rechazó la autorización:', error, '\n');
    return;
  }

  if (!code) {
    res.end('Sin código');
    return;
  }

  try {
    const { tokens } = await oauth2Client.getToken(code);

    // Respuesta HTML en el navegador
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(`
      <html>
        <body style="font-family: sans-serif; background: #0F0F0F; color: #fff; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0;">
          <div style="text-align: center; padding: 40px; background: #1A1A1A; border-radius: 12px; border: 1px solid #D4AF37;">
            <h1 style="color: #D4AF37;">✅ ¡Autorización exitosa!</h1>
            <p>El refresh_token fue generado correctamente.</p>
            <p style="color: #aaa;">Revisa la consola del terminal para copiarlo.</p>
            <p style="color: #666; font-size: 14px;">Puedes cerrar esta ventana.</p>
          </div>
        </body>
      </html>
    `);

    // Imprimir en consola
    console.log('══════════════════════════════════════════════════════════════');
    console.log('✅  AUTORIZACIÓN EXITOSA — Copia este token en tu .env:');
    console.log('══════════════════════════════════════════════════════════════\n');
    console.log('GOOGLE_REFRESH_TOKEN=' + tokens.refresh_token);
    console.log('\n══════════════════════════════════════════════════════════════');
    console.log('Luego reinicia el backend: npm run dev');
    console.log('══════════════════════════════════════════════════════════════\n');

  } catch (err) {
    res.writeHead(500, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(`<h2>❌ Error: ${err.message}</h2>`);
    console.error('\n❌ Error obteniendo el token:', err.message, '\n');
  } finally {
    server.close();
  }
});

server.listen(PORT, () => {
  console.log('Servidor de autorización activo en http://localhost:' + PORT);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\n❌ Puerto ${PORT} en uso. Cierra lo que use ese puerto e intenta de nuevo.\n`);
  } else {
    console.error('\n❌ Error del servidor:', err.message, '\n');
  }
  process.exit(1);
});
