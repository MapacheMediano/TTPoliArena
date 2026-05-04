'use client';
import { useState, useEffect } from 'react';
import { Box, Container, Button, Grid, CircularProgress } from '@mui/material';
import { useRouter } from 'next/navigation';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Navbar from '@/components/Navbar';
import ProfileView, { UserProfile } from '@/components/profile/ProfileView';
import ProfileEditForm from '@/components/profile/ProfileEditForm';
import TournamentHistory from '@/components/profile/TournamentHistory';
import { getMyProfile, getMyTournaments } from '@/lib/api/auth.service';
import { getMyTeams } from '@/lib/api/teams.service';

export default function ProfilePage() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    async function loadProfile() {
      try {
        const [profileRes, tournamentsRes, teamsRes] = await Promise.all([
  getMyProfile(),
  getMyTournaments(),
  getMyTeams(),
]);
        const primaryTeam = teamsRes.ok && teamsRes.teams
      ? teamsRes.teams.find(t => t.captainId === profileRes.user?.id) ?? teamsRes.teams[0]
      : undefined;

        const equipoNombre = primaryTeam?.name ?? 'Sin equipo';
        const equipoTag = primaryTeam?.tag ?? '';
  
        if (!profileRes.ok || !profileRes.user) {
          router.push('/login');
          return;
        }
        setUserRole(profileRes.user.role);
        const u = profileRes.user;

        // Mapea datos del backend al formato que espera ProfileView
        setUserData({
          nombre: u.PlayerProfile?.fullName ?? u.email.split('@')[0],
          nickname: u.PlayerProfile?.gamerTag ?? 'Sin nickname',
          correo: u.email,
          unidadAcademica: u.PlayerProfile?.school ?? '',
          discord: u.PlayerProfile?.discord ?? '',
          rol: u.role,
          equipo: equipoNombre,
  equipoTag: equipoTag,
          juegosFavoritos: [],
          torneosJugados: tournamentsRes.tournaments?.length ?? 0,
          torneosGanados: 0,
          partidasJugadas: 0,
          victorias: 0,
          fechaRegistro: new Date(u.createdAt).toLocaleDateString('es-MX', {
            month: 'long',
            year: 'numeric',
          }),
        });

        // Mapea torneos al historial
        const historial = (tournamentsRes.tournaments ?? []).map((t) => ({
          id: t.id,
          nombre: t.title,
          juego: t.game,
          fecha: new Date(t.startDate).toLocaleDateString('es-MX'),
          posicion: 'Participante',
          equipo: 'Sin equipo',
        }));
        setHistory(historial);

      } catch (error) {
        router.push('/login');
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [router]);

  const handleSave = (updatedData: Partial<UserProfile>) => {
    setUserData((prev) => prev ? { ...prev, ...updatedData } : prev);
    setIsEditing(false);
  };

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

  if (!userData) return null;

  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1A0A10 0%, #2A1520 50%, #1A0A10 100%)',
    }}>
      <Navbar isLoggedIn={true} userName={userData.nombre} role={userRole}/>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => router.push('/dashboard')}
          sx={{ color: '#C4B0B8', mb: 2 }}
        >
          Volver al dashboard
        </Button>

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 7 }}>
            {isEditing ? (
              <ProfileEditForm
                user={userData}
                onSave={handleSave}
                onCancel={() => setIsEditing(false)}
              />
            ) : (
              <ProfileView
                user={userData}
                onEdit={() => setIsEditing(true)}
              />
            )}
          </Grid>

          <Grid size={{ xs: 12, md: 5 }}>
            <TournamentHistory history={history} />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}