// src/components/tournaments/StepRulesConfig.tsx
'use client';
import {
  Box,
  TextField,
  MenuItem,
  Typography,
  InputAdornment,
  Grid,
  Chip,
  Button,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import GroupsIcon from '@mui/icons-material/Groups';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PlaceIcon from '@mui/icons-material/Place';
import GavelIcon from '@mui/icons-material/Gavel';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import UploadFileIcon from '@mui/icons-material/UploadFile';

// Formatos de torneo según tu documento sección 3.11
const formatosTorneo = [
  { value: 'eliminacion_simple', label: 'Eliminación Simple', descripcion: 'Un equipo pierde y queda eliminado' },
  { value: 'eliminacion_doble', label: 'Eliminación Doble', descripcion: 'Se necesitan dos derrotas para ser eliminado' },
  { value: 'round_robin', label: 'Round Robin', descripcion: 'Todos juegan contra todos' },
];

interface StepRulesConfigProps {
  formData: {
    formato: string;
    maxEquipos: number;
    fechaInicio: string;
    fechaFin: string;
    modalidad: string;
    reglas: string;
    reglamentoPdf: File | null;
    premios: string;
  };
  onChange: (field: string, value: string | number) => void;
  errors: Record<string, string>;
}

export default function StepRulesConfig({ formData, onChange, errors }: StepRulesConfigProps) {
  return (
    <Box>
      <Typography variant="h6" sx={{ fontWeight: 700, color: '#F5F0F2', mb: 1 }}>
        Reglas y configuración
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Define el formato, fechas y reglas del torneo
      </Typography>

      {/* Formato del torneo */}
      <Typography variant="body2" sx={{ color: '#F5F0F2', mb: 1, fontWeight: 500 }}>
        Formato del torneo
      </Typography>
      <ToggleButtonGroup
        exclusive
        value={formData.formato}
        onChange={(_, value) => {
          if (value !== null) onChange('formato', value);
        }}
        sx={{
          mb: 1,
          display: 'flex',
          flexWrap: 'wrap',
          gap: 1,
          '& .MuiToggleButton-root': {
            flex: '1 1 auto',
            border: '1px solid rgba(123, 30, 59, 0.3)',
            borderRadius: '8px !important',
            color: '#C4B0B8',
            textTransform: 'none',
            py: 1.5,
            '&.Mui-selected': {
              backgroundColor: 'rgba(123, 30, 59, 0.3)',
              color: '#D4A84B',
              borderColor: '#7B1E3B',
              '&:hover': {
                backgroundColor: 'rgba(123, 30, 59, 0.4)',
              },
            },
            '&:hover': {
              backgroundColor: 'rgba(123, 30, 59, 0.1)',
            },
          },
        }}
      >
        {formatosTorneo.map((formato) => (
          <ToggleButton key={formato.value} value={formato.value}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {formato.label}
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.7, display: 'block' }}>
                {formato.descripcion}
              </Typography>
            </Box>
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
      {errors.formato && (
        <Typography variant="caption" color="error" sx={{ ml: 1 }}>
          {errors.formato}
        </Typography>
      )}

      <Box sx={{ mb: 3 }} />

      {/* Cantidad de equipos y modalidad */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="Máximo de equipos"
            type="number"
            value={formData.maxEquipos}
            onChange={(e) => onChange('maxEquipos', parseInt(e.target.value) || 0)}
            error={!!errors.maxEquipos}
            helperText={errors.maxEquipos || 'Ej: 8, 16, 32'}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <GroupsIcon sx={{ color: '#C4B0B8' }} />
                </InputAdornment>
              ),
              inputProps: { min: 2, max: 64 },
            }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            select
            label="Modalidad"
            value={formData.modalidad}
            onChange={(e) => onChange('modalidad', e.target.value)}
            error={!!errors.modalidad}
            helperText={errors.modalidad}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PlaceIcon sx={{ color: '#C4B0B8' }} />
                </InputAdornment>
              ),
            }}
          >
            <MenuItem value="Online">Online</MenuItem>
            <MenuItem value="Presencial">Presencial</MenuItem>
            <MenuItem value="Online / Final Presencial">Online / Final Presencial</MenuItem>
          </TextField>
        </Grid>
      </Grid>

      {/* Fechas */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="Fecha de inicio"
            type="date"
            value={formData.fechaInicio}
            onChange={(e) => onChange('fechaInicio', e.target.value)}
            error={!!errors.fechaInicio}
            helperText={errors.fechaInicio}
            InputLabelProps={{ shrink: true }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <CalendarTodayIcon sx={{ color: '#C4B0B8' }} />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="Fecha de fin"
            type="date"
            value={formData.fechaFin}
            onChange={(e) => onChange('fechaFin', e.target.value)}
            error={!!errors.fechaFin}
            helperText={errors.fechaFin}
            InputLabelProps={{ shrink: true }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <CalendarTodayIcon sx={{ color: '#C4B0B8' }} />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
      </Grid>

      {/* Reglamento PDF */}
      <Typography variant="body2" sx={{ color: '#F5F0F2', mb: 1, fontWeight: 500 }}>
        Reglamento del torneo (PDF)
      </Typography>
      <Box
        sx={{
          p: 3,
          borderRadius: 2,
          border: `1px dashed ${errors.reglamentoPdf ? '#FF6B6B' : 'rgba(123, 30, 59, 0.4)'}`,
          backgroundColor: 'rgba(26, 10, 16, 0.5)',
          textAlign: 'center',
          mb: 1,
        }}
      >
        {formData.reglamentoPdf ? (
          /* Archivo subido - mostrar info */
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
            <PictureAsPdfIcon sx={{ fontSize: 40, color: '#FF6B6B' }} />
            <Box sx={{ textAlign: 'left' }}>
              <Typography variant="body2" sx={{ color: '#F5F0F2', fontWeight: 600 }}>
                {formData.reglamentoPdf.name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {(formData.reglamentoPdf.size / 1024 / 1024).toFixed(2)} MB
              </Typography>
            </Box>
            <Button
              size="small"
              onClick={() => onChange('reglamentoPdf', null as any)}
              sx={{ color: '#FF6B6B', minWidth: 'auto' }}
            >
              Quitar
            </Button>
          </Box>
        ) : (
          /* Sin archivo - mostrar botón de subida */
          <>
            <UploadFileIcon sx={{ fontSize: 40, color: '#C4B0B8', mb: 1 }} />
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
              Sube el reglamento en formato PDF
            </Typography>
            <Button
              variant="outlined"
              component="label"
              startIcon={<GavelIcon />}
              sx={{
                borderColor: 'rgba(123, 30, 59, 0.5)',
                color: '#F5F0F2',
                '&:hover': {
                  borderColor: '#7B1E3B',
                  backgroundColor: 'rgba(123, 30, 59, 0.1)',
                },
              }}
            >
              Seleccionar PDF
              <input
                type="file"
                accept=".pdf"
                hidden
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    if (file.type !== 'application/pdf') {
                      alert('Solo se permiten archivos PDF');
                      return;
                    }
                    if (file.size > 10 * 1024 * 1024) {
                      alert('El archivo no debe superar los 10 MB');
                      return;
                    }
                    onChange('reglamentoPdf', file as any);
                  }
                }}
              />
            </Button>
          </>
        )}
      </Box>
      {errors.reglamentoPdf && (
        <Typography variant="caption" color="error" sx={{ ml: 1 }}>
          {errors.reglamentoPdf}
        </Typography>
      )}
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 3, ml: 1 }}>
        Máximo 10 MB. Los participantes podrán descargarlo desde la página del torneo.
      </Typography>
     

      {/* Premios */}
      <TextField
        fullWidth
        label="Premios (opcional)"
        value={formData.premios}
        onChange={(e) => onChange('premios', e.target.value)}
        multiline
        rows={2}
        helperText="Describe los premios para los ganadores (si aplica)"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <CardGiftcardIcon sx={{ color: '#C4B0B8', alignSelf: 'flex-start', mt: 1 }} />
            </InputAdornment>
          ),
        }}
      />
    </Box>
  );
}