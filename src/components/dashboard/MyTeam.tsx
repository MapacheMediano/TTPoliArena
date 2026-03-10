// src/components/dashboard/MyTeam.tsx
'use client';
import {
  Paper,
  Typography,
  Box,
  Avatar,
  AvatarGroup,
  Button,
  Chip,
} from '@mui/material';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import StarIcon from '@mui/icons-material/Star';

interface TeamMember {
  nombre: string;
  nickname: string;
  rol: string; // 'Capitán' | 'Miembro'
}

interface MyTeamProps {
  team: {
    nombre: string;
    tag: string;
    juego: string;
    miembros: TeamMember[];
  } | null;
  onManageTeam?: () => void;
  onCreateTeam?: () => void;
}

export default function MyTeam({ team, onManageTeam, onCreateTeam }: MyTeamProps) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        backgroundColor: 'rgba(42, 21, 32, 0.8)',
        border: '1px solid rgba(123, 30, 59, 0.3)',
        height: '100%',
      }}
    >
      <Typography
        variant="h6"
        sx={{ fontWeight: 700, color: '#F5F0F2', mb: 3 }}
      >
        Mi Equipo
      </Typography>

      {team ? (
        <>
          {/* Info del equipo */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              mb: 2,
              p: 2,
              borderRadius: 2,
              backgroundColor: 'rgba(26, 10, 16, 0.5)',
            }}
          >
            <Avatar
              sx={{
                width: 48,
                height: 48,
                background: 'linear-gradient(135deg, #D4A84B 0%, #E0C078 100%)',
                fontWeight: 800,
                fontSize: '1rem',
                color: '#1A0A10',
              }}
            >
              {team.tag}
            </Avatar>
            <Box>
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: 700, color: '#F5F0F2' }}
              >
                {team.nombre}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {team.juego} • {team.miembros.length} integrantes
              </Typography>
            </Box>
          </Box>

          {/* Miembros */}
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 1.5 }}
          >
            Integrantes
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
            {team.miembros.map((miembro, index) => (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  p: 1,
                  borderRadius: 1,
                  backgroundColor: 'rgba(26, 10, 16, 0.3)',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Avatar
                    sx={{
                      width: 28,
                      height: 28,
                      fontSize: '0.75rem',
                      backgroundColor:
                        miembro.rol === 'Capitán'
                          ? '#D4A84B'
                          : 'rgba(123, 30, 59, 0.5)',
                      color: miembro.rol === 'Capitán' ? '#1A0A10' : '#F5F0F2',
                    }}
                  >
                    {miembro.nombre[0]}
                  </Avatar>
                  <Box>
                    <Typography
                      variant="body2"
                      sx={{ color: '#F5F0F2', fontWeight: 500, lineHeight: 1.2 }}
                    >
                      {miembro.nombre}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      @{miembro.nickname}
                    </Typography>
                  </Box>
                </Box>
                {miembro.rol === 'Capitán' && (
                  <Chip
                    icon={<StarIcon sx={{ fontSize: 14 }} />}
                    label="Capitán"
                    size="small"
                    sx={{
                      height: 22,
                      fontSize: '0.65rem',
                      backgroundColor: 'rgba(212, 168, 75, 0.15)',
                      color: '#D4A84B',
                      '& .MuiChip-icon': { color: '#D4A84B' },
                    }}
                  />
                )}
              </Box>
            ))}
          </Box>

          {/* Botón gestionar */}
          <Button
            fullWidth
            variant="outlined"
            onClick={onManageTeam}
            sx={{
              borderColor: 'rgba(123, 30, 59, 0.5)',
              color: '#F5F0F2',
              '&:hover': {
                borderColor: '#7B1E3B',
                backgroundColor: 'rgba(123, 30, 59, 0.1)',
              },
            }}
          >
            Gestionar equipo
          </Button>
        </>
      ) : (
        /* Sin equipo */
        <Box
          sx={{
            textAlign: 'center',
            py: 4,
            borderRadius: 2,
            backgroundColor: 'rgba(26, 10, 16, 0.5)',
            border: '1px dashed rgba(123, 30, 59, 0.3)',
          }}
        >
          <GroupAddIcon
            sx={{ fontSize: 48, color: '#C4B0B8', mb: 1 }}
          />
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            No perteneces a ningún equipo
          </Typography>
          <Button
            variant="contained"
            startIcon={<GroupAddIcon />}
            onClick={onCreateTeam}
          >
            Crear equipo
          </Button>
        </Box>
      )}
    </Paper>
  );
}