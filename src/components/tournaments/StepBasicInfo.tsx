// src/components/tournaments/StepBasicInfo.tsx
'use client';
import {
  Box,
  TextField,
  MenuItem,
  Typography,
  InputAdornment,
  Grid,
} from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import DescriptionIcon from '@mui/icons-material/Description';
import ImageIcon from '@mui/icons-material/Image';

// Lista de juegos disponibles en el IPN (según tu documento sección 3.12)
const juegosDisponibles = [
  'Valorant',
  'League of Legends',
  'Rocket League',
  'Overwatch',
  'Marvel Rivals',
  'Fortnite',
  'Clash Royale',
  'Super Smash Bros',
];

interface StepBasicInfoProps {
  formData: {
    nombre: string;
    juego: string;
    descripcion: string;
    imagenUrl: string;
  };
  onChange: (field: string, value: string) => void;
  errors: Record<string, string>;
}

export default function StepBasicInfo({ formData, onChange, errors }: StepBasicInfoProps) {
  return (
    <Box>
      <Typography variant="h6" sx={{ fontWeight: 700, color: '#F5F0F2', mb: 1 }}>
        Información del torneo
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Define el nombre, juego y descripción de tu torneo
      </Typography>

      {/* Nombre del torneo */}
      <TextField
        fullWidth
        label="Nombre del torneo"
        value={formData.nombre}
        onChange={(e) => onChange('nombre', e.target.value)}
        error={!!errors.nombre}
        helperText={errors.nombre || 'Ej: Interpolitécnicos 2025 - Valorant'}
        sx={{ mb: 3 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <EmojiEventsIcon sx={{ color: '#C4B0B8' }} />
            </InputAdornment>
          ),
        }}
      />

      {/* Juego */}
      <TextField
        fullWidth
        select
        label="Videojuego"
        value={formData.juego}
        onChange={(e) => onChange('juego', e.target.value)}
        error={!!errors.juego}
        helperText={errors.juego || 'Selecciona el juego del torneo'}
        sx={{ mb: 3 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SportsEsportsIcon sx={{ color: '#C4B0B8' }} />
            </InputAdornment>
          ),
        }}
      >
        {juegosDisponibles.map((juego) => (
          <MenuItem key={juego} value={juego}>
            {juego}
          </MenuItem>
        ))}
      </TextField>

      {/* Descripción */}
      <TextField
        fullWidth
        label="Descripción del torneo"
        value={formData.descripcion}
        onChange={(e) => onChange('descripcion', e.target.value)}
        multiline
        rows={4}
        error={!!errors.descripcion}
        helperText={errors.descripcion || 'Describe brevemente de qué trata el torneo'}
        sx={{ mb: 3 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <DescriptionIcon sx={{ color: '#C4B0B8', alignSelf: 'flex-start', mt: 1 }} />
            </InputAdornment>
          ),
        }}
      />

      {/* URL de imagen (opcional) */}
      <TextField
        fullWidth
        label="URL de imagen del torneo (opcional)"
        value={formData.imagenUrl}
        onChange={(e) => onChange('imagenUrl', e.target.value)}
        placeholder="https://ejemplo.com/imagen-torneo.jpg"
        helperText="Pega la URL de una imagen para el banner del torneo, o déjalo vacío"
        sx={{ mb: 2 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <ImageIcon sx={{ color: '#C4B0B8' }} />
            </InputAdornment>
          ),
        }}
      />

      {/* Preview de imagen si hay URL */}
      {formData.imagenUrl && (
        <Box
          sx={{
            mt: 1,
            borderRadius: 2,
            overflow: 'hidden',
            border: '1px solid rgba(123, 30, 59, 0.3)',
            maxHeight: 200,
          }}
        >
          <Box
            component="img"
            src={formData.imagenUrl}
            alt="Preview"
            sx={{
              width: '100%',
              height: 200,
              objectFit: 'cover',
            }}
            onError={(e: any) => {
              e.target.style.display = 'none';
            }}
          />
        </Box>
      )}
    </Box>
  );
}