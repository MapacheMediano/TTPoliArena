// src/components/dashboard/QuickStats.tsx
'use client';
import { Paper, Typography, Box } from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import GroupsIcon from '@mui/icons-material/Groups';

interface QuickStatsProps {
  stats: {
    torneosActivos: number;
    partidasJugadas: number;
    victorias: number;
    racha: number;
  };
}

export default function QuickStats({ stats }: QuickStatsProps) {
  const statItems = [
    {
      label: 'Torneos activos',
      value: stats.torneosActivos,
      icon: <EmojiEventsIcon />,
      color: '#D4A84B',
    },
    {
      label: 'Partidas jugadas',
      value: stats.partidasJugadas,
      icon: <SportsEsportsIcon />,
      color: '#A23A5C',
    },
    {
      label: 'Victorias',
      value: stats.victorias,
      icon: <TrendingUpIcon />,
      color: '#4CAF50',
    },
    {
      label: 'Mejor racha',
      value: `${stats.racha}W`,
      icon: <GroupsIcon />,
      color: '#2196F3',
    },
  ];

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: 'repeat(2, 1fr)',
          md: 'repeat(4, 1fr)',
        },
        gap: 2,
      }}
    >
      {statItems.map((stat, index) => (
        <Paper
          key={index}
          elevation={0}
          sx={{
            p: 2.5,
            textAlign: 'center',
            backgroundColor: 'rgba(42, 21, 32, 0.8)',
            border: '1px solid rgba(123, 30, 59, 0.3)',
            transition: 'all 0.3s ease',
            '&:hover': {
              border: `1px solid ${stat.color}40`,
              transform: 'translateY(-2px)',
            },
          }}
        >
          <Box
            sx={{
              display: 'inline-flex',
              p: 1,
              borderRadius: 2,
              backgroundColor: `${stat.color}15`,
              color: stat.color,
              mb: 1,
            }}
          >
            {stat.icon}
          </Box>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
              color: stat.color,
              lineHeight: 1.2,
            }}
          >
            {stat.value}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {stat.label}
          </Typography>
        </Paper>
      ))}
    </Box>
  );
}