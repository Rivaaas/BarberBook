'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

const GALLERY_IMAGES = [
  { src: 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=800&q=80', alt: 'Interior de BarberBook Studio', label: 'Nuestro Studio' },
  { src: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800&q=80', alt: 'Barbero trabajando', label: 'Maestros del Oficio' },
  { src: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=800&q=80', alt: 'Herramientas de barbería', label: 'Herramientas Premium' },
  { src: 'https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=800&q=80', alt: 'Corte Fade', label: 'Fade Perfecto' },
  { src: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=800&q=80', alt: 'Barbero en acción', label: 'Detalle y Precisión' },
  { src: 'https://images.unsplash.com/photo-1559599101-f09722fb4948?w=800&q=80', alt: 'Productos de barbería', label: 'Productos Premium' },
];

export default function Gallery() {
  const [activeImage, setActiveImage] = useState(null);

  return (
    <section id="gallery" className="py-20 bg-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-gold text-sm font-semibold uppercase tracking-widest">Nuestro trabajo</span>
          <h2 className="section-title mt-2">Galería <span className="text-gold">BarberBook</span></h2>
          <p className="text-gray-400 mt-4 max-w-xl mx-auto">
            Cada visita es una experiencia. Mira el ambiente y los resultados que logramos cada día.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
          className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4"
        >
          {GALLERY_IMAGES.map((img, index) => (
            <motion.div
              key={index}
              variants={{ hidden: { opacity: 0, scale: 0.95 }, show: { opacity: 1, scale: 1, transition: { duration: 0.4 } } }}
              whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
              className={`relative overflow-hidden rounded-xl cursor-pointer group ${index === 0 ? 'col-span-2 md:col-span-1' : ''}`}
              style={{ aspectRatio: index === 0 ? '1/1' : '4/3' }}
              onClick={() => setActiveImage(img)}
            >
              <Image src={img.src} alt={img.alt} fill
                className="object-cover group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-dark/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                <div>
                  <p className="text-gold text-xs font-semibold uppercase tracking-wide">BarberBook Studio</p>
                  <p className="text-white font-bold">{img.label}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {activeImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-dark/95 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setActiveImage(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 20 }}
              className="relative max-w-4xl w-full max-h-[90vh] rounded-xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative" style={{ aspectRatio: '16/10' }}>
                <Image src={activeImage.src} alt={activeImage.alt} fill className="object-cover" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-dark to-transparent">
                <p className="text-gold text-sm font-semibold uppercase tracking-wide">BarberBook Studio</p>
                <p className="text-white text-xl font-bold">{activeImage.label}</p>
              </div>
              <button onClick={() => setActiveImage(null)}
                className="absolute top-4 right-4 bg-dark/80 text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-gold hover:text-dark transition-colors">
                ✕
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
