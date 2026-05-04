'use client';
import { useEffect, useState } from 'react';
import {
  Box, Container, Typography, Button, Chip,
  Paper, Grid, CircularProgress, Alert, Divider, Avatar,
  TextField, MenuItem,
} from '@mui/material';
import { useRouter, useParams } from 'next/navigation';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import GroupsIcon from '@mui/icons-material/Groups';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import Navbar from '@/components/Navbar';
import { getTournamentById, joinTournament } from '@/lib/api/tournaments.service';
import { getCurrentUser } from '@/lib/api/auth.service';
import { getMyTeams } from '@/lib/api/teams.service';
import type { TournamentDetailResponse, TeamInscribed } from '@/lib/api/tournaments.service';
import type { Team } from '@/lib/api/teams.service';

const statusMap: Record<string, { label: string; color: string }> = {
  OPEN:        { label: 'Abierto',      color: '#4CAF50' },
  IN_PROGRESS: { label: 'En curso',     color: '#D4A84B' },
  FINISHED:    { label: 'Finalizado',   color: '#9E9E9E' },
  UPCOMING:    { label: 'Próximamente', color: '#2196F3' },
};

const formatoMap: Record<string, string> = {
  'eliminacion_simple': 'Eliminación simple',
  'eliminacion_doble': 'Eliminación doble',
  'round_robin': 'Round Robin',
  'grupos': 'Fase de grupos',
};

