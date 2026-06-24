'use client';

import { useState, useEffect, useCallback } from 'react';
import { getAllBookings, cancelBooking as cancelBookingAPI } from '@/services/apiService';

const STORAGE_KEY = 'barberbook_bookings';

/**
 * Hook para gestionar el estado de reservas.
 * Usa la API del backend si está disponible; localStorage como fallback.
 */
export const useBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);

  // Cargar reservas al montar (desde la API o localStorage)
  useEffect(() => {
    const loadBookings = async () => {
      setLoading(true);
      try {
        const res = await getAllBookings();
        if (res.data && res.data.length > 0) {
          setBookings(res.data);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(res.data));
        } else {
          // Sin datos en la API, cargar desde localStorage
          const stored = localStorage.getItem(STORAGE_KEY);
          if (stored) setBookings(JSON.parse(stored));
        }
      } catch {
        // API no disponible: usar localStorage
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          try {
            setBookings(JSON.parse(stored));
          } catch {
            setBookings([]);
          }
        }
      } finally {
        setLoading(false);
      }
    };

    loadBookings();
  }, []);

  // Guardar en localStorage cuando cambien las reservas
  const persistBookings = useCallback((updatedBookings) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedBookings));
    setBookings(updatedBookings);
  }, []);

  /**
   * Agrega una nueva reserva al estado y localStorage.
   */
  const addBooking = useCallback((booking) => {
    setBookings((prev) => {
      const updated = [booking, ...prev];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  /**
   * Cancela una reserva: llama a la API o actualiza estado local.
   */
  const cancelBooking = useCallback(async (id) => {
    try {
      await cancelBookingAPI(id);
      setBookings((prev) => {
        const updated = prev.map((b) =>
          (b._id === id || b.id === id) ? { ...b, status: 'Cancelada' } : b
        );
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        return updated;
      });
    } catch {
      // Si la API falla, cancelar localmente
      setBookings((prev) => {
        const updated = prev.map((b) =>
          (b._id === id || b.id === id) ? { ...b, status: 'Cancelada' } : b
        );
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        return updated;
      });
    }
  }, []);

  return { bookings, addBooking, cancelBooking, loading };
};
