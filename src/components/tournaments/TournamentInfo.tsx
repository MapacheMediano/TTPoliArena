// src/components/tournaments/TournamentInfo.tsx
'use client';
import {
  Box,
  Typography,
  Paper,
  Button,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
} from '@mui/material';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DownloadIcon from '@mui/icons-material/Download';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import PersonIcon from '@mui/icons-material/Person';
import SchoolIcon from '@mui/icons-material/School';
import StarIcon from '@mui/icons-material/Star';

interface TeamInscribed {
  nombre: string;
  tag: string;
  capitan: string;
  miembros: number;
}

interface TournamentInfoProps {
  tournament: {
    descripcion: string;
    reglamentoPdfUrl: string | null;
    premios: string;
    organizador: string;
    organizadorUnidad: string;
  };
  teamsInscribed: TeamInscribed[];
}

export default function TournamentInfo({ tournament, teamsInscribed }: TournamentInfoProps) {
  // Simular descarga de PDF
  const handleDownloadPdf = () => {
    if (tournament.reglamentoPdfUrl) {
      // TODO: Cuando haya backend, esto abrirá el PDF real
      // window.open(tournament.reglamentoPdfUrl, '_blank');
      alert('Descarga de PDF simulada. Cuando haya backend se descargará el archivo real.');
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Descripción */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          backgroundColor: 'rgba(42, 21, 32, 0.8)',
          border: '1px solid rgba(123, 30, 59, 0.3)',
        }}
      >
        <Typography
          variant="h6"
          sx={{ fontWeight: 700, color: '#F5F0F2', mb: 2 }}
        >
          Descripción
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: '#C4B0B8', whiteSpace: 'pre-line', lineHeight: 1.8 }}
        >
          {tournament.descripcion}
        </Typography>
      </Paper>

      {/* Reglamento PDF */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          backgroundColor: 'rgba(42, 21, 32, 0.8)',
          border: '1px solid rgba(123, 30, 59, 0.3)',
        }}
      >
        <Typography
          variant="h6"
          sx={{ fontWeight: 700, color: '#F5F0F2', mb: 2 }}
        >
          Reglamento
        </Typography>

        {tournament.reglamentoPdfUrl ? (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              p: 2,
              borderRadius: 2,
              backgroundColor: 'rgba(26, 10, 16, 0.5)',
              border: '1px solid rgba(123, 30, 59, 0.2)',
              flexWrap: 'wrap',
              gap: 2,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <PictureAsPdfIcon sx={{ fontSize: 40, color: '#FF6B6B' }} />
              <Box>
                <Typography
                  variant="body1"
                  sx={{ color: '#F5F0F2', fontWeight: 600 }}
                >
                  Reglamento del torneo
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  PDF • Lee las bases antes de inscribirte
                </Typography>
              </Box>
            </Box>
            <Button
              variant="contained"
              startIcon={<DownloadIcon />}
              onClick={handleDownloadPdf}
              sx={{
                background: 'linear-gradient(135deg, #FF6B6B 0%, #CC4444 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #CC4444 0%, #AA2222 100%)',
                },
              }}
            >
              Descargar PDF
            </Button>
          </Box>
        ) : (
          <Typography variant="body2" color="text.secondary">
            El organizador no ha subido un reglamento para este torneo.
          </Typography>
        )}

        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ display: 'block', mt: 1.5 }}
        >
          ⚠️ Es obligatorio leer el reglamento antes de inscribirse al torneo.
        </Typography>
      </Paper>

      {/* Premios */}
      {tournament.premios && (
        <Paper
          elevation={0}
          sx={{
            p: 3,
            backgroundColor: 'rgba(42, 21, 32, 0.8)',
            border: '1px solid rgba(123, 30, 59, 0.3)',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <CardGiftcardIcon sx={{ color: '#D4A84B' }} />
            <Typography
              variant="h6"
              sx={{ fontWeight: 700, color: '#F5F0F2' }}
            >
              Premios
            </Typography>
          </Box>
          <Typography
            variant="body2"
            sx={{ color: '#C4B0B8', whiteSpace: 'pre-line', lineHeight: 1.8 }}
          >
            {tournament.premios}
          </Typography>
        </Paper>
      )}

      {/* Organizador */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          backgroundColor: 'rgba(42, 21, 32, 0.8)',
          border: '1px solid rgba(123, 30, 59, 0.3)',
        }}
      >
        <Typography
          variant="h6"
          sx={{ fontWeight: 700, color: '#F5F0F2', mb: 2 }}
        >
          Organizador
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar
            sx={{
              width: 48,
              height: 48,
              background: 'linear-gradient(135deg, #7B1E3B 0%, #D4A84B 100%)',
            }}
          >
            {tournament.organizador[0]}
          </Avatar>
          <Box>
            <Typography
              variant="body1"
              sx={{ color: '#F5F0F2', fontWeight: 600 }}
            >
              {tournament.organizador}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <SchoolIcon sx={{ fontSize: 14, color: '#C4B0B8' }} />
              <Typography variant="caption" color="text.secondary">
                {tournament.organizadorUnidad}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Paper>

      {/* Equipos inscritos */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          backgroundColor: 'rgba(42, 21, 32, 0.8)',
          border: '1px solid rgba(123, 30, 59, 0.3)',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 2,
          }}
        >
          <Typography
            variant="h6"
            sx={{ fontWeight: 700, color: '#F5F0F2' }}
          >
            Equipos inscritos
          </Typography>
          <Chip
            label={`${teamsInscribed.length} equipos`}
            size="small"
            sx={{
              backgroundColor: 'rgba(212, 168, 75, 0.15)',
              color: '#D4A84B',
              fontWeight: 600,
            }}
          />
        </Box>

        {teamsInscribed.length > 0 ? (
          <List disablePadding>
            {teamsInscribed.map((team, index) => (
              <Box key={index}>
                <ListItem
                  sx={{
                    px: 1.5,
                    py: 1,
                    borderRadius: 1,
                    '&:hover': {
                      backgroundColor: 'rgba(26, 10, 16, 0.5)',
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 44 }}>
                    <Avatar
                      sx={{
                        width: 32,
                        height: 32,
                        fontSize: '0.75rem',
                        fontWeight: 800,
                        background:
                          'linear-gradient(135deg, #D4A84B 0%, #E0C078 100%)',
                        color: '#1A0A10',
                      }}
                    >
                      {team.tag}
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography
                        variant="body2"
                        sx={{ color: '#F5F0F2', fontWeight: 600 }}
                      >
                        {team.nombre}
                      </Typography>
                    }
                    secondary={
                      <Box
                        component="span"
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.5,
                          mt: 0.25,
                        }}
                      >
                        <StarIcon sx={{ fontSize: 12, color: '#D4A84B' }} />
                        <Typography component="span" variant="caption" color="text.secondary">
                          Cap: {team.capitan} • {team.miembros} integrantes
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
                {index < teamsInscribed.length - 1 && (
                  <Divider
                    sx={{ borderColor: 'rgba(123, 30, 59, 0.1)', mx: 1 }}
                  />
                )}
              </Box>
            ))}
          </List>
        ) : (
          <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
            Aún no hay equipos inscritos. ¡Sé el primero!
          </Typography>
        )}
      </Paper>
    </Box>
  );
}