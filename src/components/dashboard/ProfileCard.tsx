// src/components/dashboard/ProfileCard.tsx
'use client';
import {
  Paper,
  Box,
  Typography,
  Avatar,
  Chip,
  Button,
  LinearProgress,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SchoolIcon from '@mui/icons-material/School';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

interface ProfileCardProps {
  user: {
    nombre: string;
    nickname: string;
    correo: string;
    unidadAcademica: string;
    rol: string;
    torneosJugados: number;
    torneosGanados: number;
    equipo: string;
  };
  onEditProfile?: () => void;
}

export default function ProfileCard({ user, onEditProfile }: ProfileCardProps) {
  // Obtener iniciales para el avatar
  const iniciales = user.nombre
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        backgroundColor: 'rgba(42, 21, 32, 0.8)',
        border: '1px solid rgba(123, 30, 59, 0.3)',
        height: '100%',
      }}
    >
      {/* Encabezado del perfil */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <Avatar
          sx={{
            width: 72,
            height: 72,
            background: 'linear-gradient(135deg, #7B1E3B 0%, #D4A84B 100%)',
            fontSize: '1.5rem',
            fontWeight: 700,
          }}
        >
          {iniciales}
        </Avatar>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#F5F0F2' }}>
            {user.nombre}
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: '#D4A84B', fontWeight: 500 }}
          >
            @{user.nickname}
          </Typography>
          <Chip
            label={user.rol}
            size="small"
            sx={{
              mt: 0.5,
              backgroundColor: 'rgba(123, 30, 59, 0.3)',
              color: '#A23A5C',
              fontWeight: 600,
              fontSize: '0.7rem',
            }}
          />
        </Box>
      </Box>

      {/* Info académica */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
        <SchoolIcon sx={{ fontSize: 18, color: '#C4B0B8' }} />
        <Typography variant="body2" color="text.secondary">
          {user.unidadAcademica}
        </Typography>
      </Box>

      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ display: 'block', mb: 2 }}
      >
        {user.correo}
      </Typography>

      {/* Estadísticas rápidas */}
      <Box
        sx={{
          display: 'flex',
          gap: 2,
          mb: 2,
          p: 2,
          borderRadius: 2,
          backgroundColor: 'rgba(26, 10, 16, 0.5)',
        }}
      >
        <Box sx={{ textAlign: 'center', flex: 1 }}>
          <Typography
            variant="h5"
            sx={{ fontWeight: 800, color: '#D4A84B' }}
          >
            {user.torneosJugados}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Torneos
          </Typography>
        </Box>
        <Box sx={{ textAlign: 'center', flex: 1 }}>
          <EmojiEventsIcon sx={{ fontSize: 28, color: '#D4A84B' }} />
          <Typography variant="caption" color="text.secondary" display="block">
            {user.torneosGanados} ganados
          </Typography>
        </Box>
        <Box sx={{ textAlign: 'center', flex: 1 }}>
          <Typography
            variant="body2"
            sx={{ fontWeight: 700, color: '#F5F0F2' }}
          >
            {user.equipo}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Equipo
          </Typography>
        </Box>
      </Box>

      {/* Nivel / Progreso (decorativo) */}
      <Box sx={{ mb: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
          <Typography variant="caption" color="text.secondary">
            Nivel de experiencia
          </Typography>
          <Typography variant="caption" sx={{ color: '#D4A84B' }}>
            {user.torneosJugados * 120} XP
          </Typography>
        </Box>
        <LinearProgress
          variant="determinate"
          value={Math.min((user.torneosJugados / 10) * 100, 100)}
          sx={{
            height: 6,
            borderRadius: 3,
            backgroundColor: 'rgba(123, 30, 59, 0.2)',
            '& .MuiLinearProgress-bar': {
              borderRadius: 3,
              background: 'linear-gradient(90deg, #7B1E3B, #D4A84B)',
            },
          }}
        />
      </Box>

      {/* Botón editar */}
      <Button
        fullWidth
        variant="outlined"
        startIcon={<EditIcon />}
        onClick={onEditProfile}
        sx={{
          borderColor: 'rgba(123, 30, 59, 0.5)',
          color: '#F5F0F2',
          '&:hover': {
            borderColor: '#7B1E3B',
            backgroundColor: 'rgba(123, 30, 59, 0.1)',
          },
        }}
      >
        Editar perfil
      </Button>
    </Paper>
  );
}