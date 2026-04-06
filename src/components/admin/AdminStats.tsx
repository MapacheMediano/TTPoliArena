// src/components/admin/AdminStats.tsx
'use client';
import { Box, Paper, Typography } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import GroupsIcon from '@mui/icons-material/Groups';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import PendingActionsIcon from '@mui/icons-material/PendingActions';

interface AdminStatsProps {
  stats: {
    totalUsuarios: number;
    totalTorneos: number;
    torneosActivos: number;
    totalEquipos: number;
    staffCount: number;
    resultadosPendientes: number;
  };
}

export default function AdminStats({ stats }: AdminStatsProps) {
  const items = [
    { label: 'Usuarios', value: stats.totalUsuarios, icon: <PeopleIcon />, color: '#2196F3' },
    { label: 'Torneos', value: stats.totalTorneos, icon: <EmojiEventsIcon />, color: '#D4A84B' },
    { label: 'Activos', value: stats.torneosActivos, icon: <SportsEsportsIcon />, color: '#4CAF50' },
    { label: 'Equipos', value: stats.totalEquipos, icon: <GroupsIcon />, color: '#A23A5C' },
    { label: 'Staff', value: stats.staffCount, icon: <AdminPanelSettingsIcon />, color: '#E0C078' },
    { label: 'Por validar', value: stats.resultadosPendientes, icon: <PendingActionsIcon />, color: '#FF6B6B' },
  ];

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: 'repeat(2, 1fr)',
          sm: 'repeat(3, 1fr)',
          md: 'repeat(6, 1fr)',
        },
        gap: 2,
      }}
    >
      {items.map((item, index) => (
        <Paper
          key={index}
          elevation={0}
          sx={{
            p: 2,
            textAlign: 'center',
            backgroundColor: 'rgba(42, 21, 32, 0.8)',
            border: '1px solid rgba(123, 30, 59, 0.3)',
            transition: 'all 0.2s',
            '&:hover': {
              border: `1px solid ${item.color}40`,
              transform: 'translateY(-2px)',
            },
          }}
        >
          <Box
            sx={{
              display: 'inline-flex',
              p: 1,
              borderRadius: 2,
              backgroundColor: `${item.color}15`,
              color: item.color,
              mb: 0.5,
            }}
          >
            {item.icon}
          </Box>
          <Typography variant="h5" sx={{ fontWeight: 800, color: item.color }}>
            {item.value}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {item.label}
          </Typography>
        </Paper>
      ))}
    </Box>
  );
}