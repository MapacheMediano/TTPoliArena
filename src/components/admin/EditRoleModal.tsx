// src/components/admin/EditRoleModal.tsx
'use client';
import { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Typography, Button, Box, Avatar, Chip, Paper, Alert,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import StarIcon from '@mui/icons-material/Star';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import type { UserRole } from '@/lib/api/types/auth.types';

export interface UserData {
  id: string;
  nombre: string;
  nickname: string;
  correo: string;
  unidadAcademica: string;
  rol: UserRole;
  estado: string;
  fechaRegistro: string;
  torneosJugados: number;
}

const roles = [
  {
    value: 'PLAYER' as UserRole,
    label: 'Jugador',
    descripcion: 'Puede inscribirse a torneos y reportar resultados',
    icon: <PersonIcon sx={{ fontSize: 18 }} />,
    color: '#2196F3',
  },
  {
    value: 'CAPTAIN' as UserRole,
    label: 'Capitán',
    descripcion: 'Jugador + gestionar equipos e inscribirlos a torneos',
    icon: <StarIcon sx={{ fontSize: 18 }} />,
    color: '#D4A84B',
  },
  {
    value: 'STAFF' as UserRole,
    label: 'Staff / Organizador',
    descripcion: 'Crear torneos, generar brackets, validar resultados',
    icon: <SupervisorAccountIcon sx={{ fontSize: 18 }} />,
    color: '#4CAF50',
  },
  {
    value: 'ADMIN' as UserRole,
    label: 'Administrador',
    descripcion: 'Acceso total: gestionar roles, catálogos y configuración',
    icon: <AdminPanelSettingsIcon sx={{ fontSize: 18 }} />,
    color: '#FF6B6B',
  },
];

interface EditRoleModalProps {
  open: boolean;
  onClose: () => void;
  user: UserData | null;
  onSave: (userId: string, newRole: UserRole) => void;
}

export default function EditRoleModal({ open, onClose, user, onSave }: EditRoleModalProps) {
  const [selectedRole, setSelectedRole] = useState<UserRole>(user?.rol || 'PLAYER');
  const [loading, setLoading] = useState(false);

  if (user && selectedRole !== user.rol && !loading) {
    setSelectedRole(user.rol);
  }

  const handleSave = async () => {
    if (!user || selectedRole === user.rol) {
      onClose();
      return;
    }
    setLoading(true);
    try {
      onSave(user.id, selectedRole);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  const iniciales = user.nombre.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth
      PaperProps={{ sx: { backgroundColor: '#2A1520', border: '1px solid rgba(123, 30, 59, 0.3)', backgroundImage: 'none' } }}>
      <DialogTitle sx={{ fontWeight: 700, color: '#F5F0F2' }}>
        Cambiar rol de usuario
      </DialogTitle>

      <DialogContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, borderRadius: 2, backgroundColor: 'rgba(26, 10, 16, 0.5)', mb: 3 }}>
          <Avatar sx={{ width: 48, height: 48, background: 'linear-gradient(135deg, #7B1E3B 0%, #D4A84B 100%)', fontWeight: 700 }}>
            {iniciales}
          </Avatar>
          <Box>
            <Typography variant="body1" sx={{ color: '#F5F0F2', fontWeight: 600 }}>{user.nombre}</Typography>
            <Typography variant="caption" color="text.secondary">@{user.nickname} • {user.correo}</Typography>
            <Box sx={{ mt: 0.5 }}>
              <Chip label={'Rol actual: ' + user.rol} size="small"
                sx={{ backgroundColor: 'rgba(123, 30, 59, 0.2)', color: '#A23A5C', fontWeight: 600, fontSize: '0.7rem' }} />
            </Box>
          </Box>
        </Box>

        <Typography variant="body2" sx={{ color: '#F5F0F2', fontWeight: 500, mb: 1.5 }}>
          Selecciona el nuevo rol
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {roles.map((rol) => (
            <Paper key={rol.value} elevation={0} onClick={() => setSelectedRole(rol.value)}
              sx={{
                p: 2, cursor: 'pointer',
                backgroundColor: selectedRole === rol.value ? rol.color + '15' : 'rgba(26, 10, 16, 0.4)',
                border: selectedRole === rol.value ? '2px solid ' + rol.color : '2px solid rgba(123, 30, 59, 0.15)',
                borderRadius: 2, transition: 'all 0.2s',
                display: 'flex', alignItems: 'center', gap: 2,
                '&:hover': { borderColor: rol.color + '80' },
              }}>
              <Box sx={{ p: 0.75, borderRadius: 1.5, backgroundColor: rol.color + '20', color: rol.color, display: 'flex' }}>
                {rol.icon}
              </Box>
              <Box>
                <Typography variant="body2" sx={{ color: selectedRole === rol.value ? rol.color : '#F5F0F2', fontWeight: 600 }}>
                  {rol.label}
                </Typography>
                <Typography variant="caption" color="text.secondary">{rol.descripcion}</Typography>
              </Box>
            </Paper>
          ))}
        </Box>

        {selectedRole === 'ADMIN' && (
          <Alert severity="warning" sx={{ mt: 2, backgroundColor: 'rgba(255, 107, 107, 0.08)', border: '1px solid rgba(255, 107, 107, 0.2)' }}>
            El rol de Administrador otorga acceso total al sistema. Asígnalo solo a personal autorizado.
          </Alert>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} sx={{ color: '#C4B0B8' }}>Cancelar</Button>
        <Button variant="contained" onClick={handleSave} disabled={loading || selectedRole === user.rol}>
          {loading ? 'Guardando...' : 'Guardar cambio'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}