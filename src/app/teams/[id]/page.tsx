'use client';
import { useEffect, useState } from 'react';
import {
  Box, Container, Typography, Button, Paper,
  Avatar, Chip, CircularProgress, Alert, Divider,
} from '@mui/material';
import { useRouter, useParams } from 'next/navigation';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import DeleteIcon from '@mui/icons-material/Delete';
import StarIcon from '@mui/icons-material/Star';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import GroupsIcon from '@mui/icons-material/Groups';
import Navbar from '@/components/Navbar';
import InviteMemberModal from '@/components/teams/InviteMemberModal';
import { getTeamById, removeTeamMember, addTeamMember } from '@/lib/api/teams.service';
import { getCurrentUser } from '@/lib/api/auth.service';
import type { Team } from '@/lib/api/teams.service';

export default function TeamDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [team, setTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState('');
  const [userName, setUserName] = useState('');
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const meRes = await getCurrentUser();
        if (!meRes.user) {
          router.push('/login');
          return;
        }
        setCurrentUserId(meRes.user.id);
        setUserName(meRes.user.email.split('@')[0]);

        const teamRes = await getTeamById(id);
        if (!teamRes.ok || !teamRes.team) {
          router.push('/teams');
          return;
        }
        setTeam(teamRes.team);
      } catch (error) {
        router.push('/teams');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id, router]);

  const handleInvited = async (correo: string) => {
    setError('');
    setSuccess('');
    const result = await addTeamMember(id, { email: correo });
    if (result.ok) {
      setSuccess('Miembro agregado correctamente');
      const teamRes = await getTeamById(id);
      if (teamRes.ok && teamRes.team) setTeam(teamRes.team);
    } else {
      setError(result.error ?? 'Error al agregar miembro');
    }
    setInviteModalOpen(false);
  };

  const handleRemoveMember = async (userId: string) => {
    setError('');
    setSuccess('');
    const result = await removeTeamMember(id, userId);
    if (result.ok) {
      setSuccess('Miembro eliminado correctamente');
      const teamRes = await getTeamById(id);
      if (teamRes.ok && teamRes.team) setTeam(teamRes.team);
    } else {
      setError(result.error ?? 'Error al eliminar miembro');
    }
  };

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #1A0A10 0%, #2A1520 50%, #1A0A10 100%)' }}>
        <CircularProgress sx={{ color: '#D4A84B' }} />
      </Box>
    );
  }

  if (!team) return null;

  const isCaptain = team.captainId === currentUserId;

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1A0A10 0%, #2A1520 50%, #1A0A10 100%)' }}>
      <Navbar isLoggedIn={true} userName={userName} />

      <Container maxWidth="md" sx={{ py: 4 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => router.push('/teams')} sx={{ color: '#C4B0B8', mb: 2 }}>
          Volver a equipos
        </Button>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

        {/* Header */}
        <Paper elevation={0} sx={{ p: 4, backgroundColor: 'rgba(42, 21, 32, 0.8)', border: '1px solid rgba(123, 30, 59, 0.3)', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 3 }}>
            <Avatar sx={{ width: 72, height: 72, fontWeight: 800, fontSize: '1.4rem', background: 'linear-gradient(135deg, #D4A84B 0%, #E0C078 100%)', color: '#1A0A10' }}>
              {team.tag}
            </Avatar>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#F5F0F2' }}>
                {team.name}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                <SportsEsportsIcon sx={{ fontSize: 16, color: '#D4A84B' }} />
                <Typography variant="body2" sx={{ color: '#D4A84B', fontWeight: 600 }}>
                  {team.game}
                </Typography>
              </Box>
            </Box>
            <Chip
              icon={<GroupsIcon />}
              label={team.members.length + ' miembros'}
              sx={{ backgroundColor: 'rgba(212, 168, 75, 0.15)', color: '#D4A84B' }}
            />
          </Box>
          <Typography variant="caption" color="text.secondary">
            Creado el {new Date(team.createdAt).toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' })}
          </Typography>
        </Paper>

        {/* Miembros */}
        <Paper elevation={0} sx={{ p: 3, backgroundColor: 'rgba(42, 21, 32, 0.8)', border: '1px solid rgba(123, 30, 59, 0.3)' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#F5F0F2' }}>
              Integrantes
            </Typography>
            {isCaptain && (
              <Button variant="contained" startIcon={<PersonAddIcon />} size="small" onClick={() => setInviteModalOpen(true)}>
                Agregar miembro
              </Button>
            )}
          </Box>

          <Divider sx={{ borderColor: 'rgba(123, 30, 59, 0.3)', mb: 2 }} />

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {team.members.map((member) => {
              const isCaptainMember = member.userId === team.captainId;
              const displayName = member.user.PlayerProfile?.fullName ?? member.user.email.split('@')[0];
              const gamerTag = member.user.PlayerProfile?.gamerTag;

              return (
                <Box key={member.id} sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, borderRadius: 2, backgroundColor: 'rgba(26, 10, 16, 0.4)', border: '1px solid rgba(123, 30, 59, 0.15)' }}>
                  <Avatar sx={{ width: 40, height: 40, background: 'linear-gradient(135deg, #7B1E3B, #D4A84B)', fontWeight: 700 }}>
                    {displayName[0].toUpperCase()}
                  </Avatar>
                  <Box sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: '#F5F0F2' }}>
                        {displayName}
                      </Typography>
                      {isCaptainMember && (
                        <Chip
                          icon={<StarIcon sx={{ fontSize: '14px !important' }} />}
                          label="Capitán"
                          size="small"
                          sx={{ backgroundColor: 'rgba(212, 168, 75, 0.2)', color: '#D4A84B', height: 20, fontSize: '0.7rem' }}
                        />
                      )}
                    </Box>
                    {gamerTag && (
                      <Typography variant="caption" sx={{ color: '#D4A84B' }}>
                        @{gamerTag}
                      </Typography>
                    )}
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                      {member.user.email}
                    </Typography>
                  </Box>
                  {isCaptain && !isCaptainMember && (
                    <Button size="small" color="error" startIcon={<DeleteIcon />} onClick={() => handleRemoveMember(member.userId)}>
                      Eliminar
                    </Button>
                  )}
                </Box>
              );
            })}
          </Box>
        </Paper>
      </Container>

      <InviteMemberModal
        open={inviteModalOpen}
        onClose={() => setInviteModalOpen(false)}
        teamName={team.name}
        onInvited={handleInvited}
      />
    </Box>
  );
}