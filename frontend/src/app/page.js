'use client';

import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import BusinessInfo from '@/components/BusinessInfo';
import Services from '@/components/Services';
import Gallery from '@/components/Gallery';
import BookingForm from '@/components/BookingForm';
import Footer from '@/components/Footer';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-dark">
      <Navbar />
      <Hero />
      <BusinessInfo />
      <Services />
      <Gallery />
      <BookingForm />
      <Footer />
    </main>
  );
}
