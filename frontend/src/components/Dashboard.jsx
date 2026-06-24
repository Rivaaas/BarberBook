'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { getAllBookings, cancelBooking, reactivateBooking } from '@/services/apiService';
import toast from 'react-hot-toast';

const SERVICES = ['Corte Clásico', 'Fade Premium', 'Barba', 'Corte + Barba', 'Perfilado de Cejas'];
const BARBERS = ['Carlos Méndez', 'Diego Rojas', 'Sebastián Torres'];

const STATUS_STYLE = {
  Pendiente: { bg: 'bg-yellow-900/30', text: 'text-yellow-400', border: 'border-yellow-500/30', dot: 'bg-yellow-400' },
  Confirmada: { bg: 'bg-green-900/30', text: 'text-green-400', border: 'border-green-500/30', dot: 'bg-green-400' },
  Cancelada:  { bg: 'bg-red-900/20',   text: 'text-red-400',    border: 'border-red-500/20',   dot: 'bg-red-400'   },
};

function StatusBadge({ status }) {
  const s = STATUS_STYLE[status] || STATUS_STYLE.Pendiente;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${s.bg} ${s.border} ${s.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {status}
    </span>
  );
}

export default function Dashboard() {
  const { isAuthenticated, loading, logout, username } = useAuth();
  const router = useRouter();

  const [bookings, setBookings] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [actionId, setActionId] = useState(null);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterBarber, setFilterBarber] = useState('');
  const [filterService, setFilterService] = useState('');
  const [filterDate, setFilterDate] = useState('');

  useEffect(() => {
    if (!loading && !isAuthenticated) router.replace('/login');
  }, [isAuthenticated, loading, router]);

  const fetchBookings = useCallback(async () => {
    setFetching(true);
    try {
      const res = await getAllBookings();
      setBookings(res.data || []);
    } catch {
      toast.error('Error cargando reservas');
    } finally {
      setFetching(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) fetchBookings();
  }, [isAuthenticated, fetchBookings]);

  const handleCancel = async (booking) => {
    if (!window.confirm(`¿Cancelar la reserva de ${booking.name}?`)) return;
    setActionId(booking._id);
    try {
      await cancelBooking(booking._id);
      setBookings((prev) => prev.map((b) => b._id === booking._id ? { ...b, status: 'Cancelada' } : b));
      toast.success('Reserva cancelada. Se notificó al cliente y al barbero.');
    } catch (err) {
      toast.error(err.message || 'Error al cancelar');
    } finally {
      setActionId(null);
    }
  };

  const handleReactivate = async (booking) => {
    if (!window.confirm(`¿Reactivar la reserva de ${booking.name}?`)) return;
    setActionId(booking._id);
    try {
      await reactivateBooking(booking._id);
      setBookings((prev) => prev.map((b) => b._id === booking._id ? { ...b, status: 'Pendiente' } : b));
      toast.success('Reserva reactivada.');
    } catch (err) {
      toast.error(err.message || 'No se pudo reactivar. El horario puede estar ocupado.');
    } finally {
      setActionId(null);
    }
  };

  const clearFilters = () => {
    setSearch(''); setFilterStatus(''); setFilterBarber('');
    setFilterService(''); setFilterDate('');
  };
  const hasFilters = search || filterStatus || filterBarber || filterService || filterDate;

  if (loading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const today = new Date().toISOString().split('T')[0];
  const filtered = bookings.filter((b) => {
    const q = search.toLowerCase();
    return (
      (!search || b.name.toLowerCase().includes(q) || b.email.toLowerCase().includes(q) || b.phone?.includes(q)) &&
      (!filterStatus  || b.status  === filterStatus) &&
      (!filterBarber  || b.barber  === filterBarber) &&
      (!filterService || b.service === filterService) &&
      (!filterDate    || b.date    === filterDate)
    );
  });

  const stats = {
    total:      bookings.length,
    activas:    bookings.filter((b) => b.status !== 'Cancelada').length,
    canceladas: bookings.filter((b) => b.status === 'Cancelada').length,
    hoy:        bookings.filter((b) => b.date === today && b.status !== 'Cancelada').length,
  };

  return (
    <div className="min-h-screen bg-dark">

      {/* ── Header ── */}
      <header className="bg-dark-card border-b border-dark-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-14 md:h-16 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 md:w-8 md:h-8 bg-gold rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-dark font-black text-xs md:text-sm">BB</span>
            </div>
            <div className="min-w-0">
              <span className="font-bold text-white text-sm md:text-base">BarberBook</span>
              <span className="text-gold font-bold text-sm md:text-base"> Studio</span>
              <span className="text-gray-500 text-xs ml-1 hidden sm:inline">— Panel</span>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
            <span className="text-gray-400 text-xs hidden md:block">
              Hola, <span className="text-gold font-medium">{username}</span>
            </span>
            <button onClick={() => router.push('/')}
              className="text-gray-400 hover:text-white text-xs md:text-sm transition-colors hidden sm:block">
              Ver web
            </button>
            <button
              onClick={() => { logout(); router.replace('/login'); }}
              className="border border-dark-border text-gray-400 hover:text-red-400 hover:border-red-500/30 px-2 md:px-3 py-1 md:py-1.5 rounded-lg text-xs md:text-sm transition-all whitespace-nowrap"
            >
              Salir
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 md:py-8">

        {/* ── Stats ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4 mb-4 md:mb-8">
          {[
            { label: 'Total',    value: stats.total,      icon: '📋', color: 'text-white' },
            { label: 'Activas',  value: stats.activas,    icon: '✅', color: 'text-green-400' },
            { label: 'Canceladas', value: stats.canceladas, icon: '❌', color: 'text-red-400' },
            { label: 'Hoy',      value: stats.hoy,        icon: '📅', color: 'text-gold' },
          ].map((s) => (
            <div key={s.label} className="card-dark rounded-xl p-3 md:p-5">
              <div className="text-xl md:text-2xl mb-1 md:mb-2">{s.icon}</div>
              <div className={`text-2xl md:text-3xl font-black ${s.color}`}>{s.value}</div>
              <div className="text-gray-500 text-xs md:text-sm mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        {/* ── Buscador rápido + toggle filtros ── */}
        <div className="flex gap-2 mb-3">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">🔍</span>
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar cliente, correo o teléfono..."
              className="input-dark pl-8 w-full text-sm" />
          </div>
          <button onClick={() => setFiltersOpen(!filtersOpen)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border text-sm font-medium transition-all flex-shrink-0 ${
              hasFilters ? 'border-gold text-gold bg-gold/10' : 'border-dark-border text-gray-400 hover:border-gold/50'
            }`}>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
            </svg>
            <span className="hidden sm:inline">Filtros</span>
            {hasFilters && <span className="w-1.5 h-1.5 rounded-full bg-gold" />}
          </button>
          <button onClick={fetchBookings}
            className="p-2 border border-dark-border rounded-lg text-gray-400 hover:text-gold hover:border-gold/50 transition-all flex-shrink-0">
            <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>

        {/* ── Panel de filtros colapsable ── */}
        {filtersOpen && (
          <div className="card-dark rounded-xl p-3 md:p-4 mb-3 space-y-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
              <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="input-dark text-sm">
                <option value="">Todos los estados</option>
                <option>Pendiente</option><option>Confirmada</option><option>Cancelada</option>
              </select>
              <select value={filterBarber} onChange={(e) => setFilterBarber(e.target.value)} className="input-dark text-sm">
                <option value="">Todos los barberos</option>
                {BARBERS.map((b) => <option key={b}>{b}</option>)}
              </select>
              <select value={filterService} onChange={(e) => setFilterService(e.target.value)} className="input-dark text-sm">
                <option value="">Todos los servicios</option>
                {SERVICES.map((s) => <option key={s}>{s}</option>)}
              </select>
              <input type="date" value={filterDate} onChange={(e) => setFilterDate(e.target.value)} className="input-dark text-sm" />
            </div>
            {hasFilters && (
              <button onClick={clearFilters} className="text-gold text-xs hover:underline">
                Limpiar filtros
              </button>
            )}
          </div>
        )}

        {/* ── Contenido ── */}
        <div className="card-dark rounded-xl overflow-hidden">
          <div className="px-3 md:px-6 py-3 md:py-4 border-b border-dark-border">
            <h2 className="text-white font-bold text-sm md:text-base">
              Reservas
              <span className="ml-2 text-gray-500 font-normal text-xs md:text-sm">({filtered.length} resultados)</span>
            </h2>
          </div>

          {fetching ? (
            <div className="flex items-center justify-center py-16">
              <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 px-4">
              <div className="text-4xl mb-3">📭</div>
              <p className="text-gray-400 font-medium text-sm md:text-base">Sin reservas que mostrar</p>
              <p className="text-gray-600 text-xs md:text-sm mt-1">Ajusta los filtros o espera nuevas reservas</p>
            </div>
          ) : (
            <>
              {/* ── Vista mobile: tarjetas ── */}
              <div className="md:hidden divide-y divide-dark-border/50">
                {filtered.map((booking) => {
                  const isActing = actionId === booking._id;
                  return (
                    <div key={booking._id} className="p-4 space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="w-9 h-9 bg-gold/20 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-gold font-bold">{booking.name.charAt(0).toUpperCase()}</span>
                          </div>
                          <div className="min-w-0">
                            <p className="text-white font-semibold text-sm truncate">{booking.name}</p>
                            <p className="text-gray-500 text-xs truncate">{booking.email}</p>
                          </div>
                        </div>
                        <StatusBadge status={booking.status} />
                      </div>

                      <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                        <div><span className="text-gray-500">Servicio</span><p className="text-gold font-medium">{booking.service}</p></div>
                        <div><span className="text-gray-500">Barbero</span><p className="text-gray-300">{booking.barber}</p></div>
                        <div><span className="text-gray-500">Fecha</span><p className="text-gray-300">{booking.date}</p></div>
                        <div><span className="text-gray-500">Hora</span><p className="text-gray-300">{booking.time} hrs</p></div>
                        {booking.phone && (
                          <div><span className="text-gray-500">Teléfono</span>
                            <a href={`tel:${booking.phone}`} className="text-gray-300 underline">{booking.phone}</a>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2">
                        {booking.status !== 'Cancelada' ? (
                          <button onClick={() => handleCancel(booking)} disabled={isActing}
                            className="flex-1 text-xs border border-red-500/30 text-red-400 bg-red-900/10 active:bg-red-900/30 py-2.5 rounded-lg transition-all disabled:opacity-50 font-medium">
                            {isActing ? 'Cancelando...' : '✕ Cancelar'}
                          </button>
                        ) : (
                          <button onClick={() => handleReactivate(booking)} disabled={isActing}
                            className="flex-1 text-xs border border-green-500/30 text-green-400 bg-green-900/10 active:bg-green-900/30 py-2.5 rounded-lg transition-all disabled:opacity-50 font-medium">
                            {isActing ? 'Reactivando...' : '↩ Reactivar'}
                          </button>
                        )}
                        <a href={`mailto:${booking.email}`}
                          className="px-3 py-2.5 border border-dark-border text-gray-400 hover:text-gold rounded-lg transition-colors text-xs">
                          ✉️
                        </a>
                        {booking.phone && (
                          <a href={`tel:${booking.phone}`}
                            className="px-3 py-2.5 border border-dark-border text-gray-400 hover:text-gold rounded-lg transition-colors text-xs">
                            📞
                          </a>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* ── Vista desktop: tabla ── */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-dark-border">
                      {['Cliente', 'Servicio', 'Barbero', 'Fecha', 'Hora', 'Estado', 'Acciones'].map((h) => (
                        <th key={h} className="text-left px-4 py-3 text-gray-500 text-xs font-semibold uppercase tracking-wide whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((booking) => {
                      const s = STATUS_STYLE[booking.status] || STATUS_STYLE.Pendiente;
                      const isActing = actionId === booking._id;
                      return (
                        <tr key={booking._id} className="border-b border-dark-border/50 hover:bg-dark-muted/20 transition-colors">
                          <td className="px-4 py-3">
                            <div className="font-medium text-white text-sm">{booking.name}</div>
                            <div className="text-gray-500 text-xs">{booking.email}</div>
                            <div className="text-gray-600 text-xs">{booking.phone}</div>
                          </td>
                          <td className="px-4 py-3 text-gold text-sm font-medium whitespace-nowrap">{booking.service}</td>
                          <td className="px-4 py-3 text-gray-300 text-sm whitespace-nowrap">{booking.barber}</td>
                          <td className="px-4 py-3 text-gray-300 text-sm whitespace-nowrap">{booking.date}</td>
                          <td className="px-4 py-3 text-gray-300 text-sm whitespace-nowrap">{booking.time} hrs</td>
                          <td className="px-4 py-3"><StatusBadge status={booking.status} /></td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              {booking.status !== 'Cancelada' ? (
                                <button onClick={() => handleCancel(booking)} disabled={isActing}
                                  className="text-xs border border-red-500/30 text-red-400 hover:bg-red-900/20 px-3 py-1.5 rounded-lg transition-all disabled:opacity-50 whitespace-nowrap">
                                  {isActing ? '...' : 'Cancelar'}
                                </button>
                              ) : (
                                <button onClick={() => handleReactivate(booking)} disabled={isActing}
                                  className="text-xs border border-green-500/30 text-green-400 hover:bg-green-900/20 px-3 py-1.5 rounded-lg transition-all disabled:opacity-50 whitespace-nowrap">
                                  {isActing ? '...' : 'Reactivar'}
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
