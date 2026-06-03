// src/components/admin/UserTable.tsx
'use client';
import {
  Box,
  Typography,
  Avatar,
  Chip,
  IconButton,
  TextField,
  InputAdornment,
  Paper,
  MenuItem,
  Button,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SearchIcon from '@mui/icons-material/Search';
import BlockIcon from '@mui/icons-material/Block';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { UserData } from './EditRoleModal';

const rolColors: Record<string, { bg: string; text: string }> = {
  'PLAYER':  { bg: 'rgba(33, 150, 243, 0.15)',  text: '#2196F3' },
  'CAPTAIN': { bg: 'rgba(212, 168, 75, 0.15)',  text: '#D4A84B' },
  'STAFF':   { bg: 'rgba(76, 175, 80, 0.15)',   text: '#4CAF50' },
  'ADMIN':   { bg: 'rgba(255, 107, 107, 0.15)', text: '#FF6B6B' },
};


interface UserTableProps {
  users: UserData[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filterRole: string;
  onFilterRoleChange: (role: string) => void;
  onEditRole: (user: UserData) => void;
  onToggleStatus: (userId: string) => void;
}

export default function UserTable({
  users,
  searchQuery,
  onSearchChange,
  filterRole,
  onFilterRoleChange,
  onEditRole,
  onToggleStatus,
}: UserTableProps) {
  return (
    <Box>
      {/* Barra de búsqueda y filtros */}
      <Box sx={{ display: 'flex', gap: 1.5, mb: 3, flexWrap: 'wrap' }}>
        <TextField
          placeholder="Buscar por nombre, nickname o correo..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          sx={{ flex: 1, minWidth: 250 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: '#C4B0B8' }} />
              </InputAdornment>
            ),
          }}
        />
        <TextField
          select
          label="Filtrar por rol"
          value={filterRole}
          onChange={(e) => onFilterRoleChange(e.target.value)}
          sx={{ minWidth: 160 }}
          size="medium"
        >
          <MenuItem value="Todos">Todos los roles</MenuItem>
          <MenuItem value="Jugador">Jugador</MenuItem>
          <MenuItem value="Capitán">Capitán</MenuItem>
          <MenuItem value="Organizador">Organizador</MenuItem>
          <MenuItem value="Administrador">Administrador</MenuItem>
        </TextField>
      </Box>

      {/* Contador */}
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {users.length} {users.length === 1 ? 'usuario encontrado' : 'usuarios encontrados'}
      </Typography>

      {/* Lista de usuarios */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {users.length > 0 ? (
          users.map((user) => {
            const rolStyle = rolColors[user.rol] || rolColors['Jugador'];
            const iniciales = user.nombre
              .split(' ')
              .map((n) => n[0])
              .join('')
              .slice(0, 2)
              .toUpperCase();

            return (
              <Paper
                key={user.id}
                elevation={0}
                sx={{
                  p: 2,
                  backgroundColor: 'rgba(26, 10, 16, 0.4)',
                  border: '1px solid rgba(123, 30, 59, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 2,
                  flexWrap: 'wrap',
                  transition: 'background-color 0.2s',
                  '&:hover': {
                    backgroundColor: 'rgba(26, 10, 16, 0.7)',
                  },
                }}
              >
                {/* Info del usuario */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1, minWidth: 200 }}>
                  <Avatar
                    sx={{
                      width: 40,
                      height: 40,
                      background: 'linear-gradient(135deg, #7B1E3B 0%, #D4A84B 100%)',
                      fontSize: '0.85rem',
                      fontWeight: 700,
                    }}
                  >
                    {iniciales}
                  </Avatar>
                  <Box>
                    <Typography variant="body2" sx={{ color: '#F5F0F2', fontWeight: 600 }}>
                      {user.nombre}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      @{user.nickname} • {user.correo}
                    </Typography>
                  </Box>
                </Box>

                {/* Unidad */}
                <Box sx={{ minWidth: 120, display: { xs: 'none', md: 'block' } }}>
                  <Typography variant="caption" color="text.secondary">
                    {user.unidadAcademica}
                  </Typography>
                </Box>

                {/* Torneos */}
                <Box sx={{ minWidth: 50, textAlign: 'center', display: { xs: 'none', sm: 'block' } }}>
                  <Typography variant="body2" sx={{ color: '#D4A84B', fontWeight: 600 }}>
                    {user.torneosJugados}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Torneos
                  </Typography>
                </Box>

                {/* Rol */}
                <Chip
                  label={user.rol}
                  size="small"
                  sx={{
                    backgroundColor: rolStyle.bg,
                    color: rolStyle.text,
                    fontWeight: 600,
                    minWidth: 90,
                    border: `1px solid ${rolStyle.text}30`,
                  }}
                />


                {/* Acciones */}
                <Box sx={{ display: 'flex', gap: 0.5 }}>
                  <IconButton
                    size="small"
                    onClick={() => onEditRole(user)}
                    sx={{
                      color: '#D4A84B',
                      '&:hover': { backgroundColor: 'rgba(212, 168, 75, 0.1)' },
                    }}
                    title="Cambiar rol"
                  >
                    <EditIcon sx={{ fontSize: 18 }} />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => onToggleStatus(user.id)}
                    sx={{
                      color: user.estado === 'Activo' ? '#FF6B6B' : '#4CAF50',
                      '&:hover': {
                        backgroundColor: user.estado === 'Activo'
                          ? 'rgba(255, 107, 107, 0.1)'
                          : 'rgba(76, 175, 80, 0.1)',
                      },
                    }}
                    title={user.estado === 'Activo' ? 'Suspender usuario' : 'Activar usuario'}
                  >
                    {user.estado === 'Activo' ? (
                      <BlockIcon sx={{ fontSize: 18 }} />
                    ) : (
                      <CheckCircleIcon sx={{ fontSize: 18 }} />
                    )}
                  </IconButton>
                </Box>
              </Paper>
            );
          })
        ) : (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body2" color="text.secondary">
              No se encontraron usuarios con esos filtros
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
}