# BarberBook Studio — Sistema de Reservas Online

Plataforma web completa para gestión de reservas de una barbería. Permite a los clientes agendar horas online, y notifica al barbero por correo Gmail y Google Calendar automáticamente.

---

## Stack Tecnológico

| Capa | Tecnología |
|------|-----------|
| Frontend | Next.js 14 + JavaScript + Tailwind CSS |
| Backend | Node.js + Express.js |
| Base de datos | MongoDB Atlas (cloud, gratuito) |
| Notificaciones | Nodemailer + Gmail |
| Calendario | Google Calendar API + OAuth 2.0 |

---

## Qué hace actualmente la app

### ✅ Funcionando al 100%

- **Página web completa** con diseño premium oscuro/dorado, responsive para móvil y escritorio
- **Sección Hero** con imagen HD de barbería y botones de llamada a la acción
- **Información del negocio** — dirección, horarios, teléfono, correo
- **Catálogo de servicios** — 5 servicios con imagen, precio, duración y botón agendar
- **Galería de imágenes** con lightbox (clic para ampliar)
- **Formulario de reservas** con validación de todos los campos obligatorios
- **Panel de reservas** visible en la misma página mostrando estado de cada reserva
- **Cancelación de reservas** con cambio de estado en tiempo real
- **Guardado en MongoDB Atlas** — las reservas persisten en la nube
- **Notificación por Gmail** — el barbero recibe un correo HTML con los datos del cliente al crear una reserva
- **Correo de cancelación** — el barbero recibe correo cuando una reserva se cancela
- **Google Calendar** — las reservas se crean como eventos en el calendario del barbero con hora de inicio y término calculada automáticamente
- **Eliminación de eventos** — al cancelar una reserva, el evento se elimina del calendario

### ⚠️ Funciona con fallback

- Si el backend no está disponible, las reservas se guardan en **localStorage** del navegador (sin correo ni calendar)

---

## Estructura del Proyecto

```
BarberBook/
├── backend/                          # API REST — Node.js + Express
│   ├── server.js                     # Punto de entrada, configuración Express
│   ├── .env                          # Variables de entorno (credenciales)
│   ├── config/
│   │   └── database.js               # Conexión MongoDB Atlas
│   ├── models/
│   │   ├── Booking.js                # Schema reserva (Mongoose)
│   │   └── Service.js                # Schema servicio
│   ├── controllers/
│   │   ├── bookingController.js      # CRUD de reservas + notificaciones
│   │   └── serviceController.js      # Listado de servicios
│   ├── routes/
│   │   ├── bookingRoutes.js          # GET/POST/PUT/PATCH/DELETE /api/bookings
│   │   └── serviceRoutes.js          # GET /api/services
│   ├── middleware/
│   │   ├── errorHandler.js           # Manejo global de errores
│   │   └── validateBooking.js        # Validación de campos con express-validator
│   ├── services/
│   │   ├── emailService.js           # Nodemailer + Gmail (activo)
│   │   └── calendarService.js        # Google Calendar API (activo)
│   └── scripts/
│       └── getGoogleToken.js         # Script OAuth — obtener refresh_token
│
└── frontend/                         # Next.js 14 — App Router
    ├── src/
    │   ├── app/
    │   │   ├── layout.js             # Layout raíz + metadata SEO
    │   │   ├── page.js               # Página principal (importa todos los componentes)
    │   │   └── globals.css           # Estilos globales + clases Tailwind personalizadas
    │   ├── components/
    │   │   ├── Navbar.jsx            # Navegación fija con menú mobile
    │   │   ├── Hero.jsx              # Sección principal con imagen HD
    │   │   ├── BusinessInfo.jsx      # Info del negocio + características
    │   │   ├── Services.jsx          # Tarjetas de servicios con imagen y precio
    │   │   ├── Gallery.jsx           # Galería con lightbox
    │   │   ├── BookingForm.jsx       # Formulario de reservas con validación
    │   │   ├── BookingList.jsx       # Panel de reservas con cancelación
    │   │   └── Footer.jsx            # Pie de página
    │   ├── services/
    │   │   ├── apiService.js         # Fetch al backend REST
    │   │   ├── emailService.js       # Simulación frontend (el envío real es backend)
    │   │   └── calendarService.js    # Simulación frontend (el evento real es backend)
    │   ├── hooks/
    │   │   └── useBookings.js        # Estado de reservas + API + localStorage fallback
    │   ├── data/
    │   │   └── services.js           # Datos de los 5 servicios
    │   └── utils/
    │       └── formatters.js         # Formateo de precios, fechas y horas
    └── .env.local                    # URL del backend
```

---

## Variables de Entorno

### `backend/.env`

