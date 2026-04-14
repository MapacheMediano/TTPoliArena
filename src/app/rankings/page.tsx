'use client';
import { useState, useEffect, useMemo } from 'react';
import {
  Box, Container, Typography, Grid,
  TextField, MenuItem, CircularProgress,
} from '@mui/material';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import Navbar from '@/components/Navbar';
import RankingTable, { RankingEntry } from '@/components/rankings/RankingTable';
import RecentResults, { RecentMatch } from '@/components/rankings/RecentResults';
import { getRankings } from '@/lib/api/rankings.service';
import { getCurrentUser } from '@/lib/api/auth.service';
import { useRouter } from 'next/navigation';

const juegos = ['Todos', 'Valorant', 'League of Legends', 'Rocket League', 'Overwatch', 'Fortnite', 'Super Smash Bros', 'Clash Royale', 'Marvel Rivals'];

// Resultados recientes quedan como mock hasta que existan partidos en BD
const mockRecentMatches: RecentMatch[] = [];

export default function RankingsPage() {
  const router = useRouter();
  const [rankings, setRankings] = useState<RankingEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterJuego, setFilterJuego] = useState('Todos');
  const [userName, setUserName] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const meRes = await getCurrentUser();
        if (!meRes.user) {
          router.push('/login');
          return;
        }
        setUserName(meRes.user.email.split('@')[0]);

        const rankingsRes = await getRankings();
        if (rankingsRes.ok && rankingsRes.rankings) {
          setRankings(rankingsRes.rankings);
        }
      } catch (error) {
        console.error('Error cargando rankings:', error);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [router]);

  const filteredRankings = useMemo(() => {
    if (filterJuego === 'Todos') return rankings;
    return rankings.filter(r =>
      r.juego.toLowerCase().includes(filterJuego.toLowerCase().slice(0, 4))
    );
  }, [rankings, filterJuego]);

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #1A0A10 0%, #2A1520 50%, #1A0A10 100%)' }}>
        <CircularProgress sx={{ color: '#D4A84B' }} />
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1A0A10 0%, #2A1520 50%, #1A0A10 100%)' }}>
      <Navbar isLoggedIn={true} userName={userName} />

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
            <LeaderboardIcon sx={{ fontSize: 32, color: '#D4A84B' }} />
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#F5F0F2' }}>
              Rankings y Resultados
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">
            Clasificacion general de equipos en PoliArena
          </Typography>
        </Box>

        <Box sx={{ mb: 3 }}>
          <TextField
            select
            size="small"
            label="Filtrar por juego"
            value={filterJuego}
            onChange={(e) => setFilterJuego(e.target.value)}
            sx={{ minWidth: 200 }}
          >
            {juegos.map((j) => (
              <MenuItem key={j} value={j}>{j}</MenuItem>
            ))}
          </TextField>
        </Box>

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, lg: 7 }}>
            <RankingTable
              rankings={filteredRankings}
              title="Clasificacion general"
            />
          </Grid>
          <Grid size={{ xs: 12, lg: 5 }}>
            <RecentResults matches={mockRecentMatches} />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}