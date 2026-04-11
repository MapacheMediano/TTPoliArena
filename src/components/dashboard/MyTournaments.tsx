// src/components/dashboard/MyTournaments.tsx
'use client';
import {
  Paper,
  Typography,
  Box,
  Button,
  Grid,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import TournamentCard, { TournamentData } from '@/components/TournamentCard';

interface MyTournamentsProps {
  tournaments: TournamentData[];
  onViewAll?: () => void;
  onBrowseTournaments?: () => void;
}

export default function MyTournaments({
  tournaments,
  onViewAll,
  onBrowseTournaments,
}: MyTournamentsProps) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        backgroundColor: 'rgba(42, 21, 32, 0.8)',
        border: '1px solid rgba(123, 30, 59, 0.3)',
      }}
    >
      {/* Encabezado */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 700, color: '#F5F0F2' }}>
          Mis Torneos
        </Typography>
        {tournaments.length > 0 && (
          <Button
            size="small"
            onClick={onViewAll}
            sx={{ color: '#D4A84B' }}
          >
            Ver todos
          </Button>
        )}
      </Box>

      {/* Lista de torneos */}
      {tournaments.length > 0 ? (
        <Grid container spacing={2}>
          {tournaments.map((tournament) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={tournament.id}>
              <TournamentCard
                tournament={tournament}
                onClick={() => console.log('Ver torneo:', tournament.id)}
              />
            </Grid>
          ))}
        </Grid>
      ) : (
        /* Estado vacío */
        <Box
          sx={{
            textAlign: 'center',
            py: 4,
            px: 2,
            borderRadius: 2,
            backgroundColor: 'rgba(26, 10, 16, 0.5)',
            border: '1px dashed rgba(123, 30, 59, 0.3)',
          }}
        >
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ mb: 2 }}
          >
            Aún no estás inscrito en ningún torneo
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={onBrowseTournaments}
          >
            Explorar torneos
          </Button>
        </Box>
      )}
    </Paper>
  );
}