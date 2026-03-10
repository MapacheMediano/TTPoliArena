// src/app/matches/validate/page.tsx
'use client';
import { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Chip,
  Alert,
  Snackbar,
} from '@mui/material';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import Navbar from '@/components/Navbar';
import ValidateResultCard, { PendingResult } from '@/components/matches/ValidateResultCard';

// ============================================
// DATOS SIMULADOS
// Imágenes placeholder para las capturas
// ============================================

const mockPendingResults: PendingResult[] = [
  {
    id: 1,
    torneo: 'Interpolitécnicos 2025 - Valorant',
    ronda: 'Semifinal 1',
    fecha: '25/11/2025',
    teamA: { nombre: 'ESCOM Elite', tag: 'ELT' },
    teamB: { nombre: 'ESIME Thunder', tag: 'ETH' },
    scoreA: 13,
    scoreB: 9,
    reportadoPor: 'MapacheMediano',
    reportadoEquipo: 'ESCOM Elite',
    comentario: 'Partida disputada sin incidencias. GG.',
    screenshotUrls: [
      'https://picsum.photos/seed/match1a/800/450',
      'https://picsum.photos/seed/match1b/800/450',
    ],
    fechaReporte: '25/11/2025 17:30',
  },
  {
    id: 2,
    torneo: 'Copa ESCOM - League of Legends',
    ronda: 'Cuartos de final 3',
    fecha: '26/11/2025',
    teamA: { nombre: 'CECyT Legends', tag: 'CYL' },
    teamB: { nombre: 'UPIICSA Warriors', tag: 'UPW' },
    scoreA: 1,
    scoreB: 2,
    reportadoPor: 'LegendKing',
    reportadoEquipo: 'CECyT Legends',
    comentario: '',
    screenshotUrls: [
      'https://picsum.photos/seed/match2a/800/450',
      'https://picsum.photos/seed/match2b/800/450',
      'https://picsum.photos/seed/match2c/800/450',
    ],
    fechaReporte: '26/11/2025 19:15',
  },
  {
    id: 3,
    torneo: 'Torneo Relámpago - Rocket League',
    ronda: 'Ronda 1 — Partida 2',
    fecha: '27/11/2025',
    teamA: { nombre: 'Poli Gamers', tag: 'PLG' },
    teamB: { nombre: 'ESIA Snipers', tag: 'ESN' },
    scoreA: 5,
    scoreB: 3,
    reportadoPor: 'PoliPro',
    reportadoEquipo: 'Poli Gamers',
    comentario: 'El equipo contrario tuvo un desconectado en el game 2, se esperó 5 minutos y se continuó.',
    screenshotUrls: [
      'https://picsum.photos/seed/match3a/800/450',
    ],
    fechaReporte: '27/11/2025 20:45',
  },
];

// ============================================

export default function ValidateResultsPage() {
  const [results, setResults] = useState(mockPendingResults);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  const handleApprove = (id: number) => {
    // TODO: Conectar con backend PUT /api/matches/:id/validate
    setResults((prev) => prev.filter((r) => r.id !== id));
    setSnackbar({
      open: true,
      message: 'Resultado aprobado. El bracket se actualizará automáticamente.',
      severity: 'success',
    });
  };

  const handleReject = (id: number, motivo: string) => {
    // TODO: Conectar con backend PUT /api/matches/:id/reject
    console.log('Rechazado:', id, 'Motivo:', motivo);
    setResults((prev) => prev.filter((r) => r.id !== id));
    setSnackbar({
      open: true,
      message: 'Resultado rechazado. El capitán será notificado para reportar de nuevo.',
      severity: 'error',
    });
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1A0A10 0%, #2A1520 50%, #1A0A10 100%)',
      }}
    >
      <Navbar isLoggedIn={true} userName="Staff Admin" />

      <Container maxWidth="md" sx={{ py: 4 }}>
        {/* Encabezado */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
            <FactCheckIcon sx={{ fontSize: 32, color: '#D4A84B' }} />
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#F5F0F2' }}>
              Validar resultados
            </Typography>
            <Chip
              label={`${results.length} pendientes`}
              size="small"
              sx={{
                backgroundColor: results.length > 0
                  ? 'rgba(212, 168, 75, 0.15)' : 'rgba(76, 175, 80, 0.15)',
                color: results.length > 0 ? '#D4A84B' : '#4CAF50',
                fontWeight: 600,
              }}
            />
          </Box>
          <Typography variant="body2" color="text.secondary">
            Revisa las capturas de pantalla y verifica que los marcadores coincidan con la evidencia
          </Typography>
        </Box>

        {/* Lista de resultados pendientes */}
        {results.length > 0 ? (
          results.map((result) => (
            <ValidateResultCard
              key={result.id}
              result={result}
              onApprove={handleApprove}
              onReject={handleReject}
            />
          ))
        ) : (
          <Box
            sx={{
              textAlign: 'center',
              py: 6,
              px: 3,
              borderRadius: 3,
              backgroundColor: 'rgba(42, 21, 32, 0.5)',
              border: '1px solid rgba(76, 175, 80, 0.2)',
            }}
          >
            <FactCheckIcon sx={{ fontSize: 64, color: '#4CAF50', mb: 2 }} />
            <Typography variant="h6" sx={{ color: '#4CAF50', fontWeight: 700, mb: 1 }}>
              ¡Todo al día!
            </Typography>
            <Typography variant="body2" color="text.secondary">
              No hay resultados pendientes de validación
            </Typography>
          </Box>
        )}
      </Container>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}