'use client';
import { useEffect, useState } from 'react';
import {
  Box, Container, Typography, Button, Paper,
  CircularProgress, Alert, Chip, Tabs, Tab,
} from '@mui/material';
import { useRouter, useParams } from 'next/navigation';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
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
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    async function load() {
      try {
        const meRes = await getCurrentUser();
        if (!meRes.user) { router.push('/login'); return; }
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
      if (result.ok) {
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
  const format = tournament?.format ?? '';
  const isDoubleElim = format === 'eliminacion_doble';
  const isRoundRobin = format === 'round_robin';

  // Winners bracket
  const winnerMatches = matches.filter(m => m.bracket === 'WINNERS').map(mapMatch);
  const maxWinnerRound = winnerMatches.length > 0 ? Math.max(...winnerMatches.map(m => m.round)) : 0;

  // Losers bracket
  const loserMatches = matches.filter(m => m.bracket === 'LOSERS').map(mapMatch);
  const maxLoserRound = loserMatches.length > 0 ? Math.max(...loserMatches.map(m => m.round)) : 0;

  // Grand Final
  const grandFinalMatches = matches.filter(m => m.bracket === 'GRAND_FINAL').map(mapMatch);

  // Round Robin
  const roundRobinMatches = matches.filter(m => m.bracket === 'ROUND_ROBIN').map(mapMatch);

  // Tabla de puntos para Round Robin
  const teamPoints: Record<string, { name: string; tag: string; pts: number; wins: number; losses: number; played: number }> = {};
  roundRobinMatches.forEach(m => {
    if (m.teamA) {
      if (!teamPoints[m.teamA.id]) teamPoints[m.teamA.id] = { name: m.teamA.nombre, tag: m.teamA.tag, pts: 0, wins: 0, losses: 0, played: 0 };
    }
    if (m.teamB) {
      if (!teamPoints[m.teamB.id]) teamPoints[m.teamB.id] = { name: m.teamB.nombre, tag: m.teamB.tag, pts: 0, wins: 0, losses: 0, played: 0 };
    }
    if (m.status === 'finished' && m.teamA && m.teamB) {
      teamPoints[m.teamA.id].played++;
      teamPoints[m.teamB.id].played++;
      if (m.teamA.isWinner) {
        teamPoints[m.teamA.id].pts += 3;
        teamPoints[m.teamA.id].wins++;
        teamPoints[m.teamB.id].losses++;
      } else {
        teamPoints[m.teamB.id].pts += 3;
        teamPoints[m.teamB.id].wins++;
        teamPoints[m.teamA.id].losses++;
      }
    }
  });
  const standings = Object.entries(teamPoints)
    .map(([id, data]) => ({ id, ...data }))
    .sort((a, b) => b.pts - a.pts);

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1A0A10 0%, #2A1520 50%, #1A0A10 100%)' }}>
      <Navbar isLoggedIn={true} userName={userName} role={userRole}/>

      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => router.push('/tournaments/' + id)} sx={{ color: '#C4B0B8', mb: 2 }}>
          Volver al torneo
        </Button>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3, flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
              <AccountTreeIcon sx={{ fontSize: 32, color: '#D4A84B' }} />
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#F5F0F2' }}>Brackets</Typography>
              {tournament && (
                <Chip label={formatoMap[tournament.format] ?? tournament.format} size="small"
                  sx={{ backgroundColor: 'rgba(212, 168, 75, 0.15)', color: '#D4A84B' }} />
              )}
            </Box>
            {tournament && <Typography variant="body2" color="text.secondary">{tournament.title}</Typography>}
          </Box>

          {canManage && !hasBracket && (
            <Button variant="contained" startIcon={<AutoFixHighIcon />} onClick={handleGenerateBracket}
              disabled={generating} sx={{ background: 'linear-gradient(135deg, #7B1E3B, #D4A84B)' }}>
              {generating ? 'Generando...' : 'Generar bracket'}
            </Button>
          )}
        </Box>

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        {!hasBracket ? (
          <Paper elevation={0} sx={{ p: 6, textAlign: 'center', backgroundColor: 'rgba(42, 21, 32, 0.5)', border: '1px solid rgba(123, 30, 59, 0.2)' }}>
            <AccountTreeIcon sx={{ fontSize: 64, color: '#C4B0B8', opacity: 0.5, mb: 2 }} />
            <Typography variant="h6" sx={{ color: '#C4B0B8', mb: 1 }}>El bracket aún no ha sido generado</Typography>
            <Typography variant="body2" color="text.secondary">
              {canManage ? 'Haz click en "Generar bracket" para crear los emparejamientos' : 'El bracket será generado por el staff cuando se cierren las inscripciones'}
            </Typography>
          </Paper>
        ) : isRoundRobin ? (
          /* ─── ROUND ROBIN: Tabla de partidos + standings ─── */
          <Box>
            {/* Tabla de posiciones */}
            <Paper elevation={0} sx={{ p: 3, mb: 3, backgroundColor: 'rgba(42, 21, 32, 0.8)', border: '1px solid rgba(123, 30, 59, 0.3)' }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#D4A84B', mb: 2 }}>
                🏆 Tabla de posiciones
              </Typography>
              <Box sx={{ overflowX: 'auto' }}>
                <Box sx={{ minWidth: 500 }}>
                  {/* Header */}
                  <Box sx={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr', gap: 1, py: 1, px: 2, backgroundColor: 'rgba(26, 10, 16, 0.5)', borderRadius: 1, mb: 1 }}>
                    {['Equipo', 'PJ', 'G', 'P', 'Pts'].map(h => (
                      <Typography key={h} variant="caption" sx={{ color: '#C4B0B8', fontWeight: 700, textAlign: 'center' }}>{h}</Typography>
                    ))}
                  </Box>
                  {standings.map((team, idx) => (
                    <Box key={team.id} sx={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr', gap: 1, py: 1.5, px: 2, mb: 0.5, borderRadius: 1, backgroundColor: idx === 0 ? 'rgba(212, 168, 75, 0.1)' : 'rgba(26, 10, 16, 0.3)', border: idx === 0 ? '1px solid rgba(212, 168, 75, 0.3)' : '1px solid transparent' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {idx === 0 && <EmojiEventsIcon sx={{ fontSize: 16, color: '#D4A84B' }} />}
                        <Typography variant="body2" sx={{ color: '#F5F0F2', fontWeight: idx === 0 ? 700 : 400 }}>
                          [{team.tag}] {team.name}
                        </Typography>
                      </Box>
                      {[team.played, team.wins, team.losses, team.pts].map((val, i) => (
                        <Typography key={i} variant="body2" sx={{ textAlign: 'center', color: i === 3 ? '#D4A84B' : '#F5F0F2', fontWeight: i === 3 ? 700 : 400 }}>{val}</Typography>
                      ))}
                    </Box>
                  ))}
                </Box>
              </Box>
            </Paper>

            {/* Lista de partidos */}
            <Paper elevation={0} sx={{ p: 3, backgroundColor: 'rgba(42, 21, 32, 0.8)', border: '1px solid rgba(123, 30, 59, 0.3)' }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#F5F0F2', mb: 2 }}>Partidos</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {roundRobinMatches.map(m => (
                  <Box key={m.id} onClick={() => router.push('/matches/' + m.id + '/report')}
                    sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2, borderRadius: 2, backgroundColor: 'rgba(26, 10, 16, 0.4)', border: '1px solid rgba(123, 30, 59, 0.2)', cursor: 'pointer', '&:hover': { borderColor: '#D4A84B' } }}>
                    <Typography variant="body2" sx={{ color: '#F5F0F2', flex: 1 }}>
                      [{m.teamA?.tag}] {m.teamA?.nombre}
                    </Typography>
                    <Box sx={{ textAlign: 'center', px: 2 }}>
                      {m.status === 'finished' ? (
                        <Typography variant="body1" sx={{ fontWeight: 800, color: '#F5F0F2' }}>
                          {m.teamA?.score} — {m.teamB?.score}
                        </Typography>
                      ) : (
                        <Chip label="Pendiente" size="small" sx={{ backgroundColor: 'rgba(212, 168, 75, 0.15)', color: '#D4A84B' }} />
                      )}
                    </Box>
                    <Typography variant="body2" sx={{ color: '#F5F0F2', flex: 1, textAlign: 'right' }}>
                      [{m.teamB?.tag}] {m.teamB?.nombre}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Paper>
          </Box>
        ) : isDoubleElim ? (
          /* ─── ELIMINACIÓN DOBLE: Tabs Winners / Losers / Gran Final ─── */
          <Box>
            <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)} sx={{ mb: 3, '& .MuiTab-root': { color: '#C4B0B8' }, '& .Mui-selected': { color: '#D4A84B' }, '& .MuiTabs-indicator': { backgroundColor: '#D4A84B' } }}>
              <Tab label="Winners Bracket" />
              <Tab label="Losers Bracket" />
              <Tab label="Gran Final" />
            </Tabs>

            {activeTab === 0 && (
              <Paper elevation={0} sx={{ p: 3, backgroundColor: 'rgba(42, 21, 32, 0.8)', border: '1px solid rgba(123, 30, 59, 0.3)' }}>
                <BracketView 
                    matches={winnerMatches} 
                    totalRounds={maxWinnerRound}
                    format="Winners Bracket" 
                    onMatchClick={(matchId) => router.push('/matches/' + matchId + '/report')}
                    championLabel="Ganador de Winners"
                  />
              </Paper>
            )}

            {activeTab === 1 && (
              <Paper elevation={0} sx={{ p: 3, backgroundColor: 'rgba(42, 21, 32, 0.8)', border: '1px solid rgba(212, 100, 100, 0.3)' }}>
                <BracketView 
                  matches={loserMatches} 
                  totalRounds={maxLoserRound}
                  format="Losers Bracket" 
                  onMatchClick={(matchId) => router.push('/matches/' + matchId + '/report')}
                  championLabel="Ganador de Losers"
                />
              </Paper>
            )}

            {activeTab === 2 && (
              <Paper elevation={0} sx={{ p: 3, backgroundColor: 'rgba(42, 21, 32, 0.8)', border: '1px solid rgba(212, 168, 75, 0.3)' }}>
                <Typography variant="h6" sx={{ color: '#D4A84B', fontWeight: 700, mb: 3, textAlign: 'center' }}>
                  🏆 Gran Final
                </Typography>
                <BracketView 
                  matches={grandFinalMatches} 
                  totalRounds={1}
                  format="Gran Final" 
                  onMatchClick={(matchId) => router.push('/matches/' + matchId + '/report')}
                  championLabel="🏆 Campeón"
                />
              </Paper>
            )}
          </Box>
        ) : (
          /* ─── ELIMINACIÓN SIMPLE ─── */
          <Paper elevation={0} sx={{ p: 3, backgroundColor: 'rgba(42, 21, 32, 0.8)', border: '1px solid rgba(123, 30, 59, 0.3)' }}>
            <BracketView matches={winnerMatches} totalRounds={maxWinnerRound}
              format={formatoMap[format] ?? format} onMatchClick={(matchId) => router.push('/matches/' + matchId + '/report')} />
          </Paper>
        )}
      </Container>
    </Box>
  );
}