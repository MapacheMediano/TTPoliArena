// src/app/admin/page.tsx
'use client';
import { useState, useMemo } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  Grid,
  Snackbar,
  Alert,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import PeopleIcon from '@mui/icons-material/People';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import Navbar from '@/components/Navbar';
import AdminStats from '@/components/admin/AdminStats';
import UserTable from '@/components/admin/UserTable';
import EditRoleModal from '@/components/admin/EditRoleModal';
import { UserData } from '@/components/admin/EditRoleModal';

// ============================================
// DATOS SIMULADOS
// ============================================

const mockUsers: UserData[] = [
  { id: 1, nombre: 'Kevin Joel Díaz Franco', nickname: 'MapacheMediano', correo: 'kdiazf2021@alumno.ipn.mx', unidadAcademica: 'ESCOM', rol: 'Administrador', estado: 'Activo', fechaRegistro: '15/03/2024', torneosJugados: 5 },
  { id: 2, nombre: 'Itzel Flores Patiño', nickname: 'ItzelFP', correo: 'ifloresp2021@alumno.ipn.mx', unidadAcademica: 'ESCOM', rol: 'Organizador', estado: 'Activo', fechaRegistro: '15/03/2024', torneosJugados: 3 },
  { id: 3, nombre: 'Carlos López Mendoza', nickname: 'CarlosGG', correo: 'clopezm2021@alumno.ipn.mx', unidadAcademica: 'ESCOM', rol: 'Capitán', estado: 'Activo', fechaRegistro: '20/04/2024', torneosJugados: 7 },
  { id: 4, nombre: 'Ana García González', nickname: 'AnaPlay', correo: 'agarciag2021@alumno.ipn.mx', unidadAcademica: 'ESIME', rol: 'Jugador', estado: 'Activo', fechaRegistro: '01/05/2024', torneosJugados: 2 },
  { id: 5, nombre: 'Miguel Torres Ramírez', nickname: 'MiguelPro', correo: 'mtorresr2021@alumno.ipn.mx', unidadAcademica: 'ESCOM', rol: 'Jugador', estado: 'Activo', fechaRegistro: '10/05/2024', torneosJugados: 4 },
  { id: 6, nombre: 'Roberto Sánchez Luna', nickname: 'RobertoRL', correo: 'rsanchezl2021@alumno.ipn.mx', unidadAcademica: 'UPIICSA', rol: 'Capitán', estado: 'Activo', fechaRegistro: '15/06/2024', torneosJugados: 6 },
  { id: 7, nombre: 'Laura Mendoza Arias', nickname: 'LauraMZ', correo: 'lmendozaa2021@alumno.ipn.mx', unidadAcademica: 'UPIICSA', rol: 'Jugador', estado: 'Suspendido', fechaRegistro: '20/06/2024', torneosJugados: 1 },
  { id: 8, nombre: 'Fernando Díaz Pérez', nickname: 'FerDiaz', correo: 'fdiazp2021@alumno.ipn.mx', unidadAcademica: 'ESIME', rol: 'Organizador', estado: 'Activo', fechaRegistro: '01/07/2024', torneosJugados: 0 },
  { id: 9, nombre: 'Patricia Ruiz Ortega', nickname: 'PatyRuiz', correo: 'pruizo2021@alumno.ipn.mx', unidadAcademica: 'ESIA', rol: 'Jugador', estado: 'Activo', fechaRegistro: '15/08/2024', torneosJugados: 3 },
  { id: 10, nombre: 'Diego Herrera Castro', nickname: 'DiegoPro', correo: 'dherrerac2021@alumno.ipn.mx', unidadAcademica: 'ENCB', rol: 'Jugador', estado: 'Inactivo', fechaRegistro: '01/09/2024', torneosJugados: 0 },
  { id: 11, nombre: 'María Jiménez López', nickname: 'MariaJL', correo: 'mjimenezl2021@alumno.ipn.mx', unidadAcademica: 'ESFM', rol: 'Capitán', estado: 'Activo', fechaRegistro: '10/09/2024', torneosJugados: 8 },
  { id: 12, nombre: 'Jorge Castillo Nava', nickname: 'JorgeCN', correo: 'jcastillon2021@alumno.ipn.mx', unidadAcademica: 'UPIITA', rol: 'Jugador', estado: 'Activo', fechaRegistro: '20/09/2024', torneosJugados: 2 },
];

const mockStats = {
  totalUsuarios: 300,
  totalTorneos: 12,
  torneosActivos: 4,
  totalEquipos: 45,
  staffCount: 8,
  resultadosPendientes: 3,
};

// ============================================