```env
PORT=5000
MONGODB_URI=mongodb+srv://usuario:password@cluster0.xxxxx.mongodb.net/barberbook

NODE_ENV=development

# Gmail — Nodemailer
GMAIL_USER=correo@gmail.com
GMAIL_APP_PASSWORD=xxxx xxxx xxxx xxxx   # App Password de Google

# Google Calendar — OAuth 2.0
GOOGLE_CLIENT_ID=xxxxxxxxxxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxxxxxxxxxxx
GOOGLE_REFRESH_TOKEN=1//04xxxxxxxxxxxx
GOOGLE_CALENDAR_ID=primary
```

### `frontend/.env.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

---

## Cómo Ejecutar

> Siempre inicia el **backend primero**, luego el frontend.

### Terminal 1 — Backend

```powershell
cd c:\APPS\BarberBook\backend
npm install
npm run dev
```

Salida esperada:
```
🔥 BarberBook API corriendo en http://localhost:5000
✅ Google Calendar configurado correctamente
✅ Servidor de correo listo — Gmail autenticado correctamente
✅ MongoDB conectado: ac-xxx.vm7yivo.mongodb.net
```

### Terminal 2 — Frontend

```powershell
cd c:\APPS\BarberBook\frontend
npm install
npm run dev
```

Abrir en el navegador: **http://localhost:3000**

---

## API Endpoints

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/bookings` | Listar todas las reservas |
| GET | `/api/bookings/:id` | Obtener una reserva por ID |
| POST | `/api/bookings` | Crear reserva + enviar correo + crear evento Calendar |
| PUT | `/api/bookings/:id` | Actualizar reserva |
| PATCH | `/api/bookings/cancel/:id` | Cancelar reserva + correo + eliminar evento Calendar |
| DELETE | `/api/bookings/:id` | Eliminar reserva permanentemente |
| GET | `/api/services` | Listar servicios |
| GET | `/api/health` | Health check del servidor |

---

## Campos de una Reserva

```json
{
  "name": "Juan Pérez",
  "phone": "+56 9 1234 5678",
  "email": "juan@ejemplo.com",
  "service": "Fade Premium",
  "barber": "Carlos Méndez",
  "date": "2026-07-15",
  "time": "10:30",
  "notes": "Quiero línea al 0",
  "status": "Pendiente",
  "googleCalendarEventId": "abc123xyz"
}
```

Estados posibles: `Pendiente` → `Confirmada` → `Cancelada`

---

## Servicios Disponibles

| Servicio | Precio | Duración |
|----------|--------|----------|
| Corte Clásico | $12.000 | 30 min |
| Fade Premium | $15.000 | 45 min |
| Barba | $8.000 | 25 min |
| Corte + Barba | $20.000 | 60 min |
| Perfilado de Cejas | $5.000 | 15 min |

---

## Flujo Completo de una Reserva

```
Cliente llena formulario en http://localhost:3000
        ↓
Frontend valida campos → POST /api/bookings
        ↓
Backend guarda en MongoDB Atlas
        ↓
├── Nodemailer envía correo HTML al Gmail del barbero
└── Google Calendar API crea evento con:
        • Título: ✂️ Fade Premium — Juan Pérez
        • Inicio: 2026-07-15 10:30
        • Término: 2026-07-15 11:15 (calculado por duración)
        • Descripción: datos completos del cliente
        • Recordatorio: 60 min antes por email + 30 min popup
        ↓
Frontend muestra mensaje de éxito
Panel de reservas se actualiza en tiempo real
```

---

## Problema Puerto 5000 Ocupado

El `package.json` ya incluye `predev` que libera el puerto automáticamente antes de cada inicio.
Si aún tienes problemas:

```powershell
npx kill-port 5000
npm run dev
```

---

## Configurar Google Calendar (si no está hecho)

1. Ir a [console.cloud.google.com](https://console.cloud.google.com)
2. Crear proyecto → Habilitar **Google Calendar API**
3. Crear credencial **OAuth 2.0 — Aplicación de escritorio**
4. Copiar `client_id` y `client_secret` al `.env`
5. Agregar tu correo como usuario de prueba en **"Público"**
6. Ejecutar: `node scripts/getGoogleToken.js`
7. Abrir la URL → autorizar → copiar `GOOGLE_REFRESH_TOKEN` al `.env`
8. Reiniciar backend

---

## Configurar Gmail (si no está hecho)

1. Activar **verificación en 2 pasos** en tu cuenta Google
2. Ir a [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
3. Generar contraseña de aplicación para "Correo"
4. Copiar al `.env` como `GMAIL_APP_PASSWORD`

---

*BarberBook Studio — Sistema de reservas online para barberías*
