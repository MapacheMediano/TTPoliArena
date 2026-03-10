// src/components/teams/TeamCard.tsx
'use client';
import {
  Paper,
  Box,
  Typography,
  Avatar,
  AvatarGroup,
  Chip,
  Button,
} from '@mui/material';
import GroupsIcon from '@mui/icons-material/Groups';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import StarIcon from '@mui/icons-material/Star';
import SettingsIcon from '@mui/icons-material/Settings';

export interface TeamMember {
  id: number;
  nombre: string;
  nickname: string;
  rol: 'Capitán' | 'Miembro';
  correo: string;
}

export interface TeamData {
  id: number;
  nombre: string;
  tag: string;
  juego: string;
  miembros: TeamMember[];
  torneosActivos: number;
  torneosGanados: number;
  fechaCreacion: string;
}

interface TeamCardProps {
  team: TeamData;
  onClick?: () => void;
}

export default function TeamCard({ team, onClick }: TeamCardProps) {
  const capitan = team.miembros.find((m) => m.rol === 'Capitán');

  return (
    <Paper
      elevation={0}
      onClick={onClick}
      sx={{
        p: 3,
        backgroundColor: 'rgba(42, 21, 32, 0.8)',
        border: '1px solid rgba(123, 30, 59, 0.3)',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.3s ease',
        '&:hover': onClick
          ? {
              transform: 'translateY(-4px)',
              border: '1px solid rgba(212, 168, 75, 0.4)',
              boxShadow: '0 8px 32px rgba(123, 30, 59, 0.2)',
            }
          : {},
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header: Tag + Nombre */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
        <Avatar
          sx={{
            width: 56,
            height: 56,
            fontWeight: 800,
            fontSize: '1.1rem',
            background: 'linear-gradient(135deg, #D4A84B 0%, #E0C078 100%)',
            color: '#1A0A10',
          }}
        >
          {team.tag}
        </Avatar>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#F5F0F2', lineHeight: 1.2 }}>
            {team.nombre}
          </Typography>
          <Box component="span" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.25 }}>
            <SportsEsportsIcon sx={{ fontSize: 14, color: '#D4A84B' }} />
            <Typography component="span" variant="caption" sx={{ color: '#D4A84B' }}>
              {team.juego}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Capitán */}
      {capitan && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            mb: 2,
          }}
        >
          <StarIcon sx={{ fontSize: 14, color: '#D4A84B' }} />
          <Typography variant="caption" color="text.secondary">
            Capitán: <span style={{ color: '#F5F0F2', fontWeight: 500 }}>@{capitan.nickname}</span>
          </Typography>
        </Box>
      )}

      {/* Miembros avatars */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <AvatarGroup
          max={5}
          sx={{
            '& .MuiAvatar-root': {
              width: 28,
              height: 28,
              fontSize: '0.7rem',
              backgroundColor: 'rgba(123, 30, 59, 0.5)',
              border: '2px solid #2A1520',
            },
          }}
        >
          {team.miembros.map((m) => (
            <Avatar key={m.id}>{m.nombre[0]}</Avatar>
          ))}
        </AvatarGroup>
        <Typography variant="caption" color="text.secondary">
          {team.miembros.length} integrantes
        </Typography>
      </Box>

      {/* Stats */}
      <Box
        sx={{
          display: 'flex',
          gap: 2,
          p: 1.5,
          borderRadius: 1.5,
          backgroundColor: 'rgba(26, 10, 16, 0.5)',
          mt: 'auto',
        }}
      >
        <Box sx={{ textAlign: 'center', flex: 1 }}>
          <Typography variant="body1" sx={{ fontWeight: 700, color: '#D4A84B' }}>
            {team.torneosActivos}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Activos
          </Typography>
        </Box>
        <Box sx={{ textAlign: 'center', flex: 1 }}>
          <Typography variant="body1" sx={{ fontWeight: 700, color: '#4CAF50' }}>
            {team.torneosGanados}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Ganados
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
}