// src/app/tournaments/[id]/brackets/page.tsx
'use client';
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Chip,
  Tabs,
  Tab,
} from '@mui/material';
import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import Navbar from '@/components/Navbar';
import BracketView from '@/components/tournaments/BracketView';
import { MatchData } from '@/components/tournaments/BracketMatch';

// ============================================
// DATOS SIMULADOS (mock data)
// Torneo de 8 equipos = 3 rondas (cuartos, semi, final)
// ============================================

const mockTournamentInfo = {
  nombre: 'Interpolitécnicos 2025 - Valorant',
  juego: 'Valorant',
  formato: 'Eliminación simple',
  estado: 'En curso',
};

const mockMatches: MatchData[] = [
  // --- RONDA 1: Cuartos de final (4 partidas) ---
  {
    id: 1,
    round: 1,
    position: 1,
    teamA: { nombre: 'ESCOM Elite', tag: 'ELT', score: 13, isWinner: true },
    teamB: { nombre: 'ENCB Team', tag: 'ENC', score: 7, isWinner: false },
    status: 'finalizado',
    fecha: '18/11/2025 16:00',
  },
  {
    id: 2,
    round: 1,
    position: 2,
    teamA: { nombre: 'UPIICSA Warriors', tag: 'UPW', score: 11, isWinner: false },
    teamB: { nombre: 'ESIME Thunder', tag: 'ETH', score: 13, isWinner: true },
    status: 'finalizado',
    fecha: '18/11/2025 17:00',
  },
  {
    id: 3,
    round: 1,
    position: 3,
    teamA: { nombre: 'CECyT Legends', tag: 'CYL', score: 13, isWinner: true },
    teamB: { nombre: 'Poli Gamers', tag: 'PLG', score: 9, isWinner: false },
    status: 'finalizado',
    fecha: '18/11/2025 18:00',
  },
  {
    id: 4,
    round: 1,
    position: 4,
    teamA: { nombre: 'ESIA Snipers', tag: 'ESN', score: 8, isWinner: false },
    teamB: { nombre: 'Zacatenco FC', tag: 'ZFC', score: 13, isWinner: true },
    status: 'finalizado',
    fecha: '18/11/2025 19:00',
  },

  // --- RONDA 2: Semifinales (2 partidas) ---
  {
    id: 5,
    round: 2,
    position: 1,
    teamA: { nombre: 'ESCOM Elite', tag: 'ELT', score: 2, isWinner: false },
    teamB: { nombre: 'ESIME Thunder', tag: 'ETH', score: 1, isWinner: false },
    status: 'en_curso',
    fecha: '25/11/2025 16:00',
  },
  {
    id: 6,
    round: 2,
    position: 2,
    teamA: { nombre: 'CECyT Legends', tag: 'CYL', score: null, isWinner: false },
    teamB: { nombre: 'Zacatenco FC', tag: 'ZFC', score: null, isWinner: false },
    status: 'pendiente',
    fecha: '25/11/2025 18:00',
  },

  // --- RONDA 3: Final ---
  {
    id: 7,
    round: 3,
    position: 1,
    teamA: null,
    teamB: null,
    status: 'pendiente',
    fecha: '01/12/2025 17:00',
  },
];

// Leyenda de estados
const statusLegend = [
  { label: 'Finalizado', color: '#4CAF50' },
  { label: 'En curso', color: '#D4A84B' },
  { label: 'Pendiente', color: '#C4B0B850' },
];

// ============================================

export default function BracketsPage() {
  const router = useRouter();
  const params = useParams();
  const tournamentId = params.id;

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background:
          'linear-gradient(135deg, #1A0A10 0%, #2A1520 50%, #1A0A10 100%)',
      }}
    >
      <Navbar isLoggedIn={true} userName="Kevin Díaz" />

      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Botón volver */}
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => router.push(`/tournaments/${tournamentId}`)}
          sx={{ color: '#C4B0B8', mb: 2 }}
        >
          Volver al torneo
        </Button>

        {/* Encabezado */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5, flexWrap: 'wrap' }}>
            <AccountTreeIcon sx={{ fontSize: 32, color: '#D4A84B' }} />
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#F5F0F2' }}>
              Brackets
            </Typography>
            <Chip
              label={mockTournamentInfo.estado}
              size="small"
              sx={{
                backgroundColor: 'rgba(212, 168, 75, 0.15)',
                color: '#D4A84B',
                fontWeight: 600,
              }}
            />
          </Box>
          <Typography variant="body1" sx={{ color: '#C4B0B8' }}>
            {mockTournamentInfo.nombre}
          </Typography>
        </Box>

        {/* Leyenda */}
        <Paper
          elevation={0}
          sx={{
            p: 2,
            mb: 3,
            backgroundColor: 'rgba(42, 21, 32, 0.5)',
            border: '1px solid rgba(123, 30, 59, 0.2)',
            display: 'flex',
            gap: 3,
            flexWrap: 'wrap',
            alignItems: 'center',
          }}
        >
          <Typography variant="body2" sx={{ color: '#C4B0B8', fontWeight: 500 }}>
            Estado:
          </Typography>
          {statusLegend.map((item) => (
            <Box
              key={item.label}
              sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}
            >
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: item.color,
                }}
              />
              <Typography variant="caption" sx={{ color: '#C4B0B8' }}>
                {item.label}
              </Typography>
            </Box>
          ))}
        </Paper>

        {/* Bracket */}
        <Paper
          elevation={0}
          sx={{
            p: 3,
            backgroundColor: 'rgba(42, 21, 32, 0.8)',
            border: '1px solid rgba(123, 30, 59, 0.3)',
          }}
        >
          <BracketView
            matches={mockMatches}
            totalRounds={3}
            format={mockTournamentInfo.formato}
          />
        </Paper>

        {/* Info adicional */}
        <Paper
          elevation={0}
          sx={{
            p: 3,
            mt: 3,
            backgroundColor: 'rgba(42, 21, 32, 0.5)',
            border: '1px solid rgba(123, 30, 59, 0.2)',
          }}
        >
          <Typography variant="subtitle2" sx={{ color: '#D4A84B', fontWeight: 600, mb: 1 }}>
            Información del torneo
          </Typography>
          <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            <Box>
              <Typography variant="caption" color="text.secondary">Juego</Typography>
              <Typography variant="body2" sx={{ color: '#F5F0F2' }}>
                {mockTournamentInfo.juego}
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">Formato</Typography>
              <Typography variant="body2" sx={{ color: '#F5F0F2' }}>
                {mockTournamentInfo.formato}
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">Equipos</Typography>
              <Typography variant="body2" sx={{ color: '#F5F0F2' }}>
                8 equipos
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">Rondas</Typography>
              <Typography variant="body2" sx={{ color: '#F5F0F2' }}>
                3 rondas (Cuartos → Semifinal → Final)
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}