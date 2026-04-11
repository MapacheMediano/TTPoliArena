// src/components/tournaments/StepReview.tsx
'use client';
import {
  Box,
  Typography,
  Chip,
  Divider,
  Paper,
} from '@mui/material';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import GroupsIcon from '@mui/icons-material/Groups';
import PlaceIcon from '@mui/icons-material/Place';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import GavelIcon from '@mui/icons-material/Gavel';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';

const formatoLabels: Record<string, string> = {
  eliminacion_simple: 'Eliminación Simple',
  eliminacion_doble: 'Eliminación Doble',
  round_robin: 'Round Robin',
};

interface StepReviewProps {
  formData: {
    nombre: string;
    juego: string;
    descripcion: string;
    imagenUrl: string;
    formato: string;
    maxEquipos: number;
    fechaInicio: string;
    fechaFin: string;
    modalidad: string;
    reglas: string;
    reglamentoPdf: File | null;
    premios: string;
  };
}

export default function StepReview({ formData }: StepReviewProps) {
  // Función para formatear fecha de yyyy-mm-dd a dd/mm/yyyy
  const formatDate = (dateStr: string) => {
    if (!dateStr) return 'No definida';
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
  };

  const InfoRow = ({
    icon,
    label,
    value,
  }: {
    icon: React.ReactNode;
    label: string;
    value: string;
  }) => (
    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, mb: 2 }}>
      <Box sx={{ color: '#D4A84B', mt: 0.3 }}>{icon}</Box>
      <Box>
        <Typography variant="caption" color="text.secondary">
          {label}
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: '#F5F0F2', whiteSpace: 'pre-line' }}
        >
          {value || 'No especificado'}
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Box>
      <Typography variant="h6" sx={{ fontWeight: 700, color: '#F5F0F2', mb: 1 }}>
        Revisar y publicar
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Verifica que toda la información sea correcta antes de publicar
      </Typography>

      {/* Banner preview */}
      {formData.imagenUrl && (
        <Box
          sx={{
            mb: 3,
            borderRadius: 2,
            overflow: 'hidden',
            border: '1px solid rgba(123, 30, 59, 0.3)',
          }}
        >
          <Box
            component="img"
            src={formData.imagenUrl}
            alt="Banner del torneo"
            sx={{
              width: '100%',
              height: 180,
              objectFit: 'cover',
              filter: 'brightness(0.8)',
            }}
          />
        </Box>
      )}

      {/* Nombre del torneo */}
      <Typography
        variant="h5"
        sx={{
          fontWeight: 800,
          color: '#F5F0F2',
          mb: 0.5,
        }}
      >
        {formData.nombre || 'Sin nombre'}
      </Typography>

      {/* Chips de estado */}
      <Box sx={{ display: 'flex', gap: 1, mb: 3, flexWrap: 'wrap' }}>
        <Chip
          label={formData.juego || 'Sin juego'}
          size="small"
          icon={<SportsEsportsIcon sx={{ fontSize: 16 }} />}
          sx={{
            backgroundColor: 'rgba(212, 168, 75, 0.15)',
            color: '#D4A84B',
            '& .MuiChip-icon': { color: '#D4A84B' },
          }}
        />
        <Chip
          label={formatoLabels[formData.formato] || 'Sin formato'}
          size="small"
          variant="outlined"
          sx={{ borderColor: 'rgba(123, 30, 59, 0.4)', color: '#C4B0B8' }}
        />
        <Chip
          label="Borrador"
          size="small"
          sx={{
            backgroundColor: 'rgba(33, 150, 243, 0.15)',
            color: '#2196F3',
          }}
        />
      </Box>

      <Divider sx={{ borderColor: 'rgba(123, 30, 59, 0.2)', mb: 3 }} />

      {/* Descripción */}
      {formData.descripcion && (
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 0.5 }}
          >
            Descripción
          </Typography>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              backgroundColor: 'rgba(26, 10, 16, 0.5)',
              border: '1px solid rgba(123, 30, 59, 0.15)',
            }}
          >
            <Typography variant="body2" sx={{ color: '#F5F0F2', whiteSpace: 'pre-line' }}>
              {formData.descripcion}
            </Typography>
          </Paper>
        </Box>
      )}

      {/* Detalles */}
      <Box
        sx={{
          p: 2.5,
          borderRadius: 2,
          backgroundColor: 'rgba(26, 10, 16, 0.5)',
          border: '1px solid rgba(123, 30, 59, 0.15)',
        }}
      >
        <InfoRow
          icon={<CalendarTodayIcon sx={{ fontSize: 18 }} />}
          label="Fecha de inicio"
          value={formatDate(formData.fechaInicio)}
        />
        <InfoRow
          icon={<CalendarTodayIcon sx={{ fontSize: 18 }} />}
          label="Fecha de fin"
          value={formatDate(formData.fechaFin)}
        />
        <InfoRow
          icon={<GroupsIcon sx={{ fontSize: 18 }} />}
          label="Máximo de equipos"
          value={`${formData.maxEquipos} equipos`}
        />
        <InfoRow
          icon={<PlaceIcon sx={{ fontSize: 18 }} />}
          label="Modalidad"
          value={formData.modalidad}
        />
        <InfoRow
          icon={<FormatListNumberedIcon sx={{ fontSize: 18 }} />}
          label="Formato"
          value={formatoLabels[formData.formato] || 'No definido'}
        />

        <InfoRow
          icon={<GavelIcon sx={{ fontSize: 18 }} />}
          label="Reglamento"
          value={formData.reglamentoPdf ? `📄 ${formData.reglamentoPdf.name}` : 'No adjunto'}
        />

        {formData.premios && (
          <InfoRow
            icon={<CardGiftcardIcon sx={{ fontSize: 18 }} />}
            label="Premios"
            value={formData.premios}
          />
        )}
      </Box>
    </Box>
  );
}