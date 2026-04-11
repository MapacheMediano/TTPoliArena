// src/app/profile/page.tsx
'use client';
import { useState } from 'react';
import { Box, Container, Button, Grid } from '@mui/material';
import { useRouter } from 'next/navigation';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Navbar from '@/components/Navbar';
import ProfileView, { UserProfile } from '@/components/profile/ProfileView';
import ProfileEditForm from '@/components/profile/ProfileEditForm';
import TournamentHistory from '@/components/profile/TournamentHistory';

// ============================================
// DATOS SIMULADOS (mock data)
// Cuando el backend esté listo, vendrán de
// GET /api/users/profile
// ============================================

const mockUser: UserProfile = {
  nombre: 'Kevin Joel Díaz Franco',
  nickname: 'MapacheMediano',
  correo: 'kdiazf2021@alumno.ipn.mx',
  unidadAcademica: 'ESCOM - Escuela Superior de Cómputo',
  rol: 'Jugador',
  equipo: 'ESCOM Elite',
  equipoTag: 'ELT',
  juegosFavoritos: ['Valorant', 'League of Legends', 'Rocket League'],
  torneosJugados: 5,
  torneosGanados: 2,
  partidasJugadas: 18,
  victorias: 12,
  fechaRegistro: 'Noviembre 2024',
};

const mockHistory = [
  {
    id: 1,
    nombre: 'Interpolitécnicos 2025 - Valorant',
    juego: 'Valorant',
    fecha: '18/11/2025',
    posicion: '1er lugar',
    equipo: 'ESCOM Elite',
  },
  {
    id: 2,
    nombre: 'Copa ESCOM - League of Legends',
    juego: 'League of Legends',
    fecha: '10/10/2025',
    posicion: '3er lugar',
    equipo: 'ESCOM Elite',
  },
  {
    id: 3,
    nombre: 'Torneo de Pretemporada - Valorant',
    juego: 'Valorant',
    fecha: '15/09/2025',
    posicion: '1er lugar',
    equipo: 'ESCOM Elite',
  },
  {
    id: 4,
    nombre: 'Copa Bienvenida - Rocket League',
    juego: 'Rocket League',
    fecha: '01/08/2025',
    posicion: '2do lugar',
    equipo: 'Poli Gamers',
  },
  {
    id: 5,
    nombre: 'Liga Interna ESCOM - LoL',
    juego: 'League of Legends',
    fecha: '15/06/2025',
    posicion: 'Top 8',
    equipo: 'ESCOM Elite',
  },
];

// ============================================

export default function ProfilePage() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState<UserProfile>(mockUser);

  const handleSave = (updatedData: Partial<UserProfile>) => {
    setUserData((prev) => ({ ...prev, ...updatedData }));
    setIsEditing(false);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background:
          'linear-gradient(135deg, #1A0A10 0%, #2A1520 50%, #1A0A10 100%)',
      }}
    >
      <Navbar isLoggedIn={true} userName={userData.nombre} />

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Botón volver */}
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => router.push('/dashboard')}
          sx={{ color: '#C4B0B8', mb: 2 }}
        >
          Volver al dashboard
        </Button>

        <Grid container spacing={3}>
          {/* Columna principal: Perfil */}
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

          {/* Columna lateral: Historial */}
          <Grid size={{ xs: 12, md: 5 }}>
            <TournamentHistory history={mockHistory} />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}