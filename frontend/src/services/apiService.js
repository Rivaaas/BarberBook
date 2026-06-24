const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const getToken = () =>
  typeof window !== 'undefined' ? localStorage.getItem('barberbook_token') : null;

const fetchAPI = async (endpoint, options = {}) => {
  const token = getToken();
  const authHeader = token ? { Authorization: `Bearer ${token}` } : {};

  const response = await fetch(`${API_URL}${endpoint}`, {
    headers: { 'Content-Type': 'application/json', ...authHeader, ...options.headers },
    ...options,
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || `Error ${response.status}`);
  return data;
};

// ─── Auth ─────────────────────────────────────────────────────────────────────
export const loginAdmin = (credentials) =>
  fetchAPI('/auth/login', { method: 'POST', body: JSON.stringify(credentials) });

// ─── Bookings ─────────────────────────────────────────────────────────────────
export const getAllBookings = (params = '') => fetchAPI(`/bookings${params}`);
export const getBookingById = (id) => fetchAPI(`/bookings/${id}`);
export const createBooking = (data) => fetchAPI('/bookings', { method: 'POST', body: JSON.stringify(data) });
export const updateBooking = (id, data) => fetchAPI(`/bookings/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const cancelBooking = (id) => fetchAPI(`/bookings/cancel/${id}`, { method: 'PATCH' });
export const reactivateBooking = (id) => fetchAPI(`/bookings/reactivate/${id}`, { method: 'PATCH' });
export const deleteBooking = (id) => fetchAPI(`/bookings/${id}`, { method: 'DELETE' });
export const getAvailableSlots = (date, barber, service = '') =>
  fetchAPI(`/bookings/available-slots?date=${date}&barber=${encodeURIComponent(barber)}&service=${encodeURIComponent(service)}`);

// ─── Services ─────────────────────────────────────────────────────────────────
export const getServices = () => fetchAPI('/services');
