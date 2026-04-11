// src/components/tournaments/BracketMatch.tsx
'use client';
import { Box, Typography, Paper } from '@mui/material';

export interface MatchTeam {
  nombre: string;
  tag: string;
  score: number | null;
  isWinner: boolean;
}

export interface MatchData {
  id: number;
  round: number;
  position: number;
  teamA: MatchTeam | null;
  teamB: MatchTeam | null;
  status: 'pendiente' | 'en_curso' | 'finalizado';
  fecha: string;
}

interface BracketMatchProps {
  match: MatchData;
  onClick?: () => void;
}

export default function BracketMatch({ match, onClick }: BracketMatchProps) {
  const TeamRow = ({
    team,
    isTop,
  }: {
    team: MatchTeam | null;
    isTop: boolean;
  }) => {
    const isEmpty = !team;
    const isWinner = team?.isWinner || false;

    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 1.5,
          py: 1,
          backgroundColor: isEmpty
            ? 'rgba(26, 10, 16, 0.3)'
            : isWinner
            ? 'rgba(76, 175, 80, 0.08)'
            : 'rgba(26, 10, 16, 0.5)',
          borderTop: isTop ? 'none' : '1px solid rgba(123, 30, 59, 0.15)',
          borderRadius: isTop ? '8px 8px 0 0' : '0 0 8px 8px',
          minWidth: 180,
        }}
      >
        {/* Nombre del equipo */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, overflow: 'hidden' }}>
          {team ? (
            <>
              <Typography
                variant="caption"
                sx={{
                  color: '#D4A84B',
                  fontWeight: 800,
                  fontSize: '0.65rem',
                  minWidth: 28,
                }}
              >
                {team.tag}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: isWinner ? '#4CAF50' : '#F5F0F2',
                  fontWeight: isWinner ? 700 : 400,
                  fontSize: '0.8rem',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {team.nombre}
              </Typography>
            </>
          ) : (
            <Typography
              variant="body2"
              sx={{ color: '#C4B0B850', fontSize: '0.8rem', fontStyle: 'italic' }}
            >
              Por definir
            </Typography>
          )}
        </Box>

        {/* Score */}
        <Box
          sx={{
            minWidth: 24,
            height: 24,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 1,
            ml: 1,
            backgroundColor: isWinner
              ? 'rgba(76, 175, 80, 0.2)'
              : 'rgba(123, 30, 59, 0.15)',
          }}
        >
          <Typography
            variant="caption"
            sx={{
              fontWeight: 700,
              color: isWinner ? '#4CAF50' : team?.score !== null ? '#F5F0F2' : '#C4B0B850',
              fontSize: '0.75rem',
            }}
          >
            {team?.score !== null && team?.score !== undefined ? team.score : '-'}
          </Typography>
        </Box>
      </Box>
    );
  };

  // Color del borde según estado
  const borderColor =
    match.status === 'en_curso'
      ? 'rgba(212, 168, 75, 0.5)'
      : match.status === 'finalizado'
      ? 'rgba(76, 175, 80, 0.3)'
      : 'rgba(123, 30, 59, 0.25)';

  return (
    <Paper
      elevation={0}
      onClick={onClick}
      sx={{
        border: `1px solid ${borderColor}`,
        borderRadius: 2,
        overflow: 'hidden',
        cursor: onClick ? 'pointer' : 'default',
        backgroundColor: 'rgba(42, 21, 32, 0.6)',
        transition: 'all 0.2s ease',
        width: 220,
        '&:hover': onClick
          ? {
              borderColor: '#D4A84B',
              transform: 'scale(1.02)',
            }
          : {},
      }}
    >
      {/* Encabezado con fecha y estado */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          px: 1.5,
          py: 0.5,
          backgroundColor: 'rgba(26, 10, 16, 0.5)',
          borderBottom: '1px solid rgba(123, 30, 59, 0.15)',
        }}
      >
        <Typography variant="caption" sx={{ color: '#C4B0B8', fontSize: '0.6rem' }}>
          {match.fecha}
        </Typography>
        <Box
          sx={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            backgroundColor:
              match.status === 'en_curso'
                ? '#D4A84B'
                : match.status === 'finalizado'
                ? '#4CAF50'
                : '#C4B0B850',
          }}
        />
      </Box>

      {/* Equipos */}
      <TeamRow team={match.teamA} isTop={true} />
      <TeamRow team={match.teamB} isTop={false} />
    </Paper>
  );
}