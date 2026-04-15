'use client';
import { useState, useEffect } from 'react';
import {
  Box, Container, Typography, Chip,
  Alert, Snackbar, CircularProgress,
} from '@mui/material';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import Navbar from '@/components/Navbar';
import ValidateResultCard, { PendingResult } from '@/components/matches/ValidateResultCard';
import { validateMatchResult } from '@/lib/api/matches.service';
import { getCurrentUser } from '@/lib/api/auth.service';
import { apiClient } from '@/lib/api/client';
import { useRouter } from 'next/navigation';

export default function ValidateResultsPage() {
  const router = useRouter();
  const [results, setResults] = useState<PendingResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('');
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  useEffect(() => {
    async function load() {
      try {
        const meRes = await getCurrentUser();
        if (!meRes.user) {
          router.push('/login');
          return;
        }

        if (!['ADMIN', 'STAFF'].includes(meRes.user.role)) {
          router.push('/dashboard');
          return;
        }

        setUserName(meRes.user.email.split('@')[0]);

        const res = await apiClient<{ ok: boolean; matches: any[] }>('/api/matches/pending');
        if (res.ok && res.matches) {
          setResults(res.matches.map((m: any) => ({
            id: m.id,
            torneo: m.tournament.title,
            ronda: 'Ronda ' + m.round,
            fecha: m.playedAt
              ? new Date(m.playedAt).toLocaleDateString('es-MX')
              : 'Sin fecha',
            teamA: { nombre: m.teamA?.name ?? 'Por definir', tag: m.teamA?.tag ?? '???' },
            teamB: { nombre: m.teamB?.name ?? 'Por definir', tag: m.teamB?.tag ?? '???' },
            scoreA: m.scoreA ?? 0,
            scoreB: m.scoreB ?? 0,
            reportadoPor: m.reporter?.PlayerProfile?.gamerTag ?? m.reporter?.email?.split('@')[0] ?? 'Desconocido',
            reportadoEquipo: m.teamA?.name ?? '',
            comentario: '',
            screenshotUrls: m.evidenceUrl ? [m.evidenceUrl] : [],
            fechaReporte: new Date(m.updatedAt).toLocaleDateString('es-MX'),
          })));
        }
      } catch (error) {
        console.error('Error cargando resultados:', error);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [router]);

  const handleApprove = async (id: string) => {
    const result = await validateMatchResult(id, 'APPROVE');
    if (result.ok) {
      setResults(prev => prev.filter(r => r.id !== id));
      setSnackbar({
        open: true,
        message: 'Resultado aprobado. El bracket se actualizará automáticamente.',
        severity: 'success',
      });
    } else {
      setSnackbar({ open: true, message: result.error ?? 'Error al aprobar', severity: 'error' });
    }
  };

  const handleReject = async (id: string, motivo: string) => {
    const result = await validateMatchResult(id, 'REJECT', motivo);
    if (result.ok) {
      setResults(prev => prev.filter(r => r.id !== id));
      setSnackbar({
        open: true,
        message: 'Resultado rechazado. El capitán deberá reportar de nuevo.',
        severity: 'error',
      });
    } else {
      setSnackbar({ open: true, message: result.error ?? 'Error al rechazar', severity: 'error' });
    }
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
      <Navbar isLoggedIn={true} userName={userName} />

      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
            <FactCheckIcon sx={{ fontSize: 32, color: '#D4A84B' }} />
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#F5F0F2' }}>
              Validar resultados
            </Typography>
            <Chip
              label={results.length + ' pendientes'}
              size="small"
              sx={{
                backgroundColor: results.length > 0 ? 'rgba(212, 168, 75, 0.15)' : 'rgba(76, 175, 80, 0.15)',
                color: results.length > 0 ? '#D4A84B' : '#4CAF50',
                fontWeight: 600,
              }}
            />
          </Box>
          <Typography variant="body2" color="text.secondary">
            Revisa las capturas de pantalla y verifica que los marcadores coincidan
          </Typography>
        </Box>

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
          <Box sx={{ textAlign: 'center', py: 6, px: 3, borderRadius: 3, backgroundColor: 'rgba(42, 21, 32, 0.5)', border: '1px solid rgba(76, 175, 80, 0.2)' }}>
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
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}