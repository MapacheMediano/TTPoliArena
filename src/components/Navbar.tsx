// src/components/Navbar.tsx
'use client';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  Divider,
} from '@mui/material';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import DashboardIcon from '@mui/icons-material/Dashboard';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Badge from '@mui/material/Badge';

interface NavbarProps {
  isLoggedIn?: boolean;
  userName?: string;
}

export default function Navbar({ isLoggedIn = false, userName = '' }: NavbarProps) {
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const menuOpen = Boolean(anchorEl);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    // TODO: Limpiar sesión cuando haya backend
    router.push('/login');
  };

  const iniciales = userName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <AppBar
      position="sticky"
      sx={{
        background: 'linear-gradient(90deg, #1A0A10 0%, #2A1520 100%)',
        borderBottom: '1px solid rgba(123, 30, 59, 0.3)',
      }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
          {/* Logo */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
              gap: 1,
            }}
            onClick={() => router.push(isLoggedIn ? '/dashboard' : '/')}
          >
            <SportsEsportsIcon sx={{ fontSize: 32, color: '#D4A84B' }} />
            <Typography
              variant="h5"
              sx={{
                fontWeight: 800,
                background: 'linear-gradient(135deg, #D4A84B 0%, #E0C078 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '-0.5px',
              }}
            >
              PoliArena
            </Typography>
          </Box>

          {/* Lado derecho */}
          {isLoggedIn ? (
            /* --- Usuario logueado --- */
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {/* Botón Torneos */}
              <Button
                sx={{ color: '#C4B0B8', '&:hover': { color: '#F5F0F2' } }}
                startIcon={<EmojiEventsIcon />}
                onClick={() => console.log('Ir a torneos')}
              >
                Torneos
              </Button>

              {/* Notificaciones */}
              <IconButton sx={{ color: '#C4B0B8' }}>
                <Badge badgeContent={3} color="error" variant="dot">
                  <NotificationsIcon />
                </Badge>
              </IconButton>

              {/* Avatar / Menú usuario */}
              <IconButton onClick={handleMenuOpen} sx={{ ml: 0.5 }}>
                <Avatar
                  sx={{
                    width: 36,
                    height: 36,
                    background:
                      'linear-gradient(135deg, #7B1E3B 0%, #D4A84B 100%)',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                  }}
                >
                  {iniciales}
                </Avatar>
              </IconButton>

              {/* Menú desplegable */}
              <Menu
                anchorEl={anchorEl}
                open={menuOpen}
                onClose={handleMenuClose}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                PaperProps={{
                  sx: {
                    mt: 1,
                    backgroundColor: '#2A1520',
                    border: '1px solid rgba(123, 30, 59, 0.3)',
                    minWidth: 200,
                  },
                }}
              >
                <MenuItem
                  onClick={() => {
                    handleMenuClose();
                    router.push('/dashboard');
                  }}
                >
                  <ListItemIcon>
                    <DashboardIcon sx={{ color: '#C4B0B8' }} />
                  </ListItemIcon>
                  <Typography variant="body2">Dashboard</Typography>
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    handleMenuClose();
                    router.push('/profile');
                  }}
                >
                  <ListItemIcon>
                    <PersonIcon sx={{ color: '#C4B0B8' }} />
                  </ListItemIcon>
                  <Typography variant="body2">Mi Perfil</Typography>
                </MenuItem>
                <Divider sx={{ borderColor: 'rgba(123, 30, 59, 0.3)' }} />
                <MenuItem onClick={handleLogout}>
                  <ListItemIcon>
                    <LogoutIcon sx={{ color: '#FF6B6B' }} />
                  </ListItemIcon>
                  <Typography variant="body2" sx={{ color: '#FF6B6B' }}>
                    Cerrar sesión
                  </Typography>
                </MenuItem>
              </Menu>
            </Box>
          ) : (
            /* --- Usuario NO logueado --- */
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="outlined"
                sx={{
                  color: '#F5F0F2',
                  borderColor: 'rgba(123, 30, 59, 0.5)',
                  '&:hover': {
                    borderColor: '#7B1E3B',
                    backgroundColor: 'rgba(123, 30, 59, 0.1)',
                  },
                }}
                onClick={() => router.push('/login')}
              >
                Iniciar Sesión
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={() => router.push('/register')}
              >
                Registrarse
              </Button>
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
}