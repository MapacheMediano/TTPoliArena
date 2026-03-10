// src/components/tournaments/TournamentHeader.tsx
'use client';
import {
  Box,
  Typography,
  Chip,
  Button,
  Paper,
} from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import GroupsIcon from '@mui/icons-material/Groups';
import PlaceIcon from '@mui/icons-material/Place';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import LockIcon from '@mui/icons-material/Lock';

const statusColors: Record<string, { bg: string; text: string }> = {
  'Abierto': { bg: 'rgba(76, 175, 80, 0.15)', text: '#4CAF50' },
  'En curso': { bg: 'rgba(212, 168, 75, 0.15)', text: '#D4A84B' },
  'Finalizado': { bg: 'rgba(158, 158, 158, 0.15)', text: '#9E9E9E' },
  'Próximamente': { bg: 'rgba(33, 150, 243, 0.15)', text: '#2196F3' },
};

interface TournamentHeaderProps {
  tournament: {
    nombre: string;
    juego: string;
    formato: string;
    fechaInicio: string;
    fechaFin: string;
    estado: string;
    equiposInscritos: number;
    maxEquipos: number;
    modalidad: string;
    imagenUrl: string;
    organizador: string;
  };
  isInscribed: boolean;
  onInscribe: () => void;
}

export default function TournamentHeader({
  tournament,
  isInscribed,
  onInscribe,
}: TournamentHeaderProps) {
  const statusStyle = statusColors[tournament.estado] || statusColors['Próximamente'];
  const isFull = tournament.equiposInscritos >= tournament.maxEquipos;
  const canInscribe = tournament.estado === 'Abierto' && !isFull && !isInscribed;

  return (
    <Box>
      {/* Banner */}
      <Box
        sx={{
          position: 'relative',
          height: { xs: 200, md: 280 },
          borderRadius: 3,
          overflow: 'hidden',
          mb: 3,
        }}
      >
        <Box
          component="img"
          src={tournament.imagenUrl || 'https://picsum.photos/seed/tournament/1200/400'}
          alt={tournament.nombre}
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            filter: 'brightness(0.4)',
          }}
        />
        {/* Overlay con info */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            p: { xs: 2, md: 4 },
            background: 'linear-gradient(transparent, rgba(26, 10, 16, 0.95))',
          }}
        >
          <Chip
            label={tournament.estado}
            size="small"
            sx={{
              backgroundColor: statusStyle.bg,
              color: statusStyle.text,
              fontWeight: 600,
              mb: 1,
              border: `1px solid ${statusStyle.text}30`,
            }}
          />
          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
              color: '#F5F0F2',
              mb: 0.5,
              fontSize: { xs: '1.5rem', md: '2.125rem' },
            }}
          >
            {tournament.nombre}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <SportsEsportsIcon sx={{ fontSize: 18, color: '#D4A84B' }} />
            <Typography variant="body1" sx={{ color: '#D4A84B', fontWeight: 500 }}>
              {tournament.juego}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Info rápida + Botón de inscripción */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          backgroundColor: 'rgba(42, 21, 32, 0.8)',
          border: '1px solid rgba(123, 30, 59, 0.3)',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 2,
        }}
      >
        {/* Datos rápidos */}
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 3,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
            <CalendarTodayIcon sx={{ fontSize: 18, color: '#C4B0B8' }} />
            <Box>
              <Typography variant="caption" color="text.secondary">
                Fechas
              </Typography>
              <Typography variant="body2" sx={{ color: '#F5F0F2', fontWeight: 500 }}>
                {tournament.fechaInicio} — {tournament.fechaFin}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
            <GroupsIcon sx={{ fontSize: 18, color: '#C4B0B8' }} />
            <Box>
              <Typography variant="caption" color="text.secondary">
                Equipos
              </Typography>
              <Typography variant="body2" sx={{ color: '#F5F0F2', fontWeight: 500 }}>
                {tournament.equiposInscritos} / {tournament.maxEquipos}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
            <FormatListNumberedIcon sx={{ fontSize: 18, color: '#C4B0B8' }} />
            <Box>
              <Typography variant="caption" color="text.secondary">
                Formato
              </Typography>
              <Typography variant="body2" sx={{ color: '#F5F0F2', fontWeight: 500 }}>
                {tournament.formato}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
            <PlaceIcon sx={{ fontSize: 18, color: '#C4B0B8' }} />
            <Box>
              <Typography variant="caption" color="text.secondary">
                Modalidad
              </Typography>
              <Typography variant="body2" sx={{ color: '#F5F0F2', fontWeight: 500 }}>
                {tournament.modalidad}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Botón de inscripción */}
        <Box>
          {isInscribed ? (
            <Chip
              icon={<HowToRegIcon />}
              label="Ya estás inscrito"
              sx={{
                backgroundColor: 'rgba(76, 175, 80, 0.15)',
                color: '#4CAF50',
                fontWeight: 600,
                fontSize: '0.9rem',
                py: 2.5,
                px: 1,
                '& .MuiChip-icon': { color: '#4CAF50' },
              }}
            />
          ) : canInscribe ? (
            <Button
              variant="contained"
              size="large"
              onClick={onInscribe}
              sx={{
                px: 4,
                py: 1.5,
                fontWeight: 700,
                fontSize: '1rem',
              }}
            >
              Inscribirse al torneo
            </Button>
          ) : isFull ? (
            <Chip
              icon={<LockIcon />}
              label="Cupo lleno"
              sx={{
                backgroundColor: 'rgba(255, 107, 107, 0.15)',
                color: '#FF6B6B',
                fontWeight: 600,
                fontSize: '0.9rem',
                py: 2.5,
                px: 1,
                '& .MuiChip-icon': { color: '#FF6B6B' },
              }}
            />
          ) : (
            <Chip
              label={`Estado: ${tournament.estado}`}
              sx={{
                backgroundColor: statusStyle.bg,
                color: statusStyle.text,
                fontWeight: 600,
                py: 2.5,
                px: 1,
              }}
            />
          )}
        </Box>
      </Paper>
    </Box>
  );
}