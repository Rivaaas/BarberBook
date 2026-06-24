const INFO_ITEMS = [
  {
    icon: '📍',
    title: 'Dirección',
    lines: ['Av. Providencia 1234, Local 5', 'Providencia, Santiago, Chile'],
  },
  {
    icon: '🕐',
    title: 'Horario de Atención',
    lines: ['Lunes – Viernes: 9:00 – 20:00', 'Sábado: 9:00 – 18:00', 'Domingo: Cerrado'],
  },
  {
    icon: '📞',
    title: 'Teléfono',
    lines: ['+56 9 8765 4321', '+56 9 8765 4322 (WhatsApp)'],
  },
  {
    icon: '✉️',
    title: 'Correo',
    lines: ['contacto@barberbook.cl', 'reservas@barberbook.cl'],
  },
];

const FEATURES = [
  {
    icon: '✂️',
    title: 'Técnica Premium',
    desc: 'Barberos certificados con más de 5 años de experiencia en cortes clásicos y modernos.',
  },
  {
    icon: '📅',
    title: 'Reserva Online 24/7',
    desc: 'Agenda desde tu celular en cualquier momento. Confirmación instantánea y recordatorios automáticos.',
  },
  {
    icon: '💎',
    title: 'Productos de Calidad',
    desc: 'Utilizamos productos premium de las mejores marcas internacionales de cuidado masculino.',
  },
];

export default function BusinessInfo() {
  return (
    <section id="info" className="py-12 md:py-20 bg-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Encabezado */}
        <div className="text-center mb-10 md:mb-16">
          <span className="text-gold text-xs md:text-sm font-semibold uppercase tracking-widest">
            Quiénes somos
          </span>
          <h2 className="section-title mt-2">
            BarberBook <span className="text-gold">Studio</span>
          </h2>
          <p className="text-gray-400 mt-3 md:mt-4 max-w-2xl mx-auto text-sm md:text-lg leading-relaxed">
            Somos una barbería premium ubicada en el corazón de Providencia. Combinamos
            técnicas clásicas con estilo moderno para entregarte el mejor corte de tu vida.
          </p>
        </div>

        {/* Grid de información */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-8 md:mb-16">
          {INFO_ITEMS.map((item) => (
            <div
              key={item.title}
              className="card-dark p-4 md:p-6 hover:border-gold/40 transition-all duration-300 group"
            >
              <div className="text-2xl md:text-3xl mb-3 md:mb-4">{item.icon}</div>
              <h3 className="text-white font-semibold text-sm md:text-base mb-2 md:mb-3 group-hover:text-gold transition-colors">
                {item.title}
              </h3>
              {item.lines.map((line, i) => (
                <p key={i} className="text-gray-400 text-xs md:text-sm leading-relaxed">
                  {line}
                </p>
              ))}
            </div>
          ))}
        </div>

        {/* Características */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-8">
          {FEATURES.map((feat) => (
            <div
              key={feat.title}
              className="flex gap-3 md:gap-4 p-4 md:p-6 card-dark rounded-xl hover:border-gold/30 transition-all duration-300"
            >
              <div className="text-xl md:text-2xl flex-shrink-0">{feat.icon}</div>
              <div>
                <h3 className="text-white font-semibold text-sm md:text-base mb-1 md:mb-2">{feat.title}</h3>
                <p className="text-gray-400 text-xs md:text-sm leading-relaxed">{feat.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
