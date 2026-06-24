'use client';

import { useState, useEffect, useRef } from 'react';
import { SERVICES } from '@/data/services';
import { createBooking, getAvailableSlots } from '@/services/apiService';
import toast from 'react-hot-toast';

const BARBERS = ['Carlos Méndez', 'Diego Rojas', 'Sebastián Torres'];

const INITIAL_FORM = {
  name: '', phone: '', email: '', service: '', barber: '', date: '', time: '', notes: '',
};

export default function BookingForm() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const submittingRef = useRef(false);

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    if (!form.date || !form.barber || !form.service) { setAvailableSlots([]); return; }

    const fetchSlots = async () => {
      setLoadingSlots(true);
      setForm((p) => ({ ...p, time: '' }));
      try {
        const res = await getAvailableSlots(form.date, form.barber, form.service);
        const now = new Date();
        const isToday = form.date === today;
        const slots = (res.data || []).filter((slot) => {
          if (!isToday) return true;
          const [h, m] = slot.split(':').map(Number);
          const d = new Date(); d.setHours(h, m, 0, 0);
          return d > now;
        });
        setAvailableSlots(slots);
      } catch {
        setAvailableSlots([]);
      } finally {
        setLoadingSlots(false);
      }
    };

    fetchSlots();
  }, [form.date, form.barber, form.service, today]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim() || form.name.trim().length < 2) e.name = 'Ingresa tu nombre completo';
    if (!form.phone.trim()) e.phone = 'El teléfono es obligatorio';
    if (!/^(\+?56\s?)?(\+?[0-9]{8,9})$/.test(form.phone.replace(/\s/g, ''))) e.phone = 'Teléfono inválido (ej: +56 9 1234 5678)';
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Correo inválido';
    if (!form.service) e.service = 'Selecciona un servicio';
    if (!form.barber) e.barber = 'Selecciona un barbero';
    if (!form.date) e.date = 'Selecciona una fecha';
    if (!form.time) e.time = 'Selecciona una hora disponible';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submittingRef.current) return;

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error('Por favor completa todos los campos correctamente');
      return;
    }

    submittingRef.current = true;
    setLoading(true);
    const toastId = toast.loading('Procesando tu reserva...');

    try {
      await createBooking(form);
      toast.success('¡Hora reservada! Revisa tu correo para la confirmación.', { id: toastId, duration: 6000 });
      setSuccess(true);
      setForm(INITIAL_FORM);
      setAvailableSlots([]);
      setTimeout(() => setSuccess(false), 8000);
    } catch (err) {
      const msg = err.message?.includes('ya se encuentra reservada')
        ? 'Esta hora ya fue reservada. Elige otro horario.'
        : (err.message || 'Error al crear la reserva.');
      toast.error(msg, { id: toastId });
      setErrors({ general: msg });
      if (form.date && form.barber && form.service) {
        const res = await getAvailableSlots(form.date, form.barber, form.service).catch(() => ({ data: [] }));
        setAvailableSlots(res.data || []);
      }
    } finally {
      setLoading(false);
      submittingRef.current = false;
    }
  };

  const FieldError = ({ name }) => errors[name]
    ? <p className="text-red-400 text-xs mt-1">{errors[name]}</p>
    : null;

  const slotsReady = form.date && form.barber && form.service;

  return (
    <section id="booking" className="py-12 md:py-20 bg-dark-card">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Encabezado */}
        <div className="text-center mb-8 md:mb-12">
          <span className="text-gold text-xs md:text-sm font-semibold uppercase tracking-widest">
            Agenda tu visita
          </span>
          <h2 className="section-title mt-2">
            Solicitar <span className="text-gold">Hora</span>
          </h2>
          <p className="text-gray-400 mt-3 md:mt-4 text-sm md:text-base max-w-xl mx-auto">
            Completa el formulario y recibirás confirmación por correo al instante.
          </p>
        </div>

        {/* Banner de éxito */}
        {success && (
          <div className="mb-6 p-4 md:p-6 bg-green-900/30 border border-green-500/40 rounded-xl">
            <div className="flex items-start gap-3">
              <span className="text-xl md:text-2xl">✅</span>
              <div>
                <p className="text-green-400 font-bold text-base md:text-lg">¡Hora reservada!</p>
                <p className="text-green-300/80 text-xs md:text-sm mt-1">
                  Revisa tu correo — te enviamos la confirmación con todos los detalles.
                </p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate
          className="card-dark rounded-2xl p-4 sm:p-6 md:p-8 space-y-4 md:space-y-6">

          {/* Nombre y Teléfono */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-1.5 md:mb-2">
                Nombre completo <span className="text-gold">*</span>
              </label>
              <input type="text" name="name" value={form.name} onChange={handleChange}
                placeholder="Ej: Juan Pérez"
                className={`input-dark ${errors.name ? 'border-red-500 focus:border-red-500' : ''}`} />
              <FieldError name="name" />
            </div>
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-1.5 md:mb-2">
                Teléfono <span className="text-gold">*</span>
              </label>
              <input type="tel" name="phone" value={form.phone} onChange={handleChange}
                placeholder="+56 9 1234 5678"
                className={`input-dark ${errors.phone ? 'border-red-500 focus:border-red-500' : ''}`} />
              <FieldError name="phone" />
            </div>
          </div>

          {/* Correo */}
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-1.5 md:mb-2">
              Correo electrónico <span className="text-gold">*</span>
              <span className="text-gray-500 text-xs ml-1">(recibirás confirmación aquí)</span>
            </label>
            <input type="email" name="email" value={form.email} onChange={handleChange}
              placeholder="juan@ejemplo.com"
              className={`input-dark ${errors.email ? 'border-red-500 focus:border-red-500' : ''}`} />
            <FieldError name="email" />
          </div>

          {/* Servicio y Barbero */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-1.5 md:mb-2">
                Servicio <span className="text-gold">*</span>
              </label>
              <select name="service" value={form.service} onChange={handleChange}
                className={`input-dark ${errors.service ? 'border-red-500' : ''}`}>
                <option value="">Seleccionar servicio</option>
                {SERVICES.map((s) => (
                  <option key={s.name} value={s.name}>
                    {s.name} — ${s.price.toLocaleString('es-CL')} ({s.duration} min)
                  </option>
                ))}
              </select>
              <FieldError name="service" />
            </div>
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-1.5 md:mb-2">
                Barbero <span className="text-gold">*</span>
              </label>
              <select name="barber" value={form.barber} onChange={handleChange}
                className={`input-dark ${errors.barber ? 'border-red-500' : ''}`}>
                <option value="">Seleccionar barbero</option>
                {BARBERS.map((b) => <option key={b} value={b}>{b}</option>)}
              </select>
              <FieldError name="barber" />
            </div>
          </div>

          {/* Fecha y Hora */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-1.5 md:mb-2">
                Fecha <span className="text-gold">*</span>
              </label>
              <input type="date" name="date" value={form.date} min={today} onChange={handleChange}
                className={`input-dark ${errors.date ? 'border-red-500' : ''}`} />
              <FieldError name="date" />
            </div>
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-1.5 md:mb-2">
                Hora disponible <span className="text-gold">*</span>
              </label>

              {!slotsReady ? (
                <div className="input-dark text-gray-600 text-sm cursor-not-allowed select-none">
                  Selecciona servicio, barbero y fecha
                </div>
              ) : loadingSlots ? (
                <div className="input-dark flex items-center gap-2 text-gray-500 text-sm">
                  <svg className="w-4 h-4 animate-spin flex-shrink-0" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Cargando horarios...
                </div>
              ) : availableSlots.length === 0 ? (
                <div className="input-dark text-red-400 text-sm">
                  Sin horarios disponibles para esta fecha
                </div>
              ) : (
                <select name="time" value={form.time} onChange={handleChange}
                  className={`input-dark ${errors.time ? 'border-red-500' : ''}`}>
                  <option value="">Seleccionar hora</option>
                  {availableSlots.map((t) => <option key={t} value={t}>{t} hrs</option>)}
                </select>
              )}
              <FieldError name="time" />
            </div>
          </div>

          {/* Comentario */}
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-1.5 md:mb-2">
              Comentario
              <span className="text-gray-500 text-xs ml-1">(opcional)</span>
            </label>
            <textarea name="notes" value={form.notes} onChange={handleChange}
              rows={3}
              placeholder="Ej: Quiero un fade con línea al 0 a los lados..."
              className="input-dark resize-none min-h-[80px]" />
          </div>

          {/* Error general */}
          {errors.general && (
            <div className="p-3 md:p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
              <p className="text-red-400 text-sm">{errors.general}</p>
            </div>
          )}

          {/* Botón */}
          <button type="submit" disabled={loading || submittingRef.current}
            className="btn-gold w-full py-3.5 md:py-4 text-sm md:text-base font-bold flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed">
            {loading ? (
              <>
                <svg className="w-4 h-4 md:w-5 md:h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Procesando reserva...
              </>
            ) : '✂️ Solicitar Hora'}
          </button>

          <p className="text-gray-500 text-xs text-center leading-relaxed">
            Al reservar aceptas que la hora puede cancelarse con al menos 2 horas de anticipación.
          </p>
        </form>
      </div>
    </section>
  );
}
