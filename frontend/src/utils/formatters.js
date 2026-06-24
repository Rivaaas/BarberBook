/**
 * Formatea un número como precio en pesos chilenos.
 * @param {number} price
 * @returns {string} "$12.000"
 */
export const formatPrice = (price) => {
  return `$${price.toLocaleString('es-CL')}`;
};

/**
 * Formatea una fecha ISO a formato legible en español.
 * @param {string} dateStr "2024-03-15"
 * @returns {string} "viernes, 15 de marzo de 2024"
 */
export const formatDate = (dateStr) => {
  const date = new Date(dateStr + 'T12:00:00');
  return date.toLocaleDateString('es-CL', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/**
 * Calcula la hora de término sumando minutos a una hora "HH:MM".
 * @param {string} time "10:30"
 * @param {number} minutes 45
 * @returns {string} "11:15"
 */
export const addMinutesToTime = (time, minutes) => {
  const [h, m] = time.split(':').map(Number);
  const total = h * 60 + m + minutes;
  const newH = Math.floor(total / 60) % 24;
  const newM = total % 60;
  return `${String(newH).padStart(2, '0')}:${String(newM).padStart(2, '0')}`;
};
