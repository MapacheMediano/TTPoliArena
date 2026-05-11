'use client';
import {
  AppBar, Toolbar, Typography, Button, Box, Container,
  Avatar, IconButton, Menu, MenuItem, ListItemIcon,
  Divider, Badge, List, ListItem, ListItemText, Paper,
} from '@mui/material';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import DashboardIcon from '@mui/icons-material/Dashboard';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import WarningIcon from '@mui/icons-material/Warning';
import EmojiEventsOutlinedIcon from '@mui/icons-material/EmojiEventsOutlined';
import GroupsIcon from '@mui/icons-material/Groups';
import { logoutUser } from '@/lib/api/auth.service';

interface Notification {
  id: string;
  type: string;
  message: string;
  link: string;
  createdAt: string;
}

interface NavbarProps {
  isLoggedIn?: boolean;
  userName?: string;
  role?: string;
}

export default function Navbar({ isLoggedIn = false, userName = '', role = '' }: NavbarProps) {
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notifAnchorEl, setNotifAnchorEl] = useState<null | HTMLElement>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [readIds, setReadIds] = useState<Set<string>>(() => {
  if (typeof window === 'undefined') return new Set();
  const saved = localStorage.getItem('poliarena_read_notifs');
  return saved ? new Set(JSON.parse(saved)) : new Set();
    });
  const menuOpen = Boolean(anchorEl);
  const notifOpen = Boolean(notifAnchorEl);

  useEffect(() => {
    if (!isLoggedIn) return;
    async function loadNotifications() {
      try {
        const res = await fetch('/api/notifications', { credentials: 'include' });
        const data = await res.json();
        if (data.ok) setNotifications(data.notifications ?? []);
      } catch (error) {
        console.error('Error cargando notificaciones:', error);
      }
    }
    loadNotifications();
  }, [isLoggedIn]);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleNotifOpen = (event: React.MouseEvent<HTMLElement>) => setNotifAnchorEl(event.currentTarget);
  const handleNotifClose = () => setNotifAnchorEl(null);

  const handleLogout = async () => {
    handleMenuClose();
    try {
      await logoutUser();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    } finally {
      router.push('/login');
      router.refresh();
    }
  };

  const getNotifIcon = (type: string) => {
    switch (type) {
      case 'RESULT_APPROVED': return <CheckCircleIcon sx={{ fontSize: 18, color: '#4CAF50' }} />;
      case 'RESULT_REJECTED': return <CancelIcon sx={{ fontSize: 18, color: '#FF6B6B' }} />;
      case 'PENDING_VALIDATIONS': return <WarningIcon sx={{ fontSize: 18, color: '#D4A84B' }} />;
      case 'NEW_TOURNAMENT': return <EmojiEventsOutlinedIcon sx={{ fontSize: 18, color: '#2196F3' }} />;
      case 'TEAM_INVITE': return <GroupsIcon sx={{ fontSize: 18, color: '#D4A84B' }} />;
      default: return <NotificationsIcon sx={{ fontSize: 18, color: '#C4B0B8' }} />;
    }
  };

  const iniciales = userName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <AppBar position="sticky" sx={{ background: 'linear-gradient(90deg, #1A0A10 0%, #2A1520 100%)', borderBottom: '1px solid rgba(123, 30, 59, 0.3)' }}>
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
          {/* Logo */}
          <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', gap: 1 }}
            onClick={() => router.push(isLoggedIn ? '/dashboard' : '/')}>
            <SportsEsportsIcon sx={{ fontSize: 32, color: '#D4A84B' }} />
            <Typography variant="h5" sx={{ fontWeight: 800, background: 'linear-gradient(135deg, #D4A84B 0%, #E0C078 100%)', backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-0.5px' }}>
              PoliArena
            </Typography>
          </Box>

          {isLoggedIn ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Button sx={{ color: '#C4B0B8', '&:hover': { color: '#F5F0F2' } }}
                startIcon={<EmojiEventsIcon />} onClick={() => router.push('/tournaments')}>
                Torneos
              </Button>

              {/* Notificaciones */}
              <IconButton sx={{ color: '#C4B0B8' }} onClick={handleNotifOpen}>
                <Badge badgeContent={notifications.filter(n => !readIds.has(n.id)).length} color="error" max={9}
                  invisible={notifications.filter(n => !readIds.has(n.id)).length === 0}>
                  <NotificationsIcon />
                </Badge>
              </IconButton>

              {/* Dropdown notificaciones */}
              <Menu
                anchorEl={notifAnchorEl}
                open={notifOpen}
                onClose={handleNotifClose}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                PaperProps={{
                  sx: {
                    mt: 1,
                    backgroundColor: '#2A1520',
                    border: '1px solid rgba(123, 30, 59, 0.3)',
                    minWidth: 320,
                    maxWidth: 360,
                    maxHeight: 400,
                    overflow: 'auto',
                  },
                }}
              >
                <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid rgba(123, 30, 59, 0.3)' }}>
                  <Typography variant="subtitle2" sx={{ color: '#F5F0F2', fontWeight: 700 }}>
                    Notificaciones
                  </Typography>
                </Box>

                {notifications.length === 0 ? (
                  <Box sx={{ p: 3, textAlign: 'center' }}>
                    <NotificationsIcon sx={{ fontSize: 40, color: '#C4B0B8', opacity: 0.4, mb: 1 }} />
                    <Typography variant="body2" color="text.secondary">
                      No tienes notificaciones
                    </Typography>
                  </Box>
                ) : (
                  <List disablePadding>
                    {notifications.map((notif, idx) => (
                      <Box key={notif.id}>
                        <ListItem
                          onClick={() => {
                            setReadIds(prev => {
                              const updated = new Set([...prev, notif.id]);
                              localStorage.setItem('poliarena_read_notifs', JSON.stringify([...updated]));
                              return updated;
                            });
                            handleNotifClose();
                            router.push(notif.link);
                          }}
                          sx={{ 
                            cursor: 'pointer', py: 1.5, px: 2,
                            backgroundColor: readIds.has(notif.id) ? 'transparent' : 'rgba(123, 30, 59, 0.08)',
                            '&:hover': { backgroundColor: 'rgba(123, 30, 59, 0.15)' }
                          }}
                        >
                          <ListItemIcon sx={{ minWidth: 32 }}>
                            {getNotifIcon(notif.type)}
                          </ListItemIcon>
                          <ListItemText
                            primary={
                              <Typography variant="body2" sx={{ color: '#F5F0F2', fontSize: '0.82rem', lineHeight: 1.4 }}>
                                {notif.message}
                              </Typography>
                            }
                            secondary={
                              <Typography variant="caption" sx={{ color: '#C4B0B8', fontSize: '0.7rem' }}>
                                {new Date(notif.createdAt).toLocaleDateString('es-MX', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                              </Typography>
                            }
                          />
                        </ListItem>
                        {idx < notifications.length - 1 && (
                          <Divider sx={{ borderColor: 'rgba(123, 30, 59, 0.15)' }} />
                        )}
                      </Box>
                    ))}
                  </List>
                )}
              </Menu>

              {/* Avatar */}
              <IconButton onClick={handleMenuOpen} sx={{ ml: 0.5 }}>
                <Avatar sx={{ width: 36, height: 36, background: 'linear-gradient(135deg, #7B1E3B 0%, #D4A84B 100%)', fontSize: '0.85rem', fontWeight: 700 }}>
                  {iniciales}
                </Avatar>
              </IconButton>

              {/* Menú usuario */}
              <Menu
                anchorEl={anchorEl}
                open={menuOpen}
                onClose={handleMenuClose}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                PaperProps={{ sx: { mt: 1, backgroundColor: '#2A1520', border: '1px solid rgba(123, 30, 59, 0.3)', minWidth: 200 } }}
              >
                <MenuItem onClick={() => { handleMenuClose(); router.push('/dashboard'); }}>
                  <ListItemIcon><DashboardIcon sx={{ color: '#C4B0B8' }} /></ListItemIcon>
                  <Typography variant="body2">Dashboard</Typography>
                </MenuItem>

                {(role === 'ADMIN' || role === 'STAFF') && (
                  <MenuItem onClick={() => { handleMenuClose(); router.push('/admin'); }}>
                    <ListItemIcon><AdminPanelSettingsIcon sx={{ color: '#D4A84B' }} /></ListItemIcon>
                    <Typography variant="body2" sx={{ color: '#D4A84B', fontWeight: 600 }}>Panel de Admin</Typography>
                  </MenuItem>
                )}

                <MenuItem onClick={() => { handleMenuClose(); router.push('/profile'); }}>
                  <ListItemIcon><PersonIcon sx={{ color: '#C4B0B8' }} /></ListItemIcon>
                  <Typography variant="body2">Mi Perfil</Typography>
                </MenuItem>

                <Divider sx={{ borderColor: 'rgba(123, 30, 59, 0.3)' }} />

                <MenuItem onClick={handleLogout}>
                  <ListItemIcon><LogoutIcon sx={{ color: '#FF6B6B' }} /></ListItemIcon>
                  <Typography variant="body2" sx={{ color: '#FF6B6B' }}>Cerrar sesión</Typography>
                </MenuItem>
              </Menu>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button variant="outlined"
                sx={{ color: '#F5F0F2', borderColor: 'rgba(123, 30, 59, 0.5)', '&:hover': { borderColor: '#7B1E3B', backgroundColor: 'rgba(123, 30, 59, 0.1)' } }}
                onClick={() => router.push('/login')}>
                Iniciar Sesión
              </Button>
              <Button variant="contained" color="primary" onClick={() => router.push('/register')}>
                Registrarse
              </Button>
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
}