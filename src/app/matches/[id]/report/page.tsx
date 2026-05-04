'use client';
import { useEffect, useState } from 'react';
import {
  Box, Container, Typography, Button,
  CircularProgress, Alert, Paper,
} from '@mui/material';
import { useRouter, useParams } from 'next/navigation';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Navbar from '@/components/Navbar';
import ReportResultForm from '@/components/matches/ReportResultForm';
import { getMatchById, reportMatchResult } from '@/lib/api/matches.service';
import { getCurrentUser } from '@/lib/api/auth.service';
import type { MatchDetail } from '@/lib/api/matches.service';

export default function ReportMatchPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [match, setMatch] = useState<MatchDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [userId, setUserId] = useState('');
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const meRes = await getCurrentUser();
        if (!meRes.user) {
          router.push('/login');
          return;
        }
        setUserId(meRes.user.id);
        setUserName(meRes.user.email.split('@')[0]);
        setUserRole(meRes.user.role);

        const matchRes = await getMatchById(id);
        if (!matchRes.ok || !matchRes.match) {
          setError('Partida no encontrada');
          return;
        }

        // Verifica que el usuario es capitán de uno de los equipos
        const isCaptainA = matchRes.match.teamA?.captainId === meRes.user.id;
        const isCaptainB = matchRes.match.teamB?.captainId === meRes.user.id;

        if (!isCaptainA && !isCaptainB) {
          setError('Solo el capitán de un equipo participante puede reportar el resultado');
          return;
        }

        if (matchRes.match.status !== 'PENDING') {
          setError('Esta partida ya tiene un resultado reportado o no está disponible');
          return;
        }

        setMatch(matchRes.match);
      } catch (error) {
        setError('Error al cargar la partida');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id, router]);

      const handleSubmit = async (data: {
      scoreA: number;
      scoreB: number;
      screenshots: File[];
      comentario: string;
    }) => {
      setError('');
      const result = await reportMatchResult(id, {
        scoreA: data.scoreA,
        scoreB: data.scoreB,
        evidenceUrl: data.comentario || undefined,
      });

      if (!result.ok) {
        setError(result.error ?? 'Error al enviar el reporte');
        return;
      }

        setSuccess(true);
      setTimeout(() => {
        router.push('/tournaments/' + match?.tournamentId);
      }, 2000);
    };

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #1A0A10 0%, #2A1520 50%, #1A0A10 100%)' }}>
        <CircularProgress sx={{ color: '#D4A84B' }} />
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1A0A10 0%, #2A1520 50%, #1A0A10 100%)' }}>
      <Navbar isLoggedIn={true} userName={userName} role={userRole}/>

      <Container maxWidth="md" sx={{ py: 4 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => router.push('/tournaments/' + match?.tournamentId)}
          sx={{ color: '#C4B0B8', mb: 2 }}
        >
          Volver al torneo
        </Button>

        <Typography variant="h4" sx={{ fontWeight: 800, color: '#F5F0F2', mb: 1 }}>
          Reportar resultado
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Ingresa el marcador final y sube evidencia del resultado
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            ¡Resultado reportado exitosamente! El staff validará el resultado pronto.
          </Alert>
        )}

        {match && !success && (
          <Paper elevation={0} sx={{ p: 3, backgroundColor: 'rgba(42, 21, 32, 0.8)', border: '1px solid rgba(123, 30, 59, 0.3)' }}>
            <ReportResultForm
              matchInfo={{
                id: match.id,
                ronda: 'Ronda ' + match.round,
                fecha: match.playedAt
                  ? new Date(match.playedAt).toLocaleDateString('es-MX')
                  : 'Por programar',
                torneo: match.tournament.title,
              }}
              teamA={{
                nombre: match.teamA?.name ?? 'Por definir',
                tag: match.teamA?.tag ?? '???',
              }}
              teamB={{
                nombre: match.teamB?.name ?? 'Por definir',
                tag: match.teamB?.tag ?? '???',
              }}
              myTeamTag={
                match.teamA?.captainId === userId
                  ? (match.teamA?.tag ?? '')
                  : (match.teamB?.tag ?? '')
              }
              onSubmit={handleSubmit}
            />
          </Paper>
        )}
      </Container>
    </Box>
  );
}