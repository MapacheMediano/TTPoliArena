'use client';
import { useState, useEffect } from 'react';
import {
  Box, Container, Typography, Button,
  Grid, Chip, CircularProgress, Paper,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import GroupsIcon from '@mui/icons-material/Groups';
import Navbar from '@/components/Navbar';
import TeamCard, { TeamData } from '@/components/teams/TeamCard';
import CreateTeamModal from '@/components/teams/CreateTeamModal';
import { getMyTeams, createTeam } from '@/lib/api/teams.service';
import { getCurrentUser } from '@/lib/api/auth.service';
import type { Team } from '@/lib/api/teams.service';

function mapTeam(t: Team, currentUserId: string): TeamData {
  return {
    id: t.id,
    nombre: t.name,
    tag: t.tag,
    juego: t.game,
    torneosActivos: 0,
    torneosGanados: 0,
    fechaCreacion: new Date(t.createdAt).toLocaleDateString('es-MX'),
    miembros: t.members.map((m) => ({
      id: m.id,
      nombre: m.user.PlayerProfile?.fullName ?? m.user.email.split('@')[0],
      nickname: m.user.PlayerProfile?.gamerTag ?? 'Sin nickname',
      rol: (m.userId === t.captainId ? 'Capitán' : 'Miembro') as 'Capitán' | 'Miembro',
      correo: m.user.email,
    })),
  };
}

export default function TeamsPage() {
  const router = useRouter();
  const [teams, setTeams] = useState<TeamData[]>([]);
  const [rawTeams, setRawTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [userName, setUserName] = useState('');
  const [userId, setUserId] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const meRes = await getCurrentUser();
        if (!meRes.user) {
          router.push('/login');
          return;
        }
        setUserName(meRes.user.email.split('@')[0]);
        setUserId(meRes.user.id);

        const teamsRes = await getMyTeams();
        if (teamsRes.ok && teamsRes.teams) {
          setRawTeams(teamsRes.teams);
          setTeams(teamsRes.teams.map((t) => mapTeam(t, meRes.user!.id)));
        }
      } catch (error) {
        console.error('Error cargando equipos:', error);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [router]);

  const handleCreated = async (newTeam: { nombre: string; tag: string; juego: string }) => {
    const result = await createTeam({
      name: newTeam.nombre,
      tag: newTeam.tag,
      game: newTeam.juego,
    });

    if (result.ok && result.team) {
      setRawTeams((prev) => [result.team!, ...prev]);
      setTeams((prev) => [mapTeam(result.team!, userId), ...prev]);
      setCreateModalOpen(false);
    } else {
      alert(result.error ?? 'Error al crear equipo');
    }
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

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1A0A10 0%, #2A1520 50%, #1A0A10 100%)' }}>
      <Navbar isLoggedIn={true} userName={userName} />

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => router.push('/dashboard')}
          sx={{ color: '#C4B0B8', mb: 2 }}
        >
          Volver al dashboard
        </Button>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4, flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
              <GroupsIcon sx={{ fontSize: 32, color: '#D4A84B' }} />
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#F5F0F2' }}>
                Mis Equipos
              </Typography>
              <Chip
                label={teams.length + ' equipos'}
                size="small"
                sx={{ backgroundColor: 'rgba(212, 168, 75, 0.15)', color: '#D4A84B', fontWeight: 600 }}
              />
            </Box>
            <Typography variant="body2" color="text.secondary">
              Gestiona tus equipos, invita integrantes y participa en torneos
            </Typography>
          </Box>

          <Button variant="contained" startIcon={<AddIcon />} onClick={() => setCreateModalOpen(true)}>
            Crear equipo
          </Button>
        </Box>

        {teams.length === 0 ? (
          <Paper elevation={0} sx={{ p: 6, textAlign: 'center', backgroundColor: 'rgba(42, 21, 32, 0.5)', border: '1px solid rgba(123, 30, 59, 0.2)' }}>
            <GroupsIcon sx={{ fontSize: 64, color: '#C4B0B8', opacity: 0.5, mb: 2 }} />
            <Typography variant="h6" sx={{ color: '#C4B0B8', mb: 1 }}>
              Aun no tienes equipos
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Crea un equipo para participar en torneos
            </Typography>
            <Button variant="contained" startIcon={<AddIcon />} onClick={() => setCreateModalOpen(true)}>
              Crear mi primer equipo
            </Button>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {teams.map((team) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={team.id}>
                <TeamCard
                  team={team}
                  onClick={() => router.push('/teams/' + team.id)}
                />
              </Grid>
            ))}
          </Grid>
        )}
      </Container>

      <CreateTeamModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onCreated={handleCreated}
      />
    </Box>
  );
}