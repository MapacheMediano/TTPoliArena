// src/app/teams/page.tsx
'use client';
import { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Chip,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import GroupsIcon from '@mui/icons-material/Groups';
import Navbar from '@/components/Navbar';
import TeamCard, { TeamData } from '@/components/teams/TeamCard';
import CreateTeamModal from '@/components/teams/CreateTeamModal';

// ============================================
// DATOS SIMULADOS
// ============================================

const mockTeams: TeamData[] = [
  {
    id: 1,
    nombre: 'ESCOM Elite',
    tag: 'ELT',
    juego: 'Valorant',
    torneosActivos: 2,
    torneosGanados: 3,
    fechaCreacion: '15/03/2025',
    miembros: [
      { id: 1, nombre: 'Kevin Díaz', nickname: 'MapacheMediano', rol: 'Capitán', correo: 'kdiazf2021@alumno.ipn.mx' },
      { id: 2, nombre: 'Itzel Flores', nickname: 'ItzelFP', rol: 'Miembro', correo: 'ifloresp2021@alumno.ipn.mx' },
      { id: 3, nombre: 'Carlos López', nickname: 'CarlosGG', rol: 'Miembro', correo: 'clopezm2021@alumno.ipn.mx' },
      { id: 4, nombre: 'Ana García', nickname: 'AnaPlay', rol: 'Miembro', correo: 'agarciag2021@alumno.ipn.mx' },
      { id: 5, nombre: 'Miguel Torres', nickname: 'MiguelPro', rol: 'Miembro', correo: 'mtorresr2021@alumno.ipn.mx' },
    ],
  },
  {
    id: 2,
    nombre: 'Poli Gamers',
    tag: 'PLG',
    juego: 'Rocket League',
    torneosActivos: 1,
    torneosGanados: 1,
    fechaCreacion: '20/06/2025',
    miembros: [
      { id: 1, nombre: 'Kevin Díaz', nickname: 'MapacheMediano', rol: 'Capitán', correo: 'kdiazf2021@alumno.ipn.mx' },
      { id: 6, nombre: 'Roberto Sánchez', nickname: 'RobertoRL', rol: 'Miembro', correo: 'rsanchezl2021@alumno.ipn.mx' },
      { id: 7, nombre: 'Laura Mendoza', nickname: 'LauraMZ', rol: 'Miembro', correo: 'lmendozaa2021@alumno.ipn.mx' },
    ],
  },
];

// ============================================

export default function TeamsPage() {
  const router = useRouter();
  const [createModalOpen, setCreateModalOpen] = useState(false);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1A0A10 0%, #2A1520 50%, #1A0A10 100%)',
      }}
    >
      <Navbar isLoggedIn={true} userName="Kevin Díaz" />

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => router.push('/dashboard')}
          sx={{ color: '#C4B0B8', mb: 2 }}
        >
          Volver al dashboard
        </Button>

        {/* Encabezado */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            mb: 4,
            flexWrap: 'wrap',
            gap: 2,
          }}
        >
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
              <GroupsIcon sx={{ fontSize: 32, color: '#D4A84B' }} />
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#F5F0F2' }}>
                Mis Equipos
              </Typography>
              <Chip
                label={`${mockTeams.length} equipos`}
                size="small"
                sx={{
                  backgroundColor: 'rgba(212, 168, 75, 0.15)',
                  color: '#D4A84B',
                  fontWeight: 600,
                }}
              />
            </Box>
            <Typography variant="body2" color="text.secondary">
              Gestiona tus equipos, invita integrantes y participa en torneos
            </Typography>
          </Box>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setCreateModalOpen(true)}
          >
            Crear equipo
          </Button>
        </Box>

        {/* Grid de equipos */}
        <Grid container spacing={3}>
          {mockTeams.map((team) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={team.id}>
              <TeamCard
                team={team}
                onClick={() => router.push(`/teams/${team.id}`)}
              />
            </Grid>
          ))}
        </Grid>
      </Container>

      <CreateTeamModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onCreated={(team) => {
          console.log('Nuevo equipo:', team);
        }}
      />
    </Box>
  );
}