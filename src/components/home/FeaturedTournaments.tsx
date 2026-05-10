'use client';
import {
  Box, Container, Typography, Button, IconButton, CircularProgress,
} from '@mui/material';
import { useRef, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import TournamentCard, { TournamentData } from '@/components/TournamentCard';

const statusMap: Record<string, string> = {
  OPEN: 'Abierto',
  IN_PROGRESS: 'En curso',
  FINISHED: 'Finalizado',
};

const formatoMap: Record<string, string> = {
  eliminacion_simple: 'Eliminación simple',
  eliminacion_doble: 'Eliminación doble',
  round_robin: 'Round Robin',
};

export default function FeaturedTournaments() {
  const router = useRouter();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [tournaments, setTournaments] = useState<TournamentData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/public/tournaments');
        const data = await res.json();
        if (data.ok && data.tournaments) {
          setTournaments(data.tournaments.map((t: any) => ({
            id: t.id,
            nombre: t.title,
            juego: t.game,
            formato: formatoMap[t.format] ?? t.format,
            fechaInicio: new Date(t.startDate).toLocaleDateString('es-MX'),
            estado: statusMap[t.status] ?? t.status,
            equiposInscritos: t._count.registrations,
            maxEquipos: t.maxPlayers,
            modalidad: 'Online',
          })));
        }
      } catch (error) {
        console.error('Error cargando torneos:', error);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const scroll = (dir: 'left' | 'right') => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir === 'left' ? -300 : 300, behavior: 'smooth' });
    }
  };

  return (
    <Box sx={{ py: 8, background: 'linear-gradient(180deg, #1A0A10 0%, #2A1520 100%)' }}>
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#F5F0F2', mb: 0.5 }}>
              Eventos destacados
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Torneos activos y próximos disponibles
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton onClick={() => scroll('left')} sx={{ color: '#C4B0B8', border: '1px solid rgba(123, 30, 59, 0.3)', '&:hover': { borderColor: '#D4A84B', color: '#D4A84B' } }}>
              <ArrowBackIosIcon sx={{ fontSize: 16 }} />
            </IconButton>
            <IconButton onClick={() => scroll('right')} sx={{ color: '#C4B0B8', border: '1px solid rgba(123, 30, 59, 0.3)', '&:hover': { borderColor: '#D4A84B', color: '#D4A84B' } }}>
              <ArrowForwardIosIcon sx={{ fontSize: 16 }} />
            </IconButton>
            <Button endIcon={<ArrowForwardIcon />} onClick={() => router.push('/tournaments')}
              sx={{ color: '#D4A84B', '&:hover': { backgroundColor: 'rgba(212, 168, 75, 0.1)' } }}>
              Ver todos
            </Button>
          </Box>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <CircularProgress sx={{ color: '#D4A84B' }} />
          </Box>
        ) : tournaments.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 6 }}>
            <Typography variant="body1" color="text.secondary">
              No hay torneos activos por el momento
            </Typography>
          </Box>
        ) : (
          <Box
            ref={scrollRef}
            sx={{
              display: 'flex',
              gap: 2,
              overflowX: 'auto',
              pb: 2,
              scrollbarWidth: 'none',
              '&::-webkit-scrollbar': { display: 'none' },
            }}
          >
            {tournaments.map((t) => (
              <Box key={t.id} sx={{ minWidth: 280, maxWidth: 300, flexShrink: 0 }}>
                <TournamentCard
                  tournament={t}
                  onClick={() => router.push('/tournaments/' + t.id)}
                />
              </Box>
            ))}
          </Box>
        )}
      </Container>
    </Box>
  );
}