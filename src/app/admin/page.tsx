'use client';
import { useState, useMemo, useEffect } from 'react';
import {
  Box, Container, Typography, Paper,
  Grid, Snackbar, Alert, CircularProgress,
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
import type { UserData } from '@/components/admin/EditRoleModal';
import { getAdminUsers, updateUserRole, toggleUserStatus } from '@/lib/api/admin.service';
import { getCurrentUser } from '@/lib/api/auth.service';
import type { AdminUser } from '@/lib/api/admin.service';
import type { UserRole } from '@/lib/api/types/auth.types';
import { getAllTournaments } from '@/lib/api/tournaments.service';
import { getMyTeams } from '@/lib/api/teams.service';


// Mapea AdminUser del backend al formato que espera UserTable
function mapUser(u: AdminUser): UserData {
  return {
    id: u.id,
    nombre: u.PlayerProfile?.fullName ?? u.email.split('@')[0],
    nickname: u.PlayerProfile?.gamerTag ?? 'Sin nickname',
    correo: u.email,
    unidadAcademica: u.PlayerProfile?.school ?? 'Sin unidad',
    rol: u.role,
    estado: u.isActive ? 'Activo' : 'Suspendido',
    fechaRegistro: new Date(u.createdAt).toLocaleDateString('es-MX'),
    torneosJugados: u._count.tournamentRegistrations,
  };
}

export default function AdminPage() {
  const router = useRouter();
  const [users, setUsers] = useState<UserData[]>([]);
  const [userRole, setUserRole] = useState('');
  const [rawUsers, setRawUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('Todos');
  const [editUser, setEditUser] = useState<UserData | null>(null);
  const [userName, setUserName] = useState('');
  const [stats, setStats] = useState({
    totalUsuarios: 0,
    totalTorneos: 0,
    torneosActivos: 0,
    totalEquipos: 0,
    staffCount: 0,
    resultadosPendientes: 0,
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  useEffect(() => {
    async function load() {
      try {
        const meRes = await getCurrentUser();
        if (!meRes.user) {
          router.push('/login');
          
          return;
        }

        if (meRes.user.role !== 'ADMIN') {
          router.push('/dashboard');
          return;
        }
        setUserRole(meRes.user.role);

        setUserName(meRes.user.email.split('@')[0]);

        const [usersRes, tournamentsRes, teamsRes] = await Promise.all([
          getAdminUsers(),
          getAllTournaments(),
          getMyTeams(),
        ]);
        if (usersRes.ok && usersRes.users) {
          setRawUsers(usersRes.users);
          setUsers(usersRes.users.map(mapUser));
          setStats({
          totalUsuarios: usersRes.users.length,
          totalTorneos: tournamentsRes.tournaments?.length ?? 0,
          torneosActivos: tournamentsRes.tournaments?.filter(
            t => t.status === 'IN_PROGRESS' || t.status === 'OPEN'
          ).length ?? 0,
          totalEquipos: (usersRes as any).totalEquipos ?? 0,
          staffCount: usersRes.users.filter(u => u.role === 'STAFF' || u.role === 'ADMIN').length,
          resultadosPendientes: (usersRes as any).pendingMatches ?? 0,
        });
        }
      } catch (error) {
        console.error('Error cargando admin:', error);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [router]);

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch = !searchQuery ||
        u.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.nickname.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.correo.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRole = filterRole === 'Todos' || u.rol === filterRole;
      return matchesSearch && matchesRole;
    });
  }, [users, searchQuery, filterRole]);

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    const result = await updateUserRole(userId, newRole);
    if (result.ok) {
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, rol: newRole } : u));
      const user = users.find(u => u.id === userId);
      setSnackbar({ open: true, message: 'Rol de ' + user?.nombre + ' cambiado a ' + newRole, severity: 'success' });
    } else {
      setSnackbar({ open: true, message: result.error ?? 'Error al cambiar rol', severity: 'error' });
    }
  };

  const handleToggleStatus = async (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (!user) return;

    if (user.rol === 'ADMIN') {
      setSnackbar({ open: true, message: 'No puedes suspender a un administrador', severity: 'error' });
      return;
    }

    const newIsActive = user.estado === 'Activo' ? false : true;
    const result = await toggleUserStatus(userId, newIsActive);

    if (result.ok) {
      setUsers(prev => prev.map(u => u.id === userId
        ? { ...u, estado: newIsActive ? 'Activo' : 'Suspendido' }
        : u
      ));
      setSnackbar({
        open: true,
        message: user.nombre + ' fue ' + (newIsActive ? 'activado' : 'suspendido'),
        severity: 'success',
      });
    } else {
      setSnackbar({ open: true, message: result.error ?? 'Error al cambiar estado', severity: 'error' });
    }
  };

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #1A0A10 0%, #2A1520 50%, #1A0A10 100%)' }}>
        <CircularProgress sx={{ color: '#D4A84B' }} />
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1A0A10 0%, #2A1520 50%, #1A0A10 100%)' }}>
      <Navbar isLoggedIn={true} userName={userName} role={userRole} />

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
            <AdminPanelSettingsIcon sx={{ fontSize: 32, color: '#D4A84B' }} />
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#F5F0F2' }}>
              Panel de Administracion
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">
            Gestiona usuarios, roles y configuracion del sistema
          </Typography>
        </Box>

        <Box sx={{ mb: 4 }}>
          <AdminStats stats={stats} />
        </Box>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Paper elevation={0} onClick={() => router.push('/matches/validate')}
            sx={{ p: 2.5, backgroundColor: 'rgba(42, 21, 32, 0.8)', border: '1px solid rgba(123, 30, 59, 0.3)', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: 2, '&:hover': { border: '1px solid #FF6B6B40', transform: 'translateY(-2px)' } }}>
            <FactCheckIcon sx={{ fontSize: 28, color: '#FF6B6B' }} />
            <Box>
              <Typography variant="body1" sx={{ color: '#F5F0F2', fontWeight: 600 }}>Validar resultados</Typography>
              <Typography variant="caption" color="text.secondary">{stats.resultadosPendientes} pendientes</Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Paper elevation={0} onClick={() => router.push('/tournaments/create')}
              sx={{ p: 2.5, backgroundColor: 'rgba(42, 21, 32, 0.8)', border: '1px solid rgba(123, 30, 59, 0.3)', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: 2, '&:hover': { border: '1px solid #4CAF5040', transform: 'translateY(-2px)' } }}>
              <EmojiEventsIcon sx={{ fontSize: 28, color: '#4CAF50' }} />
              <Box>
                <Typography variant="body1" sx={{ color: '#F5F0F2', fontWeight: 600 }}>Crear torneo</Typography>
                <Typography variant="caption" color="text.secondary">Nuevo torneo</Typography>
              </Box>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Paper elevation={0} onClick={() => router.push('/tournaments')}
              sx={{ p: 2.5, backgroundColor: 'rgba(42, 21, 32, 0.8)', border: '1px solid rgba(123, 30, 59, 0.3)', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: 2, '&:hover': { border: '1px solid #D4A84B40', transform: 'translateY(-2px)' } }}>
              <PeopleIcon sx={{ fontSize: 28, color: '#D4A84B' }} />
              <Box>
                <Typography variant="body1" sx={{ color: '#F5F0F2', fontWeight: 600 }}>Ver torneos</Typography>
                <Typography variant="caption" color="text.secondary">{stats.totalTorneos} torneos</Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>

        <Paper elevation={0} sx={{ p: 3, backgroundColor: 'rgba(42, 21, 32, 0.8)', border: '1px solid rgba(123, 30, 59, 0.3)' }}>
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#F5F0F2', mb: 3 }}>
            Gestion de usuarios
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

      <EditRoleModal
        open={!!editUser}
        onClose={() => setEditUser(null)}
        user={editUser}
        onSave={handleRoleChange}
      />

      <Snackbar open={snackbar.open} autoHideDuration={3000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity={snackbar.severity} variant="filled">{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
}