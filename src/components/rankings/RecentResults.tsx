// src/components/rankings/RecentResults.tsx
'use client';
import {
  Paper,
  Box,
  Typography,
  Avatar,
  Chip,
  Divider,
} from '@mui/material';
import HistoryIcon from '@mui/icons-material/History';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';

export interface RecentMatch {
  id: number;
  torneo: string;
  ronda: string;
  fecha: string;
  juego: string;
  teamA: { nombre: string; tag: string; score: number };
  teamB: { nombre: string; tag: string; score: number };
}

interface RecentResultsProps {
  matches: RecentMatch[];
}

export default function RecentResults({ matches }: RecentResultsProps) {
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
        <HistoryIcon sx={{ color: '#D4A84B' }} />
        <Typography variant="h6" sx={{ fontWeight: 700, color: '#F5F0F2' }}>
          Resultados recientes
        </Typography>
      </Box>

      {/* Matches */}
      {matches.map((match, index) => {
        const winnerTag = match.teamA.score > match.teamB.score
          ? match.teamA.tag : match.teamB.tag;

        return (
          <Box key={match.id}>
            <Box
              sx={{
                p: 2,
                transition: 'background-color 0.2s',
                '&:hover': { backgroundColor: 'rgba(26, 10, 16, 0.5)' },
              }}
            >
              {/* Info del torneo */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                  <SportsEsportsIcon sx={{ fontSize: 14, color: '#D4A84B' }} />
                  <Typography variant="caption" sx={{ color: '#D4A84B', fontWeight: 500 }}>
                    {match.juego}
                  </Typography>
                </Box>
                <Typography variant="caption" color="text.secondary">
                  {match.fecha}
                </Typography>
              </Box>

              {/* Marcador */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 2,
                }}
              >
                {/* Team A */}
                <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1 }}>
                  <Box sx={{ textAlign: 'right', overflow: 'hidden' }}>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: match.teamA.score > match.teamB.score ? 700 : 400,
                        color: match.teamA.score > match.teamB.score ? '#4CAF50' : '#C4B0B8',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {match.teamA.nombre}
                    </Typography>
                  </Box>
                  <Avatar
                    sx={{
                      width: 32,
                      height: 32,
                      fontSize: '0.65rem',
                      fontWeight: 800,
                      background: match.teamA.score > match.teamB.score
                        ? 'linear-gradient(135deg, #4CAF50, #2E7D32)'
                        : 'rgba(123, 30, 59, 0.4)',
                      color: '#F5F0F2',
                      flexShrink: 0,
                    }}
                  >
                    {match.teamA.tag}
                  </Avatar>
                </Box>

                {/* Score */}
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    px: 1.5,
                    py: 0.5,
                    borderRadius: 1.5,
                    backgroundColor: 'rgba(26, 10, 16, 0.6)',
                    flexShrink: 0,
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 800, color: match.teamA.score > match.teamB.score ? '#4CAF50' : '#C4B0B8' }}>
                    {match.teamA.score}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#C4B0B850' }}>—</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: match.teamB.score > match.teamA.score ? '#4CAF50' : '#C4B0B8' }}>
                    {match.teamB.score}
                  </Typography>
                </Box>

                {/* Team B */}
                <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Avatar
                    sx={{
                      width: 32,
                      height: 32,
                      fontSize: '0.65rem',
                      fontWeight: 800,
                      background: match.teamB.score > match.teamA.score
                        ? 'linear-gradient(135deg, #4CAF50, #2E7D32)'
                        : 'rgba(123, 30, 59, 0.4)',
                      color: '#F5F0F2',
                      flexShrink: 0,
                    }}
                  >
                    {match.teamB.tag}
                  </Avatar>
                  <Box sx={{ overflow: 'hidden' }}>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: match.teamB.score > match.teamA.score ? 700 : 400,
                        color: match.teamB.score > match.teamA.score ? '#4CAF50' : '#C4B0B8',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {match.teamB.nombre}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              {/* Torneo y ronda */}
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center', mt: 1 }}>
                {match.torneo} — {match.ronda}
              </Typography>
            </Box>
            {index < matches.length - 1 && (
              <Divider sx={{ borderColor: 'rgba(123, 30, 59, 0.1)' }} />
            )}
          </Box>
        );
      })}
    </Paper>
  );
}