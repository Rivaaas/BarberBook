'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { SERVICES } from '@/data/services';
import { formatPrice } from '@/utils/formatters';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function Services() {
  const scrollToBooking = () => document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section id="services" className="py-20 bg-dark-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-gold text-sm font-semibold uppercase tracking-widest">Lo que ofrecemos</span>
          <h2 className="section-title mt-2">Nuestros <span className="text-gold">Servicios</span></h2>
          <p className="text-gray-400 mt-4 max-w-xl mx-auto">
            Cada servicio está diseñado para entregarte el mejor resultado. Precios en pesos chilenos.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6"
        >
          {SERVICES.map((service) => (
            <motion.div key={service.name} variants={item}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              className="card-dark rounded-xl overflow-hidden hover:border-gold/40 transition-colors duration-300 flex flex-col group"
            >
              <div className="relative h-48 overflow-hidden">
                <Image src={service.imageUrl} alt={service.name} fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute top-3 right-3 bg-dark/80 backdrop-blur-sm border border-dark-border rounded-full px-3 py-1">
                  <span className="text-gold text-xs font-medium">{service.duration} min</span>
                </div>
              </div>
              <div className="p-5 flex flex-col flex-1">
                <h3 className="text-white font-bold text-lg mb-2 group-hover:text-gold transition-colors">{service.name}</h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-4 flex-1">{service.description}</p>
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-gold font-black text-xl">{formatPrice(service.price)}</span>
                  <motion.button onClick={scrollToBooking}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn-gold text-xs px-4 py-2">
                    Agendar
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
