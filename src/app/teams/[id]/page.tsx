// src/app/teams/[id]/page.tsx
'use client';
import { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Avatar,
  Chip,
  Divider,
  IconButton,
  Alert,
  Snackbar,
  TextField,
  InputAdornment,
  Grid,
} from '@mui/material';
import { useRouter, useParams } from 'next/navigation';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import StarIcon from '@mui/icons-material/Star';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import GroupsIcon from '@mui/icons-material/Groups';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import LabelIcon from '@mui/icons-material/Label';
import Navbar from '@/components/Navbar';
import InviteMemberModal from '@/components/teams/InviteMemberModal';
import { TeamMember } from '@/components/teams/TeamCard';

// ============================================
// DATOS SIMULADOS
// ============================================

const mockTeam = {
  id: 1,
  nombre: 'ESCOM Elite',
  tag: 'ELT',
  juego: 'Valorant',
  torneosActivos: 2,
  torneosGanados: 3,
  fechaCreacion: '15/03/2025',
  miembros: [
    { id: 1, nombre: 'Kevin Díaz', nickname: 'MapacheMediano', rol: 'Capitán' as const, correo: 'kdiazf2021@alumno.ipn.mx' },
    { id: 2, nombre: 'Itzel Flores', nickname: 'ItzelFP', rol: 'Miembro' as const, correo: 'ifloresp2021@alumno.ipn.mx' },
    { id: 3, nombre: 'Carlos López', nickname: 'CarlosGG', rol: 'Miembro' as const, correo: 'clopezm2021@alumno.ipn.mx' },
    { id: 4, nombre: 'Ana García', nickname: 'AnaPlay', rol: 'Miembro' as const, correo: 'agarciag2021@alumno.ipn.mx' },
    { id: 5, nombre: 'Miguel Torres', nickname: 'MiguelPro', rol: 'Miembro' as const, correo: 'mtorresr2021@alumno.ipn.mx' },
  ],
  torneos: [
    { nombre: 'Interpolitécnicos 2025 - Valorant', estado: 'En curso' },
    { nombre: 'Liga Politécnica Valorant S2', estado: 'Abierto' },
  ],
};

// ============================================

