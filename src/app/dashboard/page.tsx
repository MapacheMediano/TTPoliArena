// src/app/dashboard/page.tsx
'use client';
import { Box, Container, Typography, Grid } from '@mui/material';
import Navbar from '@/components/Navbar';
import ProfileCard from '@/components/dashboard/ProfileCard';
import MyTournaments from '@/components/dashboard/MyTournaments';
import MyTeam from '@/components/dashboard/MyTeam';
import QuickStats from '@/components/dashboard/QuickStats';
import { TournamentData } from '@/components/TournamentCard';
import { useRouter } from 'next/navigation';

// ============================================
// DATOS SIMULADOS (mock data)
// Cuando el backend esté listo, estos datos
// vendrán de una llamada a la API
// ============================================

const mockUser = {
  nombre: 'Kevin Joel Díaz Franco',
  nickname: 'MapacheMediano',
  correo: 'kdiazf2021@alumno.ipn.mx',
  unidadAcademica: 'ESCOM - Escuela Superior de Cómputo',
  rol: 'Jugador',
  torneosJugados: 5,
  torneosGanados: 2,
  equipo: 'ESCOM Elite',
};

const mockStats = {
  torneosActivos: 2,
  partidasJugadas: 18,
  victorias: 12,
  racha: 4,
};

const mockTournaments: TournamentData[] = [
  {
    id: 1,
    nombre: 'Interpolitécnicos 2025 - Valorant',
    juego: 'Valorant',
    formato: 'Eliminación simple',
    fechaInicio: '18/11/2025',
    estado: 'En curso',
    equiposInscritos: 16,
    maxEquipos: 16,
    modalidad: 'Online / Final Presencial',
  },
  {
    id: 2,
    nombre: 'Copa ESCOM - League of Legends',
    juego: 'League of Legends',
    formato: 'Eliminación doble',
    fechaInicio: '25/11/2025',
    estado: 'Abierto',
    equiposInscritos: 8,
    maxEquipos: 16,
    modalidad: 'Online',
  },
  {
    id: 3,
    nombre: 'Torneo Relámpago - Rocket League',
    juego: 'Rocket League',
    formato: 'Round Robin',
    fechaInicio: '01/12/2025',
    estado: 'Próximamente',
    equiposInscritos: 3,
    maxEquipos: 8,
    modalidad: 'Online',
  },
];

const mockTeam = {
  nombre: 'ESCOM Elite',
  tag: 'ELT',
  juego: 'Valorant',
  miembros: [
    { nombre: 'Kevin Díaz', nickname: 'MapacheMediano', rol: 'Capitán' },
    { nombre: 'Itzel Flores', nickname: 'ItzelFP', rol: 'Miembro' },
    { nombre: 'Carlos López', nickname: 'CarlosGG', rol: 'Miembro' },
    { nombre: 'Ana García', nickname: 'AnaPlay', rol: 'Miembro' },
    { nombre: 'Miguel Torres', nickname: 'MiguelPro', rol: 'Miembro' },
  ],
};

// ============================================

export default function DashboardPage() {
  const router = useRouter();
  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1A0A10 0%, #2A1520 50%, #1A0A10 100%)',
      }}
    >
      {/* Navbar con sesión iniciada */}
      <Navbar isLoggedIn={true} userName={mockUser.nombre} />

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Saludo */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
              color: '#F5F0F2',
              mb: 0.5,
            }}
          >
            ¡Hola, {mockUser.nombre.split(' ')[0]}! 👋
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Bienvenido a tu panel de PoliArena
          </Typography>
        </Box>

        {/* Estadísticas rápidas */}
        <Box sx={{ mb: 4 }}>
          <QuickStats stats={mockStats} />
        </Box>

        {/* Layout principal: Perfil + Equipo | Torneos */}
        <Grid container spacing={3}>
          {/* Columna izquierda: Perfil y Equipo */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <ProfileCard
                user={mockUser}
                onEditProfile={() => console.log('Editar perfil')}
              />
              <MyTeam
                team={mockTeam}
                onManageTeam={() => router.push('/teams/1')}
                onCreateTeam={() => router.push('/teams')}
              />
            </Box>
          </Grid>

          {/* Columna derecha: Mis Torneos */}
          <Grid size={{ xs: 12, md: 8 }}>
            <MyTournaments
              tournaments={mockTournaments}
              onViewAll={() => console.log('Ver todos los torneos')}
              onBrowseTournaments={() => console.log('Explorar torneos')}
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}