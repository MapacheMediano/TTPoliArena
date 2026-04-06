// src/components/rankings/RankingTable.tsx
'use client';
import {
  Paper,
  Box,
  Typography,
  Avatar,
  Chip,
} from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import RemoveIcon from '@mui/icons-material/Remove';

export interface RankingEntry {
  posicion: number;
  equipo: string;
  tag: string;
  juego: string;
  victorias: number;
  derrotas: number;
  puntos: number;
  racha: string;
  cambio: 'up' | 'down' | 'same';
}

interface RankingTableProps {
  rankings: RankingEntry[];
  title: string;
}

const positionStyle = (pos: number) => {
  if (pos === 1) return { bg: 'rgba(255, 215, 0, 0.15)', text: '#FFD700', border: '#FFD700' };
  if (pos === 2) return { bg: 'rgba(192, 192, 192, 0.15)', text: '#C0C0C0', border: '#C0C0C0' };
  if (pos === 3) return { bg: 'rgba(205, 127, 50, 0.15)', text: '#CD7F32', border: '#CD7F32' };
  return { bg: 'rgba(123, 30, 59, 0.1)', text: '#C4B0B8', border: 'transparent' };
};

export default function RankingTable({ rankings, title }: RankingTableProps) {
  return (
    <Paper
      elevation={0}
      sx={{
        backgroundColor: 'rgba(42, 21, 32, 0.8)',
        border: '1px solid rgba(123, 30, 59, 0.3)',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 2.5,
          borderBottom: '1px solid rgba(123, 30, 59, 0.2)',
          display: 'flex',
          alignItems: 'center',
          gap: 1,
        }}
      >
        <EmojiEventsIcon sx={{ color: '#D4A84B' }} />
        <Typography variant="h6" sx={{ fontWeight: 700, color: '#F5F0F2' }}>
          {title}
        </Typography>
      </Box>

      {/* Column headers */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          px: 2.5,
          py: 1,
          backgroundColor: 'rgba(26, 10, 16, 0.5)',
          borderBottom: '1px solid rgba(123, 30, 59, 0.15)',
          gap: 2,
        }}
      >
        <Typography variant="caption" color="text.secondary" sx={{ width: 36, textAlign: 'center' }}>
          #
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ flex: 1 }}>
          Equipo
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ width: 70, textAlign: 'center', display: { xs: 'none', sm: 'block' } }}>
          Juego
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ width: 40, textAlign: 'center' }}>
          V
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ width: 40, textAlign: 'center' }}>
          D
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ width: 50, textAlign: 'center' }}>
          Pts
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ width: 55, textAlign: 'center', display: { xs: 'none', md: 'block' } }}>
          Racha
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ width: 30, textAlign: 'center' }}>
        </Typography>
      </Box>

      {/* Rows */}
      {rankings.map((entry) => {
        const posStyle = positionStyle(entry.posicion);
        const winRate = entry.victorias + entry.derrotas > 0
          ? Math.round((entry.victorias / (entry.victorias + entry.derrotas)) * 100)
          : 0;

        return (
          <Box
            key={entry.posicion}
            sx={{
              display: 'flex',
              alignItems: 'center',
              px: 2.5,
              py: 1.5,
              gap: 2,
              borderBottom: '1px solid rgba(123, 30, 59, 0.08)',
              transition: 'background-color 0.2s',
              '&:hover': {
                backgroundColor: 'rgba(26, 10, 16, 0.5)',
              },
            }}
          >
            {/* Posición */}
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: posStyle.bg,
                border: entry.posicion <= 3 ? `2px solid ${posStyle.border}` : 'none',
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 800,
                  color: posStyle.text,
                  fontSize: entry.posicion <= 3 ? '0.9rem' : '0.8rem',
                }}
              >
                {entry.posicion}
              </Typography>
            </Box>

            {/* Equipo */}
            <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', gap: 1.5, overflow: 'hidden' }}>
              <Avatar
                sx={{
                  width: 36,
                  height: 36,
                  fontWeight: 800,
                  fontSize: '0.75rem',
                  background: entry.posicion <= 3
                    ? `linear-gradient(135deg, ${posStyle.border} 0%, ${posStyle.text} 100%)`
                    : 'linear-gradient(135deg, #7B1E3B 0%, #A23A5C 100%)',
                  color: entry.posicion <= 3 ? '#1A0A10' : '#F5F0F2',
                }}
              >
                {entry.tag}
              </Avatar>
              <Box sx={{ overflow: 'hidden' }}>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 600,
                    color: '#F5F0F2',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {entry.equipo}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {winRate}% WR
                </Typography>
              </Box>
            </Box>

            {/* Juego */}
            <Box sx={{ width: 70, textAlign: 'center', display: { xs: 'none', sm: 'block' } }}>
              <Chip
                label={entry.juego}
                size="small"
                sx={{
                  fontSize: '0.6rem',
                  height: 20,
                  backgroundColor: 'rgba(212, 168, 75, 0.1)',
                  color: '#D4A84B',
                }}
              />
            </Box>

            {/* V */}
            <Typography variant="body2" sx={{ width: 40, textAlign: 'center', color: '#4CAF50', fontWeight: 600 }}>
              {entry.victorias}
            </Typography>

            {/* D */}
            <Typography variant="body2" sx={{ width: 40, textAlign: 'center', color: '#FF6B6B', fontWeight: 600 }}>
              {entry.derrotas}
            </Typography>

            {/* Pts */}
            <Typography variant="body2" sx={{ width: 50, textAlign: 'center', color: '#D4A84B', fontWeight: 800 }}>
              {entry.puntos}
            </Typography>

            {/* Racha */}
            <Box sx={{ width: 55, textAlign: 'center', display: { xs: 'none', md: 'block' } }}>
              <Chip
                label={entry.racha}
                size="small"
                sx={{
                  fontSize: '0.65rem',
                  height: 20,
                  fontWeight: 600,
                  backgroundColor: entry.racha.startsWith('W')
                    ? 'rgba(76, 175, 80, 0.15)' : 'rgba(255, 107, 107, 0.15)',
                  color: entry.racha.startsWith('W') ? '#4CAF50' : '#FF6B6B',
                }}
              />
            </Box>

            {/* Cambio */}
            <Box sx={{ width: 30, textAlign: 'center' }}>
              {entry.cambio === 'up' && <TrendingUpIcon sx={{ fontSize: 18, color: '#4CAF50' }} />}
              {entry.cambio === 'down' && <TrendingDownIcon sx={{ fontSize: 18, color: '#FF6B6B' }} />}
              {entry.cambio === 'same' && <RemoveIcon sx={{ fontSize: 18, color: '#C4B0B850' }} />}
            </Box>
          </Box>
        );
      })}
    </Paper>
  );
}