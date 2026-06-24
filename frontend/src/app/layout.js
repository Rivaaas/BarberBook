import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { Toaster } from 'react-hot-toast';

export const metadata = {
  title: 'BarberBook Studio — Reserva tu corte online',
  description: 'Agenda tu hora en BarberBook Studio. Barbería premium en Santiago de Chile.',
  keywords: 'barbería, reservas online, corte de pelo, Santiago, Chile, fade, barba',
  openGraph: {
    title: 'BarberBook Studio',
    description: 'Reserva tu corte en minutos. Barbería premium en Santiago.',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" className="scroll-smooth">
      <body className="bg-dark text-white antialiased">
        <AuthProvider>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#1A1A1A',
                color: '#fff',
                border: '1px solid #2A2A2A',
                borderRadius: '10px',
                fontSize: '14px',
              },
              success: { iconTheme: { primary: '#D4AF37', secondary: '#0F0F0F' } },
              error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