export default function TournamentDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [tournament, setTournament] = useState<TournamentDetailResponse['tournament'] | null>(null);
  const [isTeamGame, setIsTeamGame] = useState(false);
  const [teamsInscribed, setTeamsInscribed] = useState<TeamInscribed[]>([]);
  const [myTeams, setMyTeams] = useState<Team[]>([]);
  const [selectedTeamId, setSelectedTeamId] = useState('');
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [joinError, setJoinError] = useState('');
  const [joinSuccess, setJoinSuccess] = useState(false);
  const [userId, setUserId] = useState('');
  const [userRole, setUserRole] = useState('');
  const [userName, setUserName] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const [meRes, tournamentRes] = await Promise.all([
          getCurrentUser(),
          getTournamentById(id),
        ]);

        if (!meRes.user) {
          router.push('/login');
          return;
        }

        setUserId(meRes.user.id);
        setUserRole(meRes.user.role);
        setUserName(meRes.user.email.split('@')[0]);

        if (!tournamentRes.ok || !tournamentRes.tournament) {
          router.push('/tournaments');
          return;
        }

        setTournament(tournamentRes.tournament);
        setIsTeamGame(tournamentRes.isTeamGame ?? false);
        setTeamsInscribed(tournamentRes.teamsInscribed ?? []);

        // Si es juego de equipo, carga los equipos del usuario
        if (tournamentRes.isTeamGame) {
          const teamsRes = await getMyTeams();
          if (teamsRes.ok && teamsRes.teams) {
            // Solo equipos donde es capitán y del mismo juego
            const eligibleTeams = teamsRes.teams.filter(
              t => t.captainId === meRes.user!.id &&
              t.game.toLowerCase() === tournamentRes.tournament!.game.toLowerCase()
            );
            setMyTeams(eligibleTeams);
          }
        }
      } catch (error) {
        router.push('/tournaments');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id, router]);

  const handleJoin = async () => {
    setJoining(true);
    setJoinError('');

    // Validación para juegos de equipo
    if (isTeamGame && !selectedTeamId) {
      setJoinError('Debes seleccionar un equipo para inscribirte');
      setJoining(false);
      return;
    }

    try {
      const result = await joinTournament(id, isTeamGame ? selectedTeamId : undefined);
      if (!result.ok) {
        setJoinError(result.error ?? 'Error al inscribirse');
        return;
      }
      setJoinSuccess(true);
      const updated = await getTournamentById(id);
      if (updated.ok && updated.tournament) {
        setTournament(updated.tournament);
        setTeamsInscribed(updated.teamsInscribed ?? []);
      }
    } finally {
      setJoining(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #1A0A10 0%, #2A1520 50%, #1A0A10 100%)' }}>
        <CircularProgress sx={{ color: '#D4A84B' }} />
      </Box>
    );
  }

  if (!tournament) return null;

  const status = statusMap[tournament.status] ?? { label: tournament.status, color: '#9E9E9E' };
  const isAlreadyJoined = tournament.registrations.some(r => r.userId === userId);
  const isFull = tournament.registrations.length >= tournament.maxPlayers;
  const isCaptain = userRole === 'CAPTAIN' || userRole === 'ADMIN';

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1A0A10 0%, #2A1520 50%, #1A0A10 100%)' }}>
      <Navbar isLoggedIn={true} userName={userName} role={userRole}/>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
          <Button startIcon={<ArrowBackIcon />} onClick={() => router.push('/tournaments')} sx={{ color: '#C4B0B8' }}>
            Volver a torneos
          </Button>
          <Button
            variant="outlined"
            startIcon={<AccountTreeIcon />}
            onClick={() => router.push('/tournaments/' + id + '/brackets')}
            sx={{ borderColor: 'rgba(212, 168, 75, 0.5)', color: '#D4A84B', '&:hover': { borderColor: '#D4A84B', backgroundColor: 'rgba(212, 168, 75, 0.1)' } }}
          >
            Ver brackets
          </Button>
        </Box>

        <Grid container spacing={3}>
          {/* Columna principal */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Paper elevation={0} sx={{ p: 4, backgroundColor: 'rgba(42, 21, 32, 0.8)', border: '1px solid rgba(123, 30, 59, 0.3)', mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2, flexWrap: 'wrap', gap: 1 }}>
                <Typography variant="h4" sx={{ fontWeight: 800, color: '#F5F0F2' }}>
                  {tournament.title}
                </Typography>
                <Chip label={status.label} sx={{ backgroundColor: `${status.color}20`, color: status.color, fontWeight: 700, border: `1px solid ${status.color}40` }} />
              </Box>

              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <SportsEsportsIcon sx={{ color: '#D4A84B', fontSize: 18 }} />
                  <Typography variant="body2" sx={{ color: '#D4A84B', fontWeight: 600 }}>{tournament.game}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <CalendarTodayIcon sx={{ color: '#C4B0B8', fontSize: 18 }} />
                  <Typography variant="body2" color="text.secondary">
                    {new Date(tournament.startDate).toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <GroupsIcon sx={{ color: '#C4B0B8', fontSize: 18 }} />
                  <Typography variant="body2" color="text.secondary">
                    {isTeamGame ? teamsInscribed.length : tournament.registrations.length}/{tournament.maxPlayers} inscritos
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <EmojiEventsIcon sx={{ color: '#C4B0B8', fontSize: 18 }} />
                  <Typography variant="body2" color="text.secondary">{formatoMap[tournament.format] ?? tournament.format}</Typography>
                </Box>
              </Box>

              {tournament.description && (
                <>
                  <Divider sx={{ borderColor: 'rgba(123, 30, 59, 0.3)', mb: 2 }} />
                  <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                    {tournament.description}
                  </Typography>
                </>
              )}
            </Paper>

            {/* Lista de inscritos */}
            <Paper elevation={0} sx={{ p: 3, backgroundColor: 'rgba(42, 21, 32, 0.8)', border: '1px solid rgba(123, 30, 59, 0.3)' }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#F5F0F2', mb: 2 }}>
                {isTeamGame ? 'Equipos inscritos' : 'Participantes'} ({isTeamGame ? teamsInscribed.length : tournament.registrations.length})
              </Typography>

              {isTeamGame ? (
                teamsInscribed.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">Aún no hay equipos inscritos.</Typography>
                ) : (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    {teamsInscribed.map((team) => (
                      <Box key={team.id} sx={{ p: 2, borderRadius: 2, backgroundColor: 'rgba(26, 10, 16, 0.4)', border: '1px solid rgba(123, 30, 59, 0.15)' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar sx={{ width: 36, height: 36, background: 'linear-gradient(135deg, #D4A84B, #E0C078)', color: '#1A0A10', fontWeight: 800, fontSize: '0.75rem' }}>
                            {team.tag}
                          </Avatar>
                          <Box sx={{ flexGrow: 1 }}>
                            <Typography variant="body2" sx={{ fontWeight: 700, color: '#F5F0F2' }}>
                              {team.name}
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#D4A84B' }}>
                              Capitán: {team.captain.PlayerProfile?.gamerTag ?? team.captain.email.split('@')[0]}
                            </Typography>
                          </Box>
                          <Chip
                            label={team.members.length + ' miembros'}
                            size="small"
                            sx={{ backgroundColor: 'rgba(123, 30, 59, 0.2)', color: '#C4B0B8', fontSize: '0.7rem' }}
                          />
                        </Box>
                      </Box>
                    ))}
                  </Box>
                )
              ) : (
                tournament.registrations.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">Aún no hay participantes inscritos.</Typography>
                ) : (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    {tournament.registrations.map((reg) => (
                      <Box key={reg.id} sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 1.5, borderRadius: 2, backgroundColor: 'rgba(26, 10, 16, 0.4)' }}>
                        <Avatar sx={{ width: 36, height: 36, background: 'linear-gradient(135deg, #7B1E3B, #D4A84B)', fontSize: '0.85rem', fontWeight: 700 }}>
                          {(reg.user.PlayerProfile?.fullName ?? reg.user.email)[0].toUpperCase()}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: '#F5F0F2' }}>
                            {reg.user.PlayerProfile?.fullName ?? reg.user.email.split('@')[0]}
                          </Typography>
                          {reg.user.PlayerProfile?.gamerTag && (
                            <Typography variant="caption" sx={{ color: '#D4A84B' }}>
                              @{reg.user.PlayerProfile.gamerTag}
                            </Typography>
                          )}
                        </Box>
                      </Box>
                    ))}
                  </Box>
                )
              )}
            </Paper>
          </Grid>

          {/* Columna lateral */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Paper elevation={0} sx={{ p: 3, backgroundColor: 'rgba(42, 21, 32, 0.8)', border: '1px solid rgba(123, 30, 59, 0.3)', position: 'sticky', top: 24 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#F5F0F2', mb: 2 }}>
                Inscripción
              </Typography>

              {joinSuccess || isAlreadyJoined ? (
                <Alert severity="success" sx={{ mb: 2 }}>
                  {joinSuccess ? '¡Te inscribiste exitosamente!' : 'Ya estás inscrito en este torneo'}
                </Alert>
              ) : isFull ? (
                <Alert severity="warning" sx={{ mb: 2 }}>El torneo está lleno</Alert>
              ) : tournament.status !== 'OPEN' ? (
                <Alert severity="info" sx={{ mb: 2 }}>Este torneo no está abierto para inscripciones</Alert>
              ) : null}

              {joinError && <Alert severity="error" sx={{ mb: 2 }}>{joinError}</Alert>}

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 3 }}>
                {[
                  { label: 'Formato', value: formatoMap[tournament.format] ?? tournament.format },
                  { label: 'Cupo', value: (isTeamGame ? teamsInscribed.length : tournament.registrations.length) + '/' + tournament.maxPlayers },
                  { label: 'Estado', value: status.label },
                  { label: 'Inicio', value: new Date(tournament.startDate).toLocaleDateString('es-MX') },
                  ...(tournament.endDate ? [{ label: 'Fin', value: new Date(tournament.endDate).toLocaleDateString('es-MX') }] : []),
                ].map(({ label, value }) => (
                  <Box key={label} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">{label}</Typography>
                    <Typography variant="body2" sx={{ color: '#F5F0F2', fontWeight: 500 }}>{value}</Typography>
                  </Box>
                ))}
              </Box>

              {/* Selector de equipo para juegos de equipo */}
              {isTeamGame && tournament.status === 'OPEN' && !isAlreadyJoined && !joinSuccess && (
                myTeams.length === 0 ? (
                  <Alert severity="warning" sx={{ mb: 2 }}>
                    No tienes equipos de {tournament.game}. Crea uno para poder inscribirte.
                  </Alert>
                ) : (
                  <TextField
                    select
                    fullWidth
                    size="small"
                    label="Selecciona tu equipo"
                    value={selectedTeamId}
                    onChange={(e) => setSelectedTeamId(e.target.value)}
                    sx={{ mb: 2 }}
                    helperText="Solo puedes inscribir equipos donde eres capitán"
                  >
                    {myTeams.map((team) => (
                      <MenuItem key={team.id} value={team.id}>
                        [{team.tag}] {team.name}
                      </MenuItem>
                    ))}
                  </TextField>
                )
              )}

              {/* Mensaje para juegos de equipo sin ser capitán */}
              {isTeamGame && !isCaptain && tournament.status === 'OPEN' && !isAlreadyJoined && (
                <Alert severity="info" sx={{ mb: 2 }}>
                  Solo el capitán de un equipo puede inscribirse a este torneo.
                </Alert>
              )}

              <Button
                fullWidth
                variant="contained"
                size="large"
                startIcon={<HowToRegIcon />}
                onClick={handleJoin}
                disabled={
                  joining || isAlreadyJoined || isFull ||
                  tournament.status !== 'OPEN' || joinSuccess ||
                  (isTeamGame && myTeams.length === 0)
                }
                sx={{ py: 1.5, fontWeight: 700 }}
              >
                {joining ? 'Inscribiendo...' : isAlreadyJoined || joinSuccess ? 'Ya inscrito' : 'Inscribirme'}
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}