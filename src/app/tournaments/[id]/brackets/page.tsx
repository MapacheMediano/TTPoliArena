'use client';
import { useEffect, useState } from 'react';
import {
  Box, Container, Typography, Button, Paper,
  CircularProgress, Alert, Chip,
} from '@mui/material';
import { useRouter, useParams } from 'next/navigation';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import Navbar from '@/components/Navbar';
import BracketView from '@/components/tournaments/BracketView';
import { getTournamentBrackets, generateBracket } from '@/lib/api/tournaments.service';
import { getCurrentUser } from '@/lib/api/auth.service';
import type { BracketMatch } from '@/lib/api/tournaments.service';

const formatoMap: Record<string, string> = {
  'eliminacion_simple': 'Eliminación simple',
  'eliminacion_doble': 'Eliminación doble',
  'round_robin': 'Round Robin',
};

function mapMatch(m: BracketMatch) {
  return {
    id: m.id,
    round: m.round,
    position: m.position,
    bracket: m.bracket,
    status: m.status.toLowerCase(),
    teamA: m.teamA ? {
      id: m.teamA.id,
      nombre: m.teamA.name,
      tag: m.teamA.tag,
      score: m.scoreA ?? 0,
      isWinner: m.winnerId === m.teamA.id,
    } : null,
    teamB: m.teamB ? {
      id: m.teamB.id,
      nombre: m.teamB.name,
      tag: m.teamB.tag,
      score: m.scoreB ?? 0,
      isWinner: m.winnerId === m.teamB.id,
    } : null,
  };
}

export default function BracketsPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [matches, setMatches] = useState<BracketMatch[]>([]);
  const [tournament, setTournament] = useState<{ id: string; title: string; format: string; status: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');
  const [userRole, setUserRole] = useState('');
  const [userName, setUserName] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const meRes = await getCurrentUser();
        if (!meRes.user) {
          router.push('/login');
          return;
        }
        setUserRole(meRes.user.role);
        setUserName(meRes.user.email.split('@')[0]);

        const bracketsRes = await getTournamentBrackets(id);
        if (bracketsRes.ok) {
          setMatches(bracketsRes.matches ?? []);
          setTournament(bracketsRes.tournament ?? null);
        }
      } catch (error) {
        console.error('Error cargando brackets:', error);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id, router]);

  const handleGenerateBracket = async () => {
    setGenerating(true);
    setError('');
    try {
      const result = await generateBracket(id);
      if (result.ok && result.matches) {
        const bracketsRes = await getTournamentBrackets(id);
        if (bracketsRes.ok) {
          setMatches(bracketsRes.matches ?? []);
          setTournament(bracketsRes.tournament ?? null);
        }
      } else {
        setError(result.error ?? 'Error al generar bracket');
      }
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #1A0A10 0%, #2A1520 50%, #1A0A10 100%)' }}>
        <CircularProgress sx={{ color: '#D4A84B' }} />
      </Box>
    );
  }

  const canManage = userRole === 'ADMIN' || userRole === 'STAFF';
  const hasBracket = matches.length > 0;

  const maxRound = hasBracket
    ? Math.max(...matches.filter(m => m.bracket === 'WINNERS').map(m => m.round))
    : 0;

  const mappedMatches = matches
    .filter(m => m.bracket === 'WINNERS' || m.bracket === 'ROUND_ROBIN')
    .map(mapMatch);

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1A0A10 0%, #2A1520 50%, #1A0A10 100%)' }}>
      <Navbar isLoggedIn={true} userName={userName} />

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => router.push('/tournaments/' + id)}
          sx={{ color: '#C4B0B8', mb: 2 }}
        >
          Volver al torneo
        </Button>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3, flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
              <AccountTreeIcon sx={{ fontSize: 32, color: '#D4A84B' }} />
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#F5F0F2' }}>
                Brackets
              </Typography>
              {tournament && (
                <Chip
                  label={formatoMap[tournament.format] ?? tournament.format}
                  size="small"
                  sx={{ backgroundColor: 'rgba(212, 168, 75, 0.15)', color: '#D4A84B' }}
                />
              )}
            </Box>
            {tournament && (
              <Typography variant="body2" color="text.secondary">
                {tournament.title}
              </Typography>
            )}
          </Box>

          {canManage && !hasBracket && (
            <Button
              variant="contained"
              startIcon={<AutoFixHighIcon />}
              onClick={handleGenerateBracket}
              disabled={generating}
              sx={{ background: 'linear-gradient(135deg, #7B1E3B, #D4A84B)' }}
            >
              {generating ? 'Generando...' : 'Generar bracket'}
            </Button>
          )}
        </Box>

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        {!hasBracket ? (
          <Paper elevation={0} sx={{ p: 6, textAlign: 'center', backgroundColor: 'rgba(42, 21, 32, 0.5)', border: '1px solid rgba(123, 30, 59, 0.2)' }}>
            <AccountTreeIcon sx={{ fontSize: 64, color: '#C4B0B8', opacity: 0.5, mb: 2 }} />
            <Typography variant="h6" sx={{ color: '#C4B0B8', mb: 1 }}>
              El bracket aún no ha sido generado
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {canManage
                ? 'Haz click en "Generar bracket" para crear los emparejamientos'
                : 'El bracket será generado por el staff cuando se cierren las inscripciones'}
            </Typography>
          </Paper>
        ) : (
          <Paper elevation={0} sx={{ p: 3, backgroundColor: 'rgba(42, 21, 32, 0.8)', border: '1px solid rgba(123, 30, 59, 0.3)' }}>
            <BracketView
              matches={mappedMatches}
              totalRounds={maxRound}
              format={formatoMap[tournament?.format ?? ''] ?? tournament?.format ?? ''}
              onMatchClick={(matchId) => router.push('/matches/' + matchId + '/report')}
            />
          </Paper>
        )}
      </Container>
    </Box>
  );
}