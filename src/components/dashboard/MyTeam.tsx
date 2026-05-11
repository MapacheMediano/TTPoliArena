'use client';
import {
  Paper, Typography, Box, Avatar, Button, Chip,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import StarIcon from '@mui/icons-material/Star';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';

interface TeamMember {
  nombre: string;
  nickname: string;
  rol: string;
}

interface TeamInfo {
  id: string;
  nombre: string;
  tag: string;
  juego: string;
  miembros: TeamMember[];
  esCopitan: boolean;
}

interface MyTeamProps {
  teams: TeamInfo[];
  onCreateTeam?: () => void;
}

export default function MyTeam({ teams, onCreateTeam }: MyTeamProps) {
  const router = useRouter();

  return (
    <Paper elevation={0} sx={{ p: 3, backgroundColor: 'rgba(42, 21, 32, 0.8)', border: '1px solid rgba(123, 30, 59, 0.3)' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, color: '#F5F0F2' }}>
          Mis Equipos
        </Typography>
        <Button size="small" onClick={() => router.push('/teams')} sx={{ color: '#D4A84B' }}>
          Ver todos
        </Button>
      </Box>

      {teams.length > 0 ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {teams.map((team) => (
            <Box key={team.id} onClick={() => router.push('/teams/' + team.id)}
              sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, borderRadius: 2, backgroundColor: 'rgba(26, 10, 16, 0.5)', cursor: 'pointer', transition: 'all 0.2s', '&:hover': { backgroundColor: 'rgba(123, 30, 59, 0.15)' } }}>
              <Avatar sx={{ width: 44, height: 44, background: 'linear-gradient(135deg, #D4A84B 0%, #E0C078 100%)', fontWeight: 800, fontSize: '0.85rem', color: '#1A0A10' }}>
                {team.tag}
              </Avatar>
              <Box sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: '#F5F0F2' }}>
                    {team.nombre}
                  </Typography>
                  {team.esCopitan && (
                    <Chip icon={<StarIcon sx={{ fontSize: '12px !important' }} />} label="Capitán" size="small"
                      sx={{ height: 18, fontSize: '0.65rem', backgroundColor: 'rgba(212, 168, 75, 0.2)', color: '#D4A84B', '& .MuiChip-icon': { color: '#D4A84B' } }} />
                  )}
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <SportsEsportsIcon sx={{ fontSize: 12, color: '#C4B0B8' }} />
                  <Typography variant="caption" color="text.secondary">
                    {team.juego} • {team.miembros.length} integrantes
                  </Typography>
                </Box>
              </Box>
            </Box>
          ))}
          <Button fullWidth variant="outlined" startIcon={<GroupAddIcon />} onClick={onCreateTeam}
            sx={{ mt: 1, borderColor: 'rgba(123, 30, 59, 0.5)', color: '#F5F0F2', '&:hover': { borderColor: '#7B1E3B', backgroundColor: 'rgba(123, 30, 59, 0.1)' } }}>
            Crear nuevo equipo
          </Button>
        </Box>
      ) : (
        <Box sx={{ textAlign: 'center', py: 4, borderRadius: 2, backgroundColor: 'rgba(26, 10, 16, 0.5)', border: '1px dashed rgba(123, 30, 59, 0.3)' }}>
          <GroupAddIcon sx={{ fontSize: 48, color: '#C4B0B8', mb: 1 }} />
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            No perteneces a ningún equipo
          </Typography>
          <Button variant="contained" startIcon={<GroupAddIcon />} onClick={onCreateTeam}>
            Crear equipo
          </Button>
        </Box>
      )}
    </Paper>
  );
}