// src/components/profile/TournamentHistory.tsx
'use client';
import {
  Paper,
  Typography,
  Box,
  Chip,
  Divider,
} from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

interface TournamentRecord {
  id: number;
  nombre: string;
  juego: string;
  fecha: string;
  posicion: string;
  equipo: string;
}

const positionColors: Record<string, { bg: string; text: string }> = {
  '1er lugar': { bg: 'rgba(255, 215, 0, 0.15)', text: '#FFD700' },
  '2do lugar': { bg: 'rgba(192, 192, 192, 0.15)', text: '#C0C0C0' },
  '3er lugar': { bg: 'rgba(205, 127, 50, 0.15)', text: '#CD7F32' },
};

interface TournamentHistoryProps {
  history: TournamentRecord[];
}

export default function TournamentHistory({ history }: TournamentHistoryProps) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        backgroundColor: 'rgba(42, 21, 32, 0.8)',
        border: '1px solid rgba(123, 30, 59, 0.3)',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
        <EmojiEventsIcon sx={{ color: '#D4A84B' }} />
        <Typography variant="h6" sx={{ fontWeight: 700, color: '#F5F0F2' }}>
          Historial de torneos
        </Typography>
        <Chip
          label={`${history.length} torneos`}
          size="small"
          sx={{
            backgroundColor: 'rgba(212, 168, 75, 0.15)',
            color: '#D4A84B',
            fontWeight: 600,
          }}
        />
      </Box>

      {history.length > 0 ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {history.map((record, index) => {
            const posStyle = positionColors[record.posicion] || {
              bg: 'rgba(158, 158, 158, 0.1)',
              text: '#9E9E9E',
            };

            return (
              <Box key={record.id}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    p: 2,
                    borderRadius: 2,
                    backgroundColor: 'rgba(26, 10, 16, 0.4)',
                    flexWrap: 'wrap',
                    gap: 1,
                    transition: 'background-color 0.2s',
                    '&:hover': {
                      backgroundColor: 'rgba(26, 10, 16, 0.7)',
                    },
                  }}
                >
                  {/* Info del torneo */}
                  <Box>
                    <Typography
                      variant="body2"
                      sx={{ color: '#F5F0F2', fontWeight: 600, mb: 0.5 }}
                    >
                      {record.nombre}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
                      <Box
                        component="span"
                        sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
                      >
                        <SportsEsportsIcon sx={{ fontSize: 14, color: '#D4A84B' }} />
                        <Typography component="span" variant="caption" sx={{ color: '#D4A84B' }}>
                          {record.juego}
                        </Typography>
                      </Box>
                      <Box
                        component="span"
                        sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
                      >
                        <CalendarTodayIcon sx={{ fontSize: 12, color: '#C4B0B8' }} />
                        <Typography component="span" variant="caption" color="text.secondary">
                          {record.fecha}
                        </Typography>
                      </Box>
                      <Typography component="span" variant="caption" color="text.secondary">
                        con {record.equipo}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Posición */}
                  <Chip
                    label={record.posicion}
                    size="small"
                    sx={{
                      backgroundColor: posStyle.bg,
                      color: posStyle.text,
                      fontWeight: 600,
                      border: `1px solid ${posStyle.text}30`,
                    }}
                  />
                </Box>
              </Box>
            );
          })}
        </Box>
      ) : (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="body2" color="text.secondary">
            Aún no has participado en ningún torneo
          </Typography>
        </Box>
      )}
    </Paper>
  );
}