export default function AdminPage() {
  const router = useRouter();
  const [users, setUsers] = useState(mockUsers);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('Todos');
  const [editUser, setEditUser] = useState<UserData | null>(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  // Filtrar usuarios
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch =
        !searchQuery ||
        u.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.nickname.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.correo.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesRole = filterRole === 'Todos' || u.rol === filterRole;

      return matchesSearch && matchesRole;
    });
  }, [users, searchQuery, filterRole]);

  // Cambiar rol
  const handleRoleChange = (userId: number, newRole: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, rol: newRole } : u))
    );
    const user = users.find((u) => u.id === userId);
    setSnackbar({
      open: true,
      message: `Rol de ${user?.nombre} cambiado a ${newRole}`,
      severity: 'success',
    });
  };

  // Suspender / Activar usuario
  const handleToggleStatus = (userId: number) => {
    const user = users.find((u) => u.id === userId);
    if (!user) return;

    const newStatus = user.estado === 'Activo' ? 'Suspendido' : 'Activo';

    if (user.rol === 'Administrador') {
      setSnackbar({
        open: true,
        message: 'No puedes suspender a un administrador',
        severity: 'error',
      });
      return;
    }

    if (confirm(`¿Estás seguro de ${newStatus === 'Suspendido' ? 'suspender' : 'activar'} a ${user.nombre}?`)) {
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, estado: newStatus } : u))
      );
      setSnackbar({
        open: true,
        message: `${user.nombre} fue ${newStatus === 'Suspendido' ? 'suspendido' : 'activado'}`,
        severity: 'success',
      });
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1A0A10 0%, #2A1520 50%, #1A0A10 100%)',
      }}
    >
      <Navbar isLoggedIn={true} userName="Kevin Díaz" />

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Encabezado */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
            <AdminPanelSettingsIcon sx={{ fontSize: 32, color: '#D4A84B' }} />
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#F5F0F2' }}>
              Panel de Administración
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">
            Gestiona usuarios, roles y configuración del sistema
          </Typography>
        </Box>

        {/* Stats */}
        <Box sx={{ mb: 4 }}>
          <AdminStats stats={mockStats} />
        </Box>

        {/* Accesos rápidos */}
        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Paper
              elevation={0}
              onClick={() => router.push('/matches/validate')}
              sx={{
                p: 2.5,
                backgroundColor: 'rgba(42, 21, 32, 0.8)',
                border: '1px solid rgba(123, 30, 59, 0.3)',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                '&:hover': {
                  border: '1px solid #FF6B6B40',
                  transform: 'translateY(-2px)',
                },
              }}
            >
              <FactCheckIcon sx={{ fontSize: 28, color: '#FF6B6B' }} />
              <Box>
                <Typography variant="body1" sx={{ color: '#F5F0F2', fontWeight: 600 }}>
                  Validar resultados
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {mockStats.resultadosPendientes} pendientes
                </Typography>
              </Box>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Paper
              elevation={0}
              onClick={() => router.push('/tournaments/create')}
              sx={{
                p: 2.5,
                backgroundColor: 'rgba(42, 21, 32, 0.8)',
                border: '1px solid rgba(123, 30, 59, 0.3)',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                '&:hover': {
                  border: '1px solid #4CAF5040',
                  transform: 'translateY(-2px)',
                },
              }}
            >
              <EmojiEventsIcon sx={{ fontSize: 28, color: '#4CAF50' }} />
              <Box>
                <Typography variant="body1" sx={{ color: '#F5F0F2', fontWeight: 600 }}>
                  Crear torneo
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Nuevo torneo
                </Typography>
              </Box>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Paper
              elevation={0}
              onClick={() => router.push('/tournaments')}
              sx={{
                p: 2.5,
                backgroundColor: 'rgba(42, 21, 32, 0.8)',
                border: '1px solid rgba(123, 30, 59, 0.3)',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                '&:hover': {
                  border: '1px solid #D4A84B40',
                  transform: 'translateY(-2px)',
                },
              }}
            >
              <PeopleIcon sx={{ fontSize: 28, color: '#D4A84B' }} />
              <Box>
                <Typography variant="body1" sx={{ color: '#F5F0F2', fontWeight: 600 }}>
                  Ver torneos
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {mockStats.totalTorneos} torneos
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>

        {/* Tabla de usuarios */}
        <Paper
          elevation={0}
          sx={{
            p: 3,
            backgroundColor: 'rgba(42, 21, 32, 0.8)',
            border: '1px solid rgba(123, 30, 59, 0.3)',
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#F5F0F2', mb: 3 }}>
            Gestión de usuarios
          </Typography>
          <UserTable
            users={filteredUsers}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            filterRole={filterRole}
            onFilterRoleChange={setFilterRole}
            onEditRole={(user) => setEditUser(user)}
            onToggleStatus={handleToggleStatus}
          />
        </Paper>
      </Container>

      {/* Modal editar rol */}
      <EditRoleModal
        open={!!editUser}
        onClose={() => setEditUser(null)}
        user={editUser}
        onSave={handleRoleChange}
      />

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}