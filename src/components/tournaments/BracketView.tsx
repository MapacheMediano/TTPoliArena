// src/components/tournaments/BracketView.tsx
'use client';
import { Box, Typography, Chip } from '@mui/material';
import BracketMatch, { MatchData } from './BracketMatch';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

interface BracketViewProps {
  matches: MatchData[];
  totalRounds: number;
  format: string;
}

export default function BracketView({ matches, totalRounds, format }: BracketViewProps) {
  // Nombres de las rondas
  const getRoundName = (round: number): string => {
    if (round === totalRounds) return 'Final';
    if (round === totalRounds - 1) return 'Semifinal';
    if (round === totalRounds - 2) return 'Cuartos';
    return `Ronda ${round}`;
  };

  // Agrupar partidas por ronda
  const matchesByRound: Record<number, MatchData[]> = {};
  for (let r = 1; r <= totalRounds; r++) {
    matchesByRound[r] = matches
      .filter((m) => m.round === r)
      .sort((a, b) => a.position - b.position);
  }

  return (
    <Box>
      {/* Encabezado con formato */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
        <Chip
          label={format}
          size="small"
          variant="outlined"
          sx={{
            borderColor: 'rgba(123, 30, 59, 0.4)',
            color: '#C4B0B8',
          }}
        />
      </Box>

      {/* Bracket horizontal scrolleable */}
      <Box
        sx={{
          overflowX: 'auto',
          pb: 2,
          '&::-webkit-scrollbar': {
            height: 8,
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: 'rgba(26, 10, 16, 0.5)',
            borderRadius: 4,
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(123, 30, 59, 0.4)',
            borderRadius: 4,
            '&:hover': {
              backgroundColor: 'rgba(123, 30, 59, 0.6)',
            },
          },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            gap: 4,
            minWidth: 'fit-content',
            py: 2,
          }}
        >
          {Array.from({ length: totalRounds }, (_, i) => i + 1).map((round) => {
            const roundMatches = matchesByRound[round] || [];
            const isFinal = round === totalRounds;

            return (
              <Box
                key={round}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 0,
                  minWidth: 240,
                }}
              >
                {/* Nombre de la ronda */}
                <Typography
                  variant="subtitle2"
                  sx={{
                    color: isFinal ? '#D4A84B' : '#C4B0B8',
                    fontWeight: isFinal ? 700 : 500,
                    mb: 2,
                    textAlign: 'center',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                  }}
                >
                  {isFinal && <EmojiEventsIcon sx={{ fontSize: 18, color: '#D4A84B' }} />}
                  {getRoundName(round)}
                </Typography>

                {/* Partidas de esta ronda */}
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-around',
                    flex: 1,
                    gap: round === 1 ? 2 : `${Math.pow(2, round - 1) * 24}px`,
                    width: '100%',
                  }}
                >
                  {roundMatches.map((match) => (
                    <Box
                      key={match.id}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        position: 'relative',
                      }}
                    >
                      {/* Línea conectora izquierda */}
                      {round > 1 && (
                        <Box
                          sx={{
                            position: 'absolute',
                            left: -16,
                            top: '50%',
                            width: 16,
                            height: 1,
                            backgroundColor: 'rgba(123, 30, 59, 0.3)',
                          }}
                        />
                      )}

                      <BracketMatch
                        match={match}
                        onClick={() => console.log('Ver partida:', match.id)}
                      />

                      {/* Línea conectora derecha */}
                      {round < totalRounds && (
                        <Box
                          sx={{
                            position: 'absolute',
                            right: -16,
                            top: '50%',
                            width: 16,
                            height: 1,
                            backgroundColor: 'rgba(123, 30, 59, 0.3)',
                          }}
                        />
                      )}
                    </Box>
                  ))}
                </Box>
              </Box>
            );
          })}

          {/* Campeón */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              minWidth: 160,
            }}
          >
            <Typography
              variant="subtitle2"
              sx={{ color: '#D4A84B', fontWeight: 700, mb: 2 }}
            >
              Campeón
            </Typography>
            {(() => {
              const finalMatch = matches.find(
                (m) => m.round === totalRounds && m.status === 'finalizado'
              );
              const winner =
                finalMatch?.teamA?.isWinner
                  ? finalMatch.teamA
                  : finalMatch?.teamB?.isWinner
                  ? finalMatch.teamB
                  : null;

              return winner ? (
                <Box
                  sx={{
                    textAlign: 'center',
                    p: 2,
                    borderRadius: 2,
                    backgroundColor: 'rgba(212, 168, 75, 0.1)',
                    border: '2px solid #D4A84B',
                  }}
                >
                  <EmojiEventsIcon sx={{ fontSize: 40, color: '#D4A84B', mb: 1 }} />
                  <Typography
                    variant="body1"
                    sx={{ color: '#D4A84B', fontWeight: 800 }}
                  >
                    [{winner.tag}]
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: '#F5F0F2', fontWeight: 600 }}
                  >
                    {winner.nombre}
                  </Typography>
                </Box>
              ) : (
                <Box
                  sx={{
                    textAlign: 'center',
                    p: 2,
                    borderRadius: 2,
                    border: '2px dashed rgba(212, 168, 75, 0.3)',
                  }}
                >
                  <EmojiEventsIcon sx={{ fontSize: 40, color: '#C4B0B850', mb: 1 }} />
                  <Typography variant="body2" sx={{ color: '#C4B0B850' }}>
                    Por definir
                  </Typography>
                </Box>
              );
            })()}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}