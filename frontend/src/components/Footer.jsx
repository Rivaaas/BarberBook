export default function Footer() {
  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <footer className="bg-dark-card border-t border-dark-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">

          {/* Logo y descripción */}
          <div>
            <div className="flex items-center gap-2 mb-3 md:mb-4">
              <div className="w-7 h-7 md:w-8 md:h-8 bg-gold rounded-lg flex items-center justify-center">
                <span className="text-dark font-black text-xs md:text-sm">BB</span>
              </div>
              <span className="font-bold text-base md:text-lg text-white">
                Barber<span className="text-gold">Book</span> Studio
              </span>
            </div>
            <p className="text-gray-400 text-xs md:text-sm leading-relaxed">
              La barbería premium de Santiago. Donde cada corte es una obra de arte.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-semibold text-sm md:text-base mb-3 md:mb-4">Navegación</h4>
            <ul className="space-y-1.5 md:space-y-2">
              {[
                { label: 'Inicio', id: 'hero' },
                { label: 'Nosotros', id: 'info' },
                { label: 'Servicios', id: 'services' },
                { label: 'Galería', id: 'gallery' },
                { label: 'Reservas', id: 'booking' },
              ].map((link) => (
                <li key={link.id}>
                  <button
                    onClick={() => scrollTo(link.id)}
                    className="text-gray-400 hover:text-gold text-xs md:text-sm transition-colors py-0.5"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h4 className="text-white font-semibold text-sm md:text-base mb-3 md:mb-4">Contacto</h4>
            <ul className="space-y-1.5 md:space-y-2 text-xs md:text-sm text-gray-400">
              <li className="flex items-start gap-1.5 md:gap-2">
                <span className="flex-shrink-0">📍</span>
                <span>Av. Providencia 1234, Santiago</span>
              </li>
              <li className="flex items-center gap-1.5 md:gap-2">
                <span>📞</span>
                <a href="tel:+56987654321" className="hover:text-gold transition-colors">+56 9 8765 4321</a>
              </li>
              <li className="flex items-center gap-1.5 md:gap-2">
                <span>✉️</span>
                <a href="mailto:contacto@barberbook.cl" className="hover:text-gold transition-colors">contacto@barberbook.cl</a>
              </li>
              <li className="flex items-center gap-1.5 md:gap-2">
                <span>🕐</span>
                <span>Lun–Sáb 9:00 – 20:00</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-dark-border mt-6 md:mt-10 pt-4 md:pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 md:gap-4">
          <p className="text-gray-500 text-xs text-center sm:text-left">
            © {new Date().getFullYear()} BarberBook Studio. Todos los derechos reservados.
          </p>
          <p className="text-gray-600 text-xs text-center sm:text-right">
            Powered by <span className="text-gold">BarberBook</span> — Sistema de reservas online
          </p>
        </div>
      </div>
    </footer>
  );
}
