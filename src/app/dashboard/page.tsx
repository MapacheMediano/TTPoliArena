'use client';
import { useEffect, useState } from 'react';
import { Box, Container, Typography, Grid, CircularProgress, Alert, Button } from '@mui/material';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import ProfileCard from '@/components/dashboard/ProfileCard';
import MyTournaments from '@/components/dashboard/MyTournaments';
import MyTeam from '@/components/dashboard/MyTeam';
import QuickStats from '@/components/dashboard/QuickStats';
import { getCurrentUser, getMyProfile, getMyTournaments } from '@/lib/api/auth.service';
import type { UserProfile, TournamentFromAPI } from '@/lib/api/types/auth.types';
import { getMyTeams } from '@/lib/api/teams.service';
import { apiClient } from '@/lib/api/client';
import type { Team } from '@/lib/api/teams.service';

const statusMap: Record<string, string> = {
  OPEN: 'Abierto',
  IN_PROGRESS: 'En curso',
  FINISHED: 'Finalizado',
  UPCOMING: 'Próximamente',
};

const formatoMap: Record<string, string> = {
  eliminacion_simple: 'Eliminación simple',
  eliminacion_doble: 'Eliminación doble',
  round_robin: 'Round Robin',
  grupos: 'Fase de grupos',
};

export default function DashboardPage() {
  const router = useRouter();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [tournaments, setTournaments] = useState<TournamentFromAPI[]>([]);
  const [myTeam, setMyTeam] = useState<string>('Sin equipo');
  const [myTeamData, setMyTeamData] = useState<Team | null>(null);
  const [allTeams, setAllTeams] = useState<Team[]>([]);
  const [currentUserId, setCurrentUserId] = useState('');
  const [loading, setLoading] = useState(true);
  const [realStats, setRealStats] = useState({
    torneosActivos: 0,
    partidasJugadas: 0,
    victorias: 0,
    torneosGanados: 0,
    racha: 0,
  });
  const [userRole, setUserRole] = useState('');
  const [userName, setUserName] = useState('');

  useEffect(() => {
    async function loadDashboard() {
      try {
        const me = await getCurrentUser();
        if (!me.user) { router.push('/login'); return; }
        setUserRole(me.user.role);
        setUserName(me.user.email.split('@')[0]);
        setCurrentUserId(me.user.id);

        const [profileRes, tournamentsRes, teamsRes, statsRes] = await Promise.all([
          getMyProfile(),
          getMyTournaments(),
          getMyTeams(),
          apiClient<{ ok: boolean; stats: any }>('/api/me/stats'),
        ]);

        if (statsRes.ok && statsRes.stats) setRealStats(statsRes.stats);
        if (profileRes.ok && profileRes.user) setProfile(profileRes.user);
        if (tournamentsRes.ok && tournamentsRes.tournaments) setTournaments(tournamentsRes.tournaments);
        if (teamsRes.ok && teamsRes.teams) {
          setAllTeams(teamsRes.teams);
          if (teamsRes.teams.length > 0) {
            const primaryTeam = teamsRes.teams.find(t => t.captainId === me.user!.id) ?? teamsRes.teams[0];
            setMyTeam(primaryTeam.name);
            setMyTeamData(primaryTeam);
          }
        }
      } catch (error) {
        console.error('Error cargando dashboard:', error);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, [router]);

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #1A0A10 0%, #2A1520 50%, #1A0A10 100%)' }}>
        <CircularProgress sx={{ color: '#D4A84B' }} />
      </Box>
    );
  }

  const userForCard = {
    nombre: profile?.PlayerProfile?.fullName ?? profile?.email?.split('@')[0] ?? 'Usuario',
    nickname: profile?.PlayerProfile?.gamerTag ?? 'Sin nickname',
    correo: profile?.email ?? '',
    unidadAcademica: profile?.PlayerProfile?.school ?? 'Sin unidad académica',
    rol: profile?.role ?? 'PLAYER',
    torneosJugados: tournaments.length,
    torneosGanados: 0,
    equipo: myTeam,
  };

  const allTournamentsForCard = tournaments.map((t) => ({
    id: t.id,
    nombre: t.title,
    juego: t.game,
    formato: formatoMap[t.format] ?? t.format,
    fechaInicio: new Date(t.startDate).toLocaleDateString('es-MX'),
    estado: statusMap[t.status] ?? t.status,
    equiposInscritos: 0,
    maxEquipos: t.maxPlayers,
    modalidad: 'Online',
    imagenUrl: t.imageUrl ?? null,
  }));

  // Separa torneos activos de finalizados
  const activeTournaments = allTournamentsForCard.filter(t => t.estado !== 'Finalizado');
  const pastTournaments = allTournamentsForCard.filter(t => t.estado === 'Finalizado');

  const mockStats = {
    torneosActivos: realStats.torneosActivos,
    partidasJugadas: realStats.partidasJugadas,
    victorias: realStats.victorias,
    racha: realStats.racha,
  };

  const teamsForCard = allTeams.map(t => ({
    id: t.id,
    nombre: t.name,
    tag: t.tag,
    juego: t.game,
    esCopitan: t.captainId === currentUserId,
    miembros: t.members.map((m: any) => ({
      nombre: m.user.PlayerProfile?.fullName ?? m.user.email.split('@')[0],
      nickname: m.user.PlayerProfile?.gamerTag ?? 'Sin nickname',
      rol: m.userId === t.captainId ? 'Capitán' : 'Miembro',
    })),
  }));

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1A0A10 0%, #2A1520 50%, #1A0A10 100%)' }}>
      <Navbar isLoggedIn={true} userName={userForCard.nombre} role={userRole} />

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#F5F0F2', mb: 0.5 }}>
            ¡Hola, {profile?.PlayerProfile?.gamerTag ?? profile?.PlayerProfile?.fullName ?? profile?.email?.split('@')[0]}! 👋
          </Typography>
          {!profile?.PlayerProfile && (
            <Alert severity="info" sx={{ mb: 3 }}
              action={<Button color="inherit" size="small" onClick={() => router.push('/profile')}>Completar</Button>}>
              Tu perfil está incompleto. Agrega tu nombre y nickname para que otros jugadores te reconozcan.
            </Alert>
          )}
          <Typography variant="body1" color="text.secondary">
            Bienvenido a tu panel de PoliArena
          </Typography>
        </Box>

        <Box sx={{ mb: 4 }}>
          <QuickStats stats={mockStats} />
        </Box>

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <ProfileCard user={userForCard} onEditProfile={() => router.push('/profile')} />
              <MyTeam teams={teamsForCard} onCreateTeam={() => router.push('/teams')} />
            </Box>
          </Grid>

          <Grid size={{ xs: 12, md: 8 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <MyTournaments
                tournaments={activeTournaments}
                onViewAll={() => router.push('/tournaments')}
                onBrowseTournaments={() => router.push('/tournaments')}
              />
              {pastTournaments.length > 0 && (
                <MyTournaments
                  tournaments={pastTournaments}
                  title="Torneos anteriores"
                  onViewAll={() => router.push('/tournaments')}
                  onBrowseTournaments={() => router.push('/tournaments')}
                />
              )}
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}