// src/components/home/FeaturedTournaments.tsx
'use client';
import {
  Box,
  Container,
  Typography,
  Button,
  IconButton,
} from '@mui/material';
import { useRef } from 'react';
import { useRouter } from 'next/navigation';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import TournamentCard, { TournamentData } from '@/components/TournamentCard';

// ============================================
// DATOS SIMULADOS
// ============================================

const featuredTournaments: TournamentData[] = [
  {
    id: 1,
    nombre: 'Interpolitécnicos 2025 - League of Legends',
    juego: 'League of Legends',
    formato: 'Eliminación doble',
    fechaInicio: '18/11/2025',
    estado: 'En curso',
    equiposInscritos: 16,
    maxEquipos: 16,
    modalidad: 'Online / Final Presencial',
  },
  {
    id: 2,
    nombre: 'Interpolitécnicos 2025 - Rocket League',
    juego: 'Rocket League',
    formato: 'Eliminación simple',
    fechaInicio: '18/11/2025',
    estado: 'En curso',
    equiposInscritos: 12,
    maxEquipos: 12,
    modalidad: 'Online / Final Presencial',
  },
  {
    id: 3,
    nombre: 'Interpolitécnicos 2025 - Valorant',
    juego: 'Valorant',
    formato: 'Eliminación simple',
    fechaInicio: '18/11/2025',
    estado: 'En curso',
    equiposInscritos: 16,
    maxEquipos: 16,
    modalidad: 'Online / Final Presencial',
  },
  {
    id: 4,
    nombre: 'Interpolitécnicos 2025 - Super Smash Bros',
    juego: 'Super Smash Bros',
    formato: 'Eliminación doble',
    fechaInicio: '18/11/2025',
    estado: 'En curso',
    equiposInscritos: 24,
    maxEquipos: 32,
    modalidad: 'Presencial',
  },
  {
    id: 5,
    nombre: 'Interpolitécnicos 2025 - Fortnite',
    juego: 'Fortnite',
    formato: 'Eliminación simple',
    fechaInicio: '18/11/2025',
    estado: 'En curso',
    equiposInscritos: 20,
    maxEquipos: 32,
    modalidad: 'Online / Final Presencial',
  },
];

const availableTournaments: TournamentData[] = [
  {
    id: 6,
    nombre: 'Copa ESCOM - League of Legends',
    juego: 'League of Legends',
    formato: 'Eliminación doble',
    fechaInicio: '25/11/2025',
    estado: 'Abierto',
    equiposInscritos: 8,
    maxEquipos: 16,
    modalidad: 'Online',
  },
  {
    id: 7,
    nombre: 'Torneo Relámpago - Rocket League',
    juego: 'Rocket League',
    formato: 'Round Robin',
    fechaInicio: '01/12/2025',
    estado: 'Abierto',
    equiposInscritos: 3,
    maxEquipos: 8,
    modalidad: 'Online',
  },
  {
    id: 8,
    nombre: 'Torneo UPIICSA - Clash Royale',
    juego: 'Clash Royale',
    formato: 'Round Robin',
    fechaInicio: '05/12/2025',
    estado: 'Abierto',
    equiposInscritos: 10,
    maxEquipos: 16,
    modalidad: 'Online',
  },
  {
    id: 9,
    nombre: 'Copa IPN - Fortnite',
    juego: 'Fortnite',
    formato: 'Eliminación simple',
    fechaInicio: '10/12/2025',
    estado: 'Próximamente',
    equiposInscritos: 0,
    maxEquipos: 32,
    modalidad: 'Online',
  },
  {
    id: 10,
    nombre: 'Copa Marvel Rivals - ESIME',
    juego: 'Marvel Rivals',
    formato: 'Eliminación simple',
    fechaInicio: '15/12/2025',
    estado: 'Próximamente',
    equiposInscritos: 0,
    maxEquipos: 16,
    modalidad: 'Online / Final Presencial',
  },
  {
    id: 11,
    nombre: 'Liga Politécnica Valorant S2',
    juego: 'Valorant',
    formato: 'Round Robin',
    fechaInicio: '20/12/2025',
    estado: 'Abierto',
    equiposInscritos: 5,
    maxEquipos: 10,
    modalidad: 'Online',
  },
];

// ============================================

interface ScrollableSectionProps {
  title: string;
  tournaments: TournamentData[];
  onViewAll?: () => void;
}

function ScrollableSection({ title, tournaments, onViewAll }: ScrollableSectionProps) {
  const router = useRouter();
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const amount = 320;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -amount : amount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <Box sx={{ mb: 5 }}>
      {/* Header de sección */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2,
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            color: '#F5F0F2',
            position: 'relative',
            '&::after': {
              content: '""',
              position: 'absolute',
              bottom: -4,
              left: 0,
              width: 50,
              height: 3,
              borderRadius: 2,
              background: 'linear-gradient(90deg, #D4A84B, transparent)',
            },
          }}
        >
          {title}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton
            onClick={() => scroll('left')}
            sx={{
              color: '#C4B0B8',
              border: '1px solid rgba(123, 30, 59, 0.3)',
              width: 36,
              height: 36,
              '&:hover': {
                borderColor: '#D4A84B',
                color: '#D4A84B',
              },
            }}
          >
            <ArrowBackIosIcon sx={{ fontSize: 14, ml: 0.5 }} />
          </IconButton>
          <IconButton
            onClick={() => scroll('right')}
            sx={{
              color: '#C4B0B8',
              border: '1px solid rgba(123, 30, 59, 0.3)',
              width: 36,
              height: 36,
              '&:hover': {
                borderColor: '#D4A84B',
                color: '#D4A84B',
              },
            }}
          >
            <ArrowForwardIosIcon sx={{ fontSize: 14 }} />
          </IconButton>
          {onViewAll && (
            <Button
              size="small"
              endIcon={<ArrowForwardIcon />}
              onClick={onViewAll}
              sx={{ color: '#D4A84B', ml: 1 }}
            >
              Ver todos
            </Button>
          )}
        </Box>
      </Box>

      {/* Scroll horizontal de tarjetas */}
      <Box
        ref={scrollRef}
        sx={{
          display: 'flex',
          gap: 2,
          overflowX: 'auto',
          pb: 1,
          scrollSnapType: 'x mandatory',
          '&::-webkit-scrollbar': {
            height: 6,
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: 'rgba(26, 10, 16, 0.5)',
            borderRadius: 3,
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(123, 30, 59, 0.4)',
            borderRadius: 3,
            '&:hover': {
              backgroundColor: 'rgba(123, 30, 59, 0.6)',
            },
          },
        }}
      >
        {tournaments.map((tournament) => (
          <Box
            key={tournament.id}
            sx={{
              minWidth: 280,
              maxWidth: 280,
              scrollSnapAlign: 'start',
            }}
          >
            <TournamentCard
              tournament={tournament}
              onClick={() => router.push(`/tournaments/${tournament.id}`)}
            />
          </Box>
        ))}
      </Box>
    </Box>
  );
}

export default function FeaturedTournaments() {
  const router = useRouter();

  return (
    <Box
      sx={{
        py: 6,
        background: 'linear-gradient(180deg, #2A1520 0%, #1A0A10 100%)',
      }}
    >
      <Container maxWidth="lg">
        <ScrollableSection
          title="Eventos destacados"
          tournaments={featuredTournaments}
        />

        <ScrollableSection
          title="Eventos disponibles"
          tournaments={availableTournaments}
          onViewAll={() => router.push('/tournaments')}
        />
      </Container>
    </Box>
  );
}