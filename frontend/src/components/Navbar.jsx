'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  const links = [
    { label: 'Inicio', id: 'hero' },
    { label: 'Nosotros', id: 'info' },
    { label: 'Servicios', id: 'services' },
    { label: 'Galería', id: 'gallery' },
    { label: 'Reservas', id: 'booking' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-dark/95 backdrop-blur-md border-b border-dark-border shadow-xl' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <button onClick={() => scrollTo('hero')} className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-gold rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="text-dark font-black text-sm">BB</span>
            </div>
            <span className="font-bold text-lg text-white">
              Barber<span className="text-gold">Book</span>
            </span>
          </button>

          <div className="hidden md:flex items-center gap-8">
            {links.map((link) => (
              <button key={link.id} onClick={() => scrollTo(link.id)}
                className="text-gray-300 hover:text-gold text-sm font-medium transition-colors">
                {link.label}
              </button>
            ))}
            <button onClick={() => scrollTo('booking')} className="btn-gold text-sm px-5 py-2">
              Reservar Hora
            </button>
            {isAuthenticated ? (
              <Link href="/dashboard"
                className="text-gold border border-gold/30 hover:bg-gold/10 text-sm font-medium px-4 py-2 rounded-lg transition-all">
                Panel ✂️
              </Link>
            ) : (
              <Link href="/login"
                className="text-gray-400 hover:text-gold text-sm transition-colors">
                Acceso barbero
              </Link>
            )}
          </div>

          <button className="md:hidden text-white p-2" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-dark-card border-t border-dark-border px-4 py-4 space-y-1">
          {links.map((link) => (
            <button key={link.id} onClick={() => scrollTo(link.id)}
              className="block w-full text-left text-gray-300 hover:text-gold py-3 text-base font-medium border-b border-dark-border last:border-0 transition-colors">
              {link.label}
            </button>
          ))}
          <button onClick={() => { scrollTo('booking'); setMenuOpen(false); }}
            className="btn-gold w-full mt-3 text-center">
            Reservar Hora
          </button>
          {isAuthenticated ? (
            <Link href="/dashboard" onClick={() => setMenuOpen(false)}
              className="block text-center text-gold border border-gold/30 py-2.5 rounded-lg mt-2 text-sm font-medium">
              Panel del Barbero ✂️
            </Link>
          ) : (
            <Link href="/login" onClick={() => setMenuOpen(false)}
              className="block text-center text-gray-400 py-2.5 text-sm mt-2">
              Acceso barbero
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
