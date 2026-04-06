// src/app/rankings/page.tsx
'use client';
import { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  TextField,
  MenuItem,
  Chip,
} from '@mui/material';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import Navbar from '@/components/Navbar';
import RankingTable, { RankingEntry } from '@/components/rankings/RankingTable';
import RecentResults, { RecentMatch } from '@/components/rankings/RecentResults';

// ============================================
// DATOS SIMULADOS
// ============================================

const mockRankings: RankingEntry[] = [
  { posicion: 1, equipo: 'ESCOM Elite', tag: 'ELT', juego: 'Valorant', victorias: 18, derrotas: 2, puntos: 1540, racha: 'W5', cambio: 'same' },
  { posicion: 2, equipo: 'ESIME Thunder', tag: 'ETH', juego: 'Valorant', victorias: 15, derrotas: 4, puntos: 1380, racha: 'W3', cambio: 'up' },
  { posicion: 3, equipo: 'CECyT Legends', tag: 'CYL', juego: 'LoL', victorias: 14, derrotas: 5, puntos: 1320, racha: 'L1', cambio: 'down' },
  { posicion: 4, equipo: 'UPIICSA Warriors', tag: 'UPW', juego: 'LoL', victorias: 13, derrotas: 6, puntos: 1250, racha: 'W2', cambio: 'up' },
  { posicion: 5, equipo: 'Zacatenco FC', tag: 'ZFC', juego: 'Rocket L.', victorias: 12, derrotas: 5, puntos: 1200, racha: 'W4', cambio: 'up' },
  { posicion: 6, equipo: 'Poli Gamers', tag: 'PLG', juego: 'Rocket L.', victorias: 11, derrotas: 7, puntos: 1120, racha: 'L2', cambio: 'down' },
  { posicion: 7, equipo: 'ESIA Snipers', tag: 'ESN', juego: 'Fortnite', victorias: 10, derrotas: 6, puntos: 1080, racha: 'W1', cambio: 'same' },
  { posicion: 8, equipo: 'María Jiménez Team', tag: 'MJT', juego: 'Smash', victorias: 10, derrotas: 8, puntos: 1020, racha: 'W2', cambio: 'up' },
  { posicion: 9, equipo: 'CIC Hackers', tag: 'CIH', juego: 'Valorant', victorias: 9, derrotas: 9, puntos: 950, racha: 'L1', cambio: 'down' },
  { posicion: 10, equipo: 'ENCB Team', tag: 'ENC', juego: 'LoL', victorias: 8, derrotas: 10, puntos: 880, racha: 'L3', cambio: 'down' },
  { posicion: 11, equipo: 'UPIITA Robots', tag: 'UPR', juego: 'Overwatch', victorias: 7, derrotas: 8, puntos: 820, racha: 'W1', cambio: 'up' },
  { posicion: 12, equipo: 'ESFM Quantum', tag: 'EFQ', juego: 'Marvel R.', victorias: 6, derrotas: 10, puntos: 740, racha: 'L2', cambio: 'same' },
];

const mockRecentMatches: RecentMatch[] = [
  { id: 1, torneo: 'Interpolitécnicos 2025', ronda: 'Semifinal 1', fecha: '25/11/2025', juego: 'Valorant', teamA: { nombre: 'ESCOM Elite', tag: 'ELT', score: 13 }, teamB: { nombre: 'ESIME Thunder', tag: 'ETH', score: 9 } },
  { id: 2, torneo: 'Copa ESCOM', ronda: 'Cuartos 3', fecha: '24/11/2025', juego: 'LoL', teamA: { nombre: 'CECyT Legends', tag: 'CYL', score: 1 }, teamB: { nombre: 'UPIICSA Warriors', tag: 'UPW', score: 2 } },
  { id: 3, torneo: 'Interpolitécnicos 2025', ronda: 'Cuartos 4', fecha: '23/11/2025', juego: 'Valorant', teamA: { nombre: 'ESIA Snipers', tag: 'ESN', score: 8 }, teamB: { nombre: 'Zacatenco FC', tag: 'ZFC', score: 13 } },
  { id: 4, torneo: 'Torneo Relámpago', ronda: 'Ronda 2', fecha: '22/11/2025', juego: 'Rocket League', teamA: { nombre: 'Poli Gamers', tag: 'PLG', score: 5 }, teamB: { nombre: 'ESIA Snipers', tag: 'ESN', score: 3 } },
  { id: 5, torneo: 'Copa ESCOM', ronda: 'Cuartos 2', fecha: '22/11/2025', juego: 'LoL', teamA: { nombre: 'ENCB Team', tag: 'ENC', score: 0 }, teamB: { nombre: 'CECyT Legends', tag: 'CYL', score: 2 } },
  { id: 6, torneo: 'Interpolitécnicos 2025', ronda: 'Cuartos 2', fecha: '21/11/2025', juego: 'Valorant', teamA: { nombre: 'UPIICSA Warriors', tag: 'UPW', score: 11 }, teamB: { nombre: 'ESIME Thunder', tag: 'ETH', score: 13 } },
  { id: 7, torneo: 'Torneo UPIICSA', ronda: 'Final', fecha: '20/11/2025', juego: 'Clash Royale', teamA: { nombre: 'UPIICSA Warriors', tag: 'UPW', score: 3 }, teamB: { nombre: 'CIC Hackers', tag: 'CIH', score: 1 } },
];

const juegos = ['Todos', 'Valorant', 'League of Legends', 'Rocket League', 'Overwatch', 'Fortnite', 'Super Smash Bros', 'Clash Royale', 'Marvel Rivals'];

// ============================================

export default function RankingsPage() {
  const [filterJuego, setFilterJuego] = useState('Todos');

  const filteredRankings = filterJuego === 'Todos'
    ? mockRankings
    : mockRankings.filter((r) =>
        r.juego.toLowerCase().includes(filterJuego.toLowerCase().slice(0, 4))
      );

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1A0A10 0%, #2A1520 50%, #1A0A10 100%)',
      }}
    >
      <Navbar isLoggedIn={true} userName="Kevin Díaz" />

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Encabezado */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5, flexWrap: 'wrap' }}>
            <LeaderboardIcon sx={{ fontSize: 32, color: '#D4A84B' }} />
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#F5F0F2' }}>
              Rankings y Resultados
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">
            Clasificación general de equipos y resultados recientes de partidas
          </Typography>
        </Box>

        {/* Filtro por juego */}
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
              <MenuItem key={j} value={j}>
                {j}
              </MenuItem>
            ))}
          </TextField>
        </Box>

        {/* Layout: Rankings + Resultados */}
        <Grid container spacing={3}>
          {/* Ranking */}
          <Grid size={{ xs: 12, lg: 7 }}>
            <RankingTable
              rankings={filteredRankings}
              title="Clasificación general"
            />
          </Grid>

          {/* Resultados recientes */}
          <Grid size={{ xs: 12, lg: 5 }}>
            <RecentResults matches={mockRecentMatches} />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}