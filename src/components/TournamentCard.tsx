// src/components/TournamentCard.tsx
'use client';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
} from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import GroupsIcon from '@mui/icons-material/Groups';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';

// Imágenes placeholder por juego (usando picsum.photos para tener variedad)
const gameImages: Record<string, string> = {
  'Valorant': '/games/valorant.jpeg',
  'League of Legends': '/games/LeagueOfLegends.jpg',
  'Rocket League': '/games/RocketLeague.jpg',
  'Overwatch': '/games/Overwatch.jpg',
  'Fortnite': '/games/Fortnite.jpg',
  'Super Smash Bros': '/games/Smash.jpg',
  'Clash Royale': '/games/ClashRoyale.jpg',
  'Marvel Rivals': '/games/MarvelRivals.jpg',
};

// Colores del chip según estado
const statusColors: Record<string, { bg: string; text: string }> = {
  'Abierto': { bg: 'rgba(76, 175, 80, 0.15)', text: '#4CAF50' },
  'En curso': { bg: 'rgba(212, 168, 75, 0.15)', text: '#D4A84B' },
  'Finalizado': { bg: 'rgba(158, 158, 158, 0.15)', text: '#9E9E9E' },
  'Próximamente': { bg: 'rgba(33, 150, 243, 0.15)', text: '#2196F3' },
};

export interface TournamentData {
  id: number;
  nombre: string;
  juego: string;
  formato: string;
  fechaInicio: string;
  estado: string;
  equiposInscritos: number;
  maxEquipos: number;
  modalidad: string;
}

interface TournamentCardProps {
  tournament: TournamentData;
  onClick?: () => void;
}

export default function TournamentCard({ tournament, onClick }: TournamentCardProps) {
  const imageUrl = gameImages[tournament.juego] || 'https://picsum.photos/seed/default/400/200';
  const statusStyle = statusColors[tournament.estado] || statusColors['Próximamente'];

  return (
    <Card
      onClick={onClick}
      sx={{
        backgroundColor: 'rgba(42, 21, 32, 0.6)',
        border: '1px solid rgba(123, 30, 59, 0.2)',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.3s ease',
        '&:hover': onClick
          ? {
              transform: 'translateY(-4px)',
              border: '1px solid rgba(123, 30, 59, 0.5)',
              boxShadow: '0 8px 32px rgba(123, 30, 59, 0.2)',
            }
          : {},
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Imagen del torneo */}
      <CardMedia
        component="img"
        height="140"
        image={imageUrl}
        alt={tournament.nombre}
        sx={{
          objectFit: 'cover',
          filter: 'brightness(0.7)',
        }}
      />

      {/* Chip de estado sobre la imagen */}
      <Chip
        label={tournament.estado}
        size="small"
        sx={{
          position: 'absolute',
          top: 12,
          right: 12,
          backgroundColor: statusStyle.bg,
          color: statusStyle.text,
          fontWeight: 600,
          fontSize: '0.75rem',
          border: `1px solid ${statusStyle.text}30`,
        }}
      />

      <CardContent sx={{ flexGrow: 1, p: 2 }}>
        {/* Nombre del torneo */}
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 700,
            color: '#F5F0F2',
            mb: 0.5,
            lineHeight: 1.3,
          }}
        >
          {tournament.nombre}
        </Typography>

        {/* Juego */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
          <SportsEsportsIcon sx={{ fontSize: 16, color: '#D4A84B' }} />
          <Typography variant="body2" sx={{ color: '#D4A84B', fontWeight: 500 }}>
            {tournament.juego}
          </Typography>
        </Box>

        {/* Fecha */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
          <CalendarTodayIcon sx={{ fontSize: 14, color: '#C4B0B8' }} />
          <Typography variant="caption" color="text.secondary">
            {tournament.fechaInicio}
          </Typography>
        </Box>

        {/* Equipos y modalidad */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
          <GroupsIcon sx={{ fontSize: 14, color: '#C4B0B8' }} />
          <Typography variant="caption" color="text.secondary">
            {tournament.equiposInscritos}/{tournament.maxEquipos} equipos • {tournament.modalidad}
          </Typography>
        </Box>

        {/* Formato */}
        <Chip
          label={tournament.formato}
          size="small"
          variant="outlined"
          sx={{
            fontSize: '0.7rem',
            height: 22,
            borderColor: 'rgba(123, 30, 59, 0.4)',
            color: '#C4B0B8',
          }}
        />
      </CardContent>
    </Card>
  );
}