// src/app/page.tsx
import Box from '@mui/material/Box';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/home/HeroSection';
import FeaturedTournaments from '@/components/home/FeaturedTournaments';
import Footer from '@/components/home/Footer';

export default function HomePage() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: '#1A0A10',
      }}
    >
      <Navbar />
      <HeroSection />
      <FeaturedTournaments />
      <Footer />
    </Box>
  );
}