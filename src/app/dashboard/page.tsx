'use client';
import { useEffect, useState } from 'react';
import { Box, Container, Typography, Grid, CircularProgress } from '@mui/material';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import ProfileCard from '@/components/dashboard/ProfileCard';
import MyTournaments from '@/components/dashboard/MyTournaments';
import MyTeam from '@/components/dashboard/MyTeam';
import QuickStats from '@/components/dashboard/QuickStats';
import { getCurrentUser, getMyProfile, getMyTournaments } from '@/lib/api/auth.service';
import type { UserProfile, TournamentFromAPI } from '@/lib/api/types/auth.types';
import { getMyTeams } from '@/lib/api/teams.service';
import type { Team } from '@/lib/api/teams.service';

export default function DashboardPage() {
  const router = useRouter();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [tournaments, setTournaments] = useState<TournamentFromAPI[]>([]);
  const [myTeam, setMyTeam] = useState<string>('Sin equipo');
  const [myTeamData, setMyTeamData] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const me = await getCurrentUser();
        if (!me.user) {
          router.push('/login');
          return;
        }

        const [profileRes, tournamentsRes, teamsRes] = await Promise.all([
          getMyProfile(),
          getMyTournaments(),
          getMyTeams(),
        ]);

        if (profileRes.ok && profileRes.user) {
          setProfile(profileRes.user);
        }

        if (tournamentsRes.ok && tournamentsRes.tournaments) {
          setTournaments(tournamentsRes.tournaments);
        }

        if (teamsRes.ok && teamsRes.teams && teamsRes.teams.length > 0) {
        const primaryTeam = teamsRes.teams.find(t => t.captainId === me.user!.id)
          ?? teamsRes.teams[0];
        setMyTeam(primaryTeam.name);
        setMyTeamData(primaryTeam);
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
      <Box sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #1A0A10 0%, #2A1520 50%, #1A0A10 100%)',
      }}>
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

  const tournamentsForCard = tournaments.map((t) => ({
    id: t.id,
    nombre: t.title,
    juego: t.game,
    formato: t.format,
    fechaInicio: new Date(t.startDate).toLocaleDateString('es-MX'),
    estado: t.status,
    equiposInscritos: 0,
    maxEquipos: t.maxPlayers,
    modalidad: 'Online',
  }));

  const mockStats = {
    torneosActivos: tournaments.filter(t => t.status === 'OPEN').length,
    partidasJugadas: 0,
    victorias: 0,
    racha: 0,
  };

  // Mapea el equipo al formato que espera MyTeam
  const teamForCard = myTeamData ? {
    nombre: myTeamData.name,
    tag: myTeamData.tag,
    juego: myTeamData.game,
    miembros: myTeamData.members.map((m) => ({
      nombre: m.user.PlayerProfile?.fullName ?? m.user.email.split('@')[0],
      nickname: m.user.PlayerProfile?.gamerTag ?? 'Sin nickname',
      rol: m.userId === myTeamData.captainId ? 'Capitán' : 'Miembro',
    })),
  } : null;

  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1A0A10 0%, #2A1520 50%, #1A0A10 100%)',
    }}>
      <Navbar isLoggedIn={true} userName={userForCard.nombre} />

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#F5F0F2', mb: 0.5 }}>
            ¡Hola, {userForCard.nombre.split(' ')[0]}! 👋
          </Typography>
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
              <ProfileCard
                user={userForCard}
                onEditProfile={() => router.push('/profile')}
              />
              <MyTeam
                team={teamForCard}
                onManageTeam={() => router.push('/teams')}
                onCreateTeam={() => router.push('/teams')}
              />
            </Box>
          </Grid>

          <Grid size={{ xs: 12, md: 8 }}>
            <MyTournaments
              tournaments={tournamentsForCard}
              onViewAll={() => router.push('/tournaments')}
              onBrowseTournaments={() => router.push('/tournaments')}
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}