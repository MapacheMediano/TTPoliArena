// src/components/profile/ProfileView.tsx
'use client';
import {
  Paper,
  Box,
  Typography,
  Avatar,
  Chip,
  Button,
  Divider,
  LinearProgress,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SchoolIcon from '@mui/icons-material/School';
import EmailIcon from '@mui/icons-material/Email';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import GroupsIcon from '@mui/icons-material/Groups';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import StarIcon from '@mui/icons-material/Star';

export interface UserProfile {
  nombre: string;
  nickname: string;
  correo: string;
  unidadAcademica: string;
  rol: string;
  equipo: string;
  equipoTag: string;
  juegosFavoritos: string[];
  torneosJugados: number;
  torneosGanados: number;
  partidasJugadas: number;
  victorias: number;
  fechaRegistro: string;
}

interface ProfileViewProps {
  user: UserProfile;
  onEdit: () => void;
}

export default function ProfileView({ user, onEdit }: ProfileViewProps) {
  const iniciales = user.nombre
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const winRate = user.partidasJugadas > 0
    ? Math.round((user.victorias / user.partidasJugadas) * 100)
    : 0;

  const InfoRow = ({
    icon,
    label,
    value,
  }: {
    icon: React.ReactNode;
    label: string;
    value: string | React.ReactNode;
  }) => (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: 1.5 }}>
      <Box sx={{ color: '#C4B0B8', display: 'flex' }}>{icon}</Box>
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="caption" color="text.secondary">
          {label}
        </Typography>
        <Typography variant="body2" sx={{ color: '#F5F0F2', fontWeight: 500 }}>
          {value}
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Paper
      elevation={0}
      sx={{
        backgroundColor: 'rgba(42, 21, 32, 0.8)',
        border: '1px solid rgba(123, 30, 59, 0.3)',
        overflow: 'hidden',
      }}
    >
      {/* Banner superior */}
      <Box
        sx={{
          height: 120,
          background: 'linear-gradient(135deg, #7B1E3B 0%, #D4A84B 100%)',
          position: 'relative',
        }}
      />

      {/* Avatar y nombre */}
      <Box sx={{ px: 3, pb: 3 }}>
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 2,
            alignItems: 'flex-end',
            mt: -5,
            mb: 2,
          }}
        >
          <Avatar
            sx={{
              width: 96,
              height: 96,
              fontSize: '2rem',
              fontWeight: 700,
              background: 'linear-gradient(135deg, #5A0F28 0%, #7B1E3B 100%)',
              border: '4px solid #2A1520',
            }}
          >
            {iniciales}
          </Avatar>
          <Box sx={{ flexGrow: 1, mb: 0.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
              <Typography variant="h5" sx={{ fontWeight: 800, color: '#F5F0F2' }}>
                {user.nombre}
              </Typography>
              <Chip
                label={user.rol}
                size="small"
                sx={{
                  backgroundColor: 'rgba(123, 30, 59, 0.3)',
                  color: '#A23A5C',
                  fontWeight: 600,
                  fontSize: '0.7rem',
                }}
              />
            </Box>
            <Typography variant="body1" sx={{ color: '#D4A84B', fontWeight: 500 }}>
              @{user.nickname}
            </Typography>
          </Box>
          <Button
            variant="outlined"
            startIcon={<EditIcon />}
            onClick={onEdit}
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
        </Box>

        {/* Estadísticas destacadas */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 2,
            mb: 3,
            p: 2,
            borderRadius: 2,
            backgroundColor: 'rgba(26, 10, 16, 0.5)',
          }}
        >
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#D4A84B' }}>
              {user.torneosJugados}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Torneos
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#4CAF50' }}>
              {user.torneosGanados}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Ganados
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#F5F0F2' }}>
              {user.partidasJugadas}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Partidas
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#2196F3' }}>
              {winRate}%
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Win Rate
            </Typography>
          </Box>
        </Box>

        {/* Barra de experiencia */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
            <Typography variant="body2" sx={{ color: '#F5F0F2', fontWeight: 500 }}>
              Nivel {Math.floor(user.torneosJugados / 3) + 1}
            </Typography>
            <Typography variant="caption" sx={{ color: '#D4A84B' }}>
              {user.torneosJugados * 120} / {(Math.floor(user.torneosJugados / 3) + 1) * 500} XP
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={Math.min(((user.torneosJugados * 120) % 500) / 5, 100)}
            sx={{
              height: 8,
              borderRadius: 4,
              backgroundColor: 'rgba(123, 30, 59, 0.2)',
              '& .MuiLinearProgress-bar': {
                borderRadius: 4,
                background: 'linear-gradient(90deg, #7B1E3B, #D4A84B)',
              },
            }}
          />
        </Box>

        <Divider sx={{ borderColor: 'rgba(123, 30, 59, 0.2)', mb: 2 }} />

        {/* Información personal */}
        <Typography variant="subtitle2" sx={{ color: '#D4A84B', fontWeight: 600, mb: 1 }}>
          Información personal
        </Typography>

        <InfoRow
          icon={<EmailIcon sx={{ fontSize: 18 }} />}
          label="Correo institucional"
          value={user.correo}
        />
        <InfoRow
          icon={<SchoolIcon sx={{ fontSize: 18 }} />}
          label="Unidad académica"
          value={user.unidadAcademica}
        />
        <InfoRow
          icon={<GroupsIcon sx={{ fontSize: 18 }} />}
          label="Equipo"
          value={
            user.equipo ? `[${user.equipoTag}] ${user.equipo}` : 'Sin equipo'
          }
        />
        <InfoRow
          icon={<CalendarTodayIcon sx={{ fontSize: 18 }} />}
          label="Miembro desde"
          value={user.fechaRegistro}
        />

        <Divider sx={{ borderColor: 'rgba(123, 30, 59, 0.2)', my: 2 }} />

        {/* Juegos favoritos */}
        <Typography variant="subtitle2" sx={{ color: '#D4A84B', fontWeight: 600, mb: 1.5 }}>
          Juegos favoritos
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {user.juegosFavoritos.map((juego) => (
            <Chip
              key={juego}
              icon={<SportsEsportsIcon sx={{ fontSize: 16 }} />}
              label={juego}
              size="small"
              sx={{
                backgroundColor: 'rgba(42, 21, 32, 0.8)',
                color: '#F5F0F2',
                border: '1px solid rgba(123, 30, 59, 0.3)',
                '& .MuiChip-icon': { color: '#D4A84B' },
              }}
            />
          ))}
        </Box>
      </Box>
    </Paper>
  );
}