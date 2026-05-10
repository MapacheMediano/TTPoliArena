'use client';
import { Box, Typography, Button, Container, Chip } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

export default function HeroSection() {
  const router = useRouter();
  const [stats, setStats] = useState({ jugadores: 0, torneos: 0, equipos: 0, juegos: 8 });

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/public/stats');
        const data = await res.json();
        if (data.ok) setStats(data.stats);
      } catch (error) {
        console.error('Error cargando stats:', error);
      }
    }
    load();
  }, []);

  return (
    <Box sx={{
      position: 'relative',
      minHeight: { xs: 500, md: 600 },
      display: 'flex',
      alignItems: 'center',
      overflow: 'hidden',
      background: `
        radial-gradient(ellipse at 20% 50%, rgba(123, 30, 59, 0.3) 0%, transparent 50%),
        radial-gradient(ellipse at 80% 50%, rgba(212, 168, 75, 0.15) 0%, transparent 50%),
        linear-gradient(180deg, #1A0A10 0%, #2A1520 100%)
      `,
    }}>
      {/* Partículas decorativas */}
      <Box sx={{
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.15,
        backgroundImage: `
          radial-gradient(2px 2px at 20% 30%, #D4A84B, transparent),
          radial-gradient(2px 2px at 40% 70%, #D4A84B, transparent),
          radial-gradient(2px 2px at 60% 20%, #7B1E3B, transparent),
          radial-gradient(2px 2px at 80% 60%, #D4A84B, transparent),
          radial-gradient(1px 1px at 10% 80%, #D4A84B, transparent),
          radial-gradient(1px 1px at 70% 40%, #7B1E3B, transparent),
          radial-gradient(1px 1px at 90% 10%, #D4A84B, transparent),
          radial-gradient(1px 1px at 50% 90%, #7B1E3B, transparent)
        `,
      }} />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Box sx={{ maxWidth: 700, mx: { xs: 'auto', md: 0 }, textAlign: { xs: 'center', md: 'left' } }}>

          {/* Badge */}
          <Chip
            icon={<SportsEsportsIcon sx={{ fontSize: 16 }} />}
            label="Plataforma oficial de Esports del IPN"
            sx={{
              mb: 3,
              backgroundColor: 'rgba(212, 168, 75, 0.15)',
              color: '#D4A84B',
              fontWeight: 600,
              border: '1px solid rgba(212, 168, 75, 0.3)',
              '& .MuiChip-icon': { color: '#D4A84B' },
            }}
          />

          {/* Título */}
          <Typography variant="h2" sx={{
            fontWeight: 900, color: '#F5F0F2', mb: 2,
            fontSize: { xs: '2.2rem', sm: '2.8rem', md: '3.5rem' }, lineHeight: 1.1,
          }}>
            Compite, organiza y{' '}
            <Box component="span" sx={{
              background: 'linear-gradient(135deg, #D4A84B 0%, #E0C078 100%)',
              backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>
              domina la arena
            </Box>
          </Typography>

          {/* Descripción */}
          <Typography variant="h6" sx={{
            color: '#C4B0B8', mb: 4, fontWeight: 400, lineHeight: 1.6,
            fontSize: { xs: '1rem', md: '1.15rem' },
          }}>
            PoliArena es la plataforma de torneos de esports exclusiva para la
            comunidad del Instituto Politécnico Nacional. Inscríbete, forma tu
            equipo y demuestra tu talento.
          </Typography>

          {/* Stats */}
          <Box sx={{ display: 'flex', gap: 4, mb: 4, justifyContent: { xs: 'center', md: 'flex-start' }, flexWrap: 'wrap' }}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#D4A84B' }}>{stats.jugadores}+</Typography>
              <Typography variant="caption" color="text.secondary">Jugadores</Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#D4A84B' }}>{stats.torneos}</Typography>
              <Typography variant="caption" color="text.secondary">Torneos</Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#D4A84B' }}>{stats.equipos}</Typography>
              <Typography variant="caption" color="text.secondary">Equipos</Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#D4A84B' }}>{stats.juegos}</Typography>
              <Typography variant="caption" color="text.secondary">Juegos</Typography>
            </Box>
          </Box>

          {/* Botones CTA */}
          <Box sx={{ display: 'flex', gap: 2, justifyContent: { xs: 'center', md: 'flex-start' }, flexWrap: 'wrap' }}>
            <Button variant="contained" size="large" endIcon={<ArrowForwardIcon />}
              onClick={() => router.push('/register')}
              sx={{ px: 4, py: 1.5, fontSize: '1.05rem', fontWeight: 700 }}>
              Únete ahora
            </Button>
            <Button variant="outlined" size="large" startIcon={<EmojiEventsIcon />}
              onClick={() => router.push('/tournaments')}
              sx={{ px: 4, py: 1.5, fontSize: '1.05rem', borderColor: 'rgba(212, 168, 75, 0.5)', color: '#D4A84B', '&:hover': { borderColor: '#D4A84B', backgroundColor: 'rgba(212, 168, 75, 0.08)' } }}>
              Ver torneos
            </Button>
          </Box>

        </Box>
      </Container>
    </Box>
  );
}