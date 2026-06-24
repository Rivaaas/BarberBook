'use client';

import { useState } from 'react';
import { formatPrice } from '@/utils/formatters';

const STATUS_CONFIG = {
  Pendiente: {
    bg: 'bg-yellow-900/30',
    border: 'border-yellow-500/40',
    text: 'text-yellow-400',
    dot: 'bg-yellow-400',
  },
  Confirmada: {
    bg: 'bg-green-900/30',
    border: 'border-green-500/40',
    text: 'text-green-400',
    dot: 'bg-green-400',
  },
  Cancelada: {
    bg: 'bg-red-900/20',
    border: 'border-red-500/30',
    text: 'text-red-400',
    dot: 'bg-red-400',
  },
};

export default function BookingList({ bookings, onCancel, loading }) {
  const [cancelingId, setCancelingId] = useState(null);
  const [canceledMessage, setCanceledMessage] = useState(null);

  const handleCancel = async (booking) => {
    const id = booking._id || booking.id;
    const confirmed = window.confirm(
      `¿Cancelar la reserva de ${booking.name} para el ${booking.date} a las ${booking.time}?`
    );
    if (!confirmed) return;

    setCancelingId(id);
    try {
      await onCancel(id);
      setCanceledMessage(
        `Reserva de ${booking.name} cancelada. Se enviaría correo de cancelación al Gmail del barbero y el evento sería eliminado de Google Calendar.`
      );
      setTimeout(() => setCanceledMessage(null), 6000);
    } finally {
      setCancelingId(null);
    }
  };

  const activeBookings = bookings.filter((b) => b.status !== 'Cancelada');
  const canceledBookings = bookings.filter((b) => b.status === 'Cancelada');

  return (
    <section id="bookings-list" className="py-20 bg-dark">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Encabezado */}
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 bg-gold/10 border border-gold/30 rounded-full px-4 py-2 mb-4">
            <span className="text-gold text-xs font-semibold uppercase tracking-widest">Panel Demo</span>
          </span>
          <h2 className="section-title">
            Reservas <span className="text-gold">Registradas</span>
          </h2>
          <p className="text-gray-400 mt-4 max-w-xl mx-auto">
            Vista de administración para el barbero. Muestra todas las reservas en tiempo real.
          </p>
        </div>

        {/* Mensaje de cancelación */}
        {canceledMessage && (
          <div className="mb-8 p-5 bg-orange-900/30 border border-orange-500/40 rounded-xl animate-fade-in">
            <div className="flex items-start gap-3">
              <span className="text-xl">📧</span>
              <p className="text-orange-300 text-sm">{canceledMessage}</p>
            </div>
          </div>
        )}

        {/* Estado vacío */}
        {bookings.length === 0 && !loading && (
          <div className="text-center py-20 card-dark rounded-2xl">
            <div className="text-6xl mb-4">📅</div>
            <h3 className="text-white font-bold text-xl mb-2">Sin reservas aún</h3>
            <p className="text-gray-400">
              Las reservas creadas en el formulario aparecerán aquí.
            </p>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* Reservas activas */}
        {activeBookings.length > 0 && (
          <div className="space-y-4 mb-10">
            <h3 className="text-white font-semibold text-lg mb-4">
              Reservas Activas
              <span className="ml-2 bg-gold/20 text-gold text-sm px-2 py-0.5 rounded-full">
                {activeBookings.length}
              </span>
            </h3>
            {activeBookings.map((booking) => {
              const id = booking._id || booking.id;
              const statusCfg = STATUS_CONFIG[booking.status] || STATUS_CONFIG.Pendiente;

              return (
                <div
                  key={id}
                  className="card-dark rounded-xl p-5 hover:border-gold/30 transition-all duration-200"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    {/* Info principal */}
                    <div className="flex items-start gap-4">
                      {/* Avatar */}
                      <div className="w-11 h-11 bg-gold/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-gold font-bold text-lg">
                          {booking.name.charAt(0).toUpperCase()}
                        </span>
                      </div>

                      <div>
                        <div className="flex items-center gap-3 flex-wrap">
                          <h4 className="text-white font-bold">{booking.name}</h4>
                          {/* Badge de estado */}
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${statusCfg.bg} ${statusCfg.border} ${statusCfg.text}`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot}`} />
                            {booking.status}
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
                          <span className="text-gold text-sm font-semibold">{booking.service}</span>
                          <span className="text-gray-500 text-sm">con {booking.barber}</span>
                        </div>

                        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
                          <span className="text-gray-400 text-sm">📅 {booking.date}</span>
                          <span className="text-gray-400 text-sm">🕐 {booking.time} hrs</span>
                          {booking.phone && (
                            <span className="text-gray-400 text-sm">📞 {booking.phone}</span>
                          )}
                        </div>

                        {booking.notes && (
                          <p className="text-gray-500 text-xs mt-1 italic">"{booking.notes}"</p>
                        )}
                      </div>
                    </div>

                    {/* Botón cancelar */}
                    <button
                      onClick={() => handleCancel(booking)}
                      disabled={cancelingId === id}
                      className="flex-shrink-0 border border-red-500/40 text-red-400 hover:bg-red-900/30 hover:border-red-400 px-4 py-2 rounded-lg text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {cancelingId === id ? (
                        <span className="flex items-center gap-2">
                          <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                          Cancelando...
                        </span>
                      ) : (
                        'Cancelar'
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Reservas canceladas */}
        {canceledBookings.length > 0 && (
          <div>
            <h3 className="text-gray-500 font-semibold text-base mb-4">
              Canceladas
              <span className="ml-2 bg-red-900/20 text-red-400 text-sm px-2 py-0.5 rounded-full">
                {canceledBookings.length}
              </span>
            </h3>
            <div className="space-y-3">
              {canceledBookings.map((booking) => {
                const id = booking._id || booking.id;
                return (
                  <div key={id} className="card-dark rounded-xl p-4 opacity-50">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-red-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-red-400 font-bold">
                          {booking.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-400 font-medium text-sm">{booking.name}</span>
                          <span className="text-red-400 text-xs">— Cancelada</span>
                        </div>
                        <p className="text-gray-500 text-xs">
                          {booking.service} · {booking.date} · {booking.time} hrs
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
