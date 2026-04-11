// src/app/matches/[id]/report/page.tsx
'use client';
import { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Alert,
  Snackbar,
  Paper,
} from '@mui/material';
import { useRouter, useParams } from 'next/navigation';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Navbar from '@/components/Navbar';
import ReportResultForm from '@/components/matches/ReportResultForm';

// ============================================
// DATOS SIMULADOS
// ============================================

const mockMatch = {
  id: 5,
  ronda: 'Semifinal 1',
  fecha: '25/11/2025 16:00',
  torneo: 'Interpolitécnicos 2025 - Valorant',
  tournamentId: 1,
};

const mockTeamA = { nombre: 'ESCOM Elite', tag: 'ELT' };
const mockTeamB = { nombre: 'ESIME Thunder', tag: 'ETH' };

// ============================================

export default function ReportResultPage() {
  const router = useRouter();
  const params = useParams();
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (data: {
    scoreA: number;
    scoreB: number;
    screenshots: File[];
    comentario: string;
  }) => {
    // TODO: Conectar con el backend
    // const formData = new FormData();
    // formData.append('matchId', params.id);
    // formData.append('scoreA', data.scoreA.toString());
    // formData.append('scoreB', data.scoreB.toString());
    // formData.append('comentario', data.comentario);
    // data.screenshots.forEach((file) => formData.append('screenshots', file));
    // const response = await fetch('/api/matches/report', {
    //   method: 'POST',
    //   body: formData,
    // });

    await new Promise((resolve) => setTimeout(resolve, 1500));
    console.log('Resultado reportado:', data);
    setSubmitted(true);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1A0A10 0%, #2A1520 50%, #1A0A10 100%)',
      }}
    >
      <Navbar isLoggedIn={true} userName="Kevin Díaz" />

      <Container maxWidth="md" sx={{ py: 4 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => router.push(`/tournaments/${mockMatch.tournamentId}/brackets`)}
          sx={{ color: '#C4B0B8', mb: 2 }}
        >
          Volver a brackets
        </Button>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 4 }}>
          <AssignmentIcon sx={{ fontSize: 32, color: '#D4A84B' }} />
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#F5F0F2' }}>
            Reportar resultado
          </Typography>
        </Box>

        {submitted ? (
          /* Éxito */
          <Paper
            elevation={0}
            sx={{
              p: 4,
              textAlign: 'center',
              backgroundColor: 'rgba(42, 21, 32, 0.8)',
              border: '1px solid rgba(76, 175, 80, 0.3)',
            }}
          >
            <CheckCircleIcon sx={{ fontSize: 72, color: '#4CAF50', mb: 2 }} />
            <Typography variant="h5" sx={{ color: '#4CAF50', fontWeight: 700, mb: 1 }}>
              ¡Resultado reportado!
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Un moderador revisará las capturas de pantalla y validará el resultado.
              Recibirás una notificación cuando sea aprobado.
            </Typography>
            <Button
              variant="contained"
              onClick={() => router.push(`/tournaments/${mockMatch.tournamentId}/brackets`)}
            >
              Volver a brackets
            </Button>
          </Paper>
        ) : (
          <Paper
            elevation={0}
            sx={{
              p: 4,
              backgroundColor: 'rgba(42, 21, 32, 0.8)',
              border: '1px solid rgba(123, 30, 59, 0.3)',
            }}
          >
            <ReportResultForm
              matchInfo={mockMatch}
              teamA={mockTeamA}
              teamB={mockTeamB}
              myTeamTag="ELT"
              onSubmit={handleSubmit}
            />
          </Paper>
        )}
      </Container>
    </Box>
  );
}