export default function TeamDetailPage() {
  const router = useRouter();
  const params = useParams();

  const [team, setTeam] = useState(mockTeam);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ nombre: team.nombre, tag: team.tag });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  const handleRemoveMember = (memberId: number) => {
    const member = team.miembros.find((m) => m.id === memberId);
    if (member?.rol === 'Capitán') {
      setSnackbar({ open: true, message: 'No puedes eliminar al capitán del equipo', severity: 'error' });
      return;
    }

    if (confirm(`¿Estás seguro de eliminar a ${member?.nombre} del equipo?`)) {
      setTeam((prev) => ({
        ...prev,
        miembros: prev.miembros.filter((m) => m.id !== memberId),
      }));
      setSnackbar({ open: true, message: `${member?.nombre} fue removido del equipo`, severity: 'success' });
    }
  };

  const handleSaveEdit = async () => {
    if (!editData.nombre.trim() || !editData.tag.trim()) {
      setSnackbar({ open: true, message: 'El nombre y tag son obligatorios', severity: 'error' });
      return;
    }

    // TODO: Conectar con backend PUT /api/teams/:id
    setTeam((prev) => ({ ...prev, nombre: editData.nombre, tag: editData.tag.toUpperCase() }));
    setIsEditing(false);
    setSnackbar({ open: true, message: 'Equipo actualizado correctamente', severity: 'success' });
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
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => router.push('/teams')}
          sx={{ color: '#C4B0B8', mb: 2 }}
        >
          Volver a mis equipos
        </Button>

        <Grid container spacing={3}>
          {/* Columna izquierda: Info del equipo */}
          <Grid size={{ xs: 12, md: 5 }}>
            <Paper
              elevation={0}
              sx={{
                backgroundColor: 'rgba(42, 21, 32, 0.8)',
                border: '1px solid rgba(123, 30, 59, 0.3)',
                overflow: 'hidden',
              }}
            >
              {/* Banner */}
              <Box
                sx={{
                  height: 80,
                  background: 'linear-gradient(135deg, #7B1E3B 0%, #D4A84B 100%)',
                }}
              />

              <Box sx={{ p: 3, mt: -4 }}>
                {/* Avatar del equipo */}
                <Avatar
                  sx={{
                    width: 72,
                    height: 72,
                    fontWeight: 800,
                    fontSize: '1.3rem',
                    background: 'linear-gradient(135deg, #D4A84B 0%, #E0C078 100%)',
                    color: '#1A0A10',
                    border: '4px solid #2A1520',
                    mb: 2,
                  }}
                >
                  {team.tag}
                </Avatar>

                {/* Nombre editable */}
                {isEditing ? (
                  <Box sx={{ mb: 2 }}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Nombre"
                      value={editData.nombre}
                      onChange={(e) => setEditData((prev) => ({ ...prev, nombre: e.target.value }))}
                      sx={{ mb: 1.5 }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <GroupsIcon sx={{ color: '#C4B0B8', fontSize: 18 }} />
                          </InputAdornment>
                        ),
                      }}
                    />
                    <TextField
                      fullWidth
                      size="small"
                      label="Tag"
                      value={editData.tag}
                      onChange={(e) => setEditData((prev) => ({ ...prev, tag: e.target.value.toUpperCase() }))}
                      inputProps={{ maxLength: 4 }}
                      sx={{ mb: 1.5 }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LabelIcon sx={{ color: '#C4B0B8', fontSize: 18 }} />
                          </InputAdornment>
                        ),
                      }}
                    />
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button size="small" startIcon={<SaveIcon />} variant="contained" onClick={handleSaveEdit}>
                        Guardar
                      </Button>
                      <Button size="small" startIcon={<CancelIcon />} onClick={() => setIsEditing(false)} sx={{ color: '#C4B0B8' }}>
                        Cancelar
                      </Button>
                    </Box>
                  </Box>
                ) : (
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                      <Typography variant="h5" sx={{ fontWeight: 800, color: '#F5F0F2' }}>
                        {team.nombre}
                      </Typography>
                      <IconButton size="small" onClick={() => setIsEditing(true)} sx={{ color: '#C4B0B8' }}>
                        <EditIcon sx={{ fontSize: 18 }} />
                      </IconButton>
                    </Box>
                    <Chip
                      label={`[${team.tag}]`}
                      size="small"
                      sx={{
                        backgroundColor: 'rgba(212, 168, 75, 0.15)',
                        color: '#D4A84B',
                        fontWeight: 800,
                      }}
                    />
                  </Box>
                )}

                {/* Info */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <SportsEsportsIcon sx={{ fontSize: 18, color: '#D4A84B' }} />
                    <Typography variant="body2" sx={{ color: '#F5F0F2' }}>
                      {team.juego}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CalendarTodayIcon sx={{ fontSize: 18, color: '#C4B0B8' }} />
                    <Typography variant="body2" color="text.secondary">
                      Creado el {team.fechaCreacion}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <GroupsIcon sx={{ fontSize: 18, color: '#C4B0B8' }} />
                    <Typography variant="body2" color="text.secondary">
                      {team.miembros.length} integrantes
                    </Typography>
                  </Box>
                </Box>

                <Divider sx={{ borderColor: 'rgba(123, 30, 59, 0.2)', my: 2 }} />

                {/* Stats */}
                <Box sx={{ display: 'flex', gap: 3 }}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h5" sx={{ fontWeight: 800, color: '#D4A84B' }}>
                      {team.torneosActivos}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">Activos</Typography>
                  </Box>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h5" sx={{ fontWeight: 800, color: '#4CAF50' }}>
                      {team.torneosGanados}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">Ganados</Typography>
                  </Box>
                </Box>

                <Divider sx={{ borderColor: 'rgba(123, 30, 59, 0.2)', my: 2 }} />

                {/* Torneos activos */}
                <Typography variant="subtitle2" sx={{ color: '#D4A84B', fontWeight: 600, mb: 1 }}>
                  Torneos activos
                </Typography>
                {team.torneos.map((torneo, i) => (
                  <Box
                    key={i}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      p: 1,
                      borderRadius: 1,
                      backgroundColor: 'rgba(26, 10, 16, 0.4)',
                      mb: 0.5,
                    }}
                  >
                    <EmojiEventsIcon sx={{ fontSize: 16, color: '#C4B0B8' }} />
                    <Typography variant="caption" sx={{ color: '#F5F0F2', flex: 1 }}>
                      {torneo.nombre}
                    </Typography>
                    <Chip
                      label={torneo.estado}
                      size="small"
                      sx={{
                        height: 20,
                        fontSize: '0.6rem',
                        backgroundColor: torneo.estado === 'En curso'
                          ? 'rgba(212, 168, 75, 0.15)' : 'rgba(76, 175, 80, 0.15)',
                        color: torneo.estado === 'En curso' ? '#D4A84B' : '#4CAF50',
                      }}
                    />
                  </Box>
                ))}
              </Box>
            </Paper>
          </Grid>

          {/* Columna derecha: Integrantes */}
          <Grid size={{ xs: 12, md: 7 }}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                backgroundColor: 'rgba(42, 21, 32, 0.8)',
                border: '1px solid rgba(123, 30, 59, 0.3)',
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#F5F0F2' }}>
                  Integrantes
                </Typography>
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<PersonAddIcon />}
                  onClick={() => setInviteModalOpen(true)}
                >
                  Invitar
                </Button>
              </Box>

              {/* Lista de miembros */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {team.miembros.map((member) => (
                  <Box
                    key={member.id}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      p: 2,
                      borderRadius: 2,
                      backgroundColor: 'rgba(26, 10, 16, 0.4)',
                      transition: 'background-color 0.2s',
                      '&:hover': {
                        backgroundColor: 'rgba(26, 10, 16, 0.7)',
                      },
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar
                        sx={{
                          width: 40,
                          height: 40,
                          backgroundColor: member.rol === 'Capitán'
                            ? '#D4A84B' : 'rgba(123, 30, 59, 0.5)',
                          color: member.rol === 'Capitán' ? '#1A0A10' : '#F5F0F2',
                          fontWeight: 600,
                        }}
                      >
                        {member.nombre[0]}
                      </Avatar>
                      <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                          <Typography variant="body2" sx={{ color: '#F5F0F2', fontWeight: 600 }}>
                            {member.nombre}
                          </Typography>
                          {member.rol === 'Capitán' && (
                            <Chip
                              icon={<StarIcon sx={{ fontSize: 12 }} />}
                              label="Capitán"
                              size="small"
                              sx={{
                                height: 20,
                                fontSize: '0.6rem',
                                backgroundColor: 'rgba(212, 168, 75, 0.15)',
                                color: '#D4A84B',
                                '& .MuiChip-icon': { color: '#D4A84B' },
                              }}
                            />
                          )}
                        </Box>
                        <Typography variant="caption" color="text.secondary">
                          @{member.nickname} • {member.correo}
                        </Typography>
                      </Box>
                    </Box>

                    {/* Botón eliminar (no se puede eliminar al capitán) */}
                    {member.rol !== 'Capitán' && (
                      <IconButton
                        size="small"
                        onClick={() => handleRemoveMember(member.id)}
                        sx={{
                          color: '#C4B0B8',
                          '&:hover': { color: '#FF6B6B', backgroundColor: 'rgba(255, 107, 107, 0.1)' },
                        }}
                      >
                        <PersonRemoveIcon sx={{ fontSize: 20 }} />
                      </IconButton>
                    )}
                  </Box>
                ))}
              </Box>

              {/* Info de RGN-05 */}
              <Alert
                severity="info"
                sx={{
                  mt: 2,
                  backgroundColor: 'rgba(33, 150, 243, 0.08)',
                  border: '1px solid rgba(33, 150, 243, 0.15)',
                }}
              >
                Solo el capitán puede gestionar los integrantes del equipo. Cada equipo solo puede tener un capitán (RGN-05).
              </Alert>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* Modal invitar */}
      <InviteMemberModal
        open={inviteModalOpen}
        onClose={() => setInviteModalOpen(false)}
        teamName={team.nombre}
        onInvited={(correo: string) => {
          console.log('Invitado:', correo);
          setSnackbar({ open: true, message: `Invitación enviada a ${correo}`, severity: 'success' });
        }}
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