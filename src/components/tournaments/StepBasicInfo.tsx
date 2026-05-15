'use client';
import {
  Box, TextField, MenuItem, Typography, InputAdornment, Button, CircularProgress,
} from '@mui/material';
import { useState } from 'react';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import DescriptionIcon from '@mui/icons-material/Description';
import ImageIcon from '@mui/icons-material/Image';
import UploadFileIcon from '@mui/icons-material/UploadFile';

const juegosDisponibles = [
  'Valorant', 'League of Legends', 'Rocket League', 'Overwatch',
  'Marvel Rivals', 'Fortnite', 'Clash Royale', 'Super Smash Bros',
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
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadError('Solo se permiten imágenes');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setUploadError('La imagen no debe superar los 5 MB');
      return;
    }

    setUploading(true);
    setUploadError('');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!);

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: 'POST', body: formData }
      );
      const data = await res.json();

      if (data.secure_url) {
        onChange('imagenUrl', data.secure_url);
      } else {
        setUploadError('Error al subir la imagen');
      }
    } catch (error) {
      setUploadError('Error de conexión al subir la imagen');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ fontWeight: 700, color: '#F5F0F2', mb: 1 }}>
        Información del torneo
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Define el nombre, juego y descripción de tu torneo
      </Typography>

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
          <MenuItem key={juego} value={juego}>{juego}</MenuItem>
        ))}
      </TextField>

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

      {/* Upload de imagen */}
      <Typography variant="body2" sx={{ color: '#F5F0F2', mb: 1, fontWeight: 500 }}>
        Imagen del torneo (opcional)
      </Typography>
      <Box sx={{ p: 3, borderRadius: 2, border: '1px dashed rgba(123, 30, 59, 0.4)', backgroundColor: 'rgba(26, 10, 16, 0.5)', textAlign: 'center', mb: 2 }}>
        {formData.imagenUrl ? (
          <Box>
            <Box component="img" src={formData.imagenUrl} alt="Preview"
              sx={{ width: '100%', height: 180, objectFit: 'cover', borderRadius: 1, mb: 1 }} />
            <Button size="small" onClick={() => onChange('imagenUrl', '')} sx={{ color: '#FF6B6B' }}>
              Quitar imagen
            </Button>
          </Box>
        ) : (
          <>
            {uploading ? (
              <Box sx={{ py: 2 }}>
                <CircularProgress sx={{ color: '#D4A84B' }} size={32} />
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Subiendo imagen...
                </Typography>
              </Box>
            ) : (
              <>
                <ImageIcon sx={{ fontSize: 40, color: '#C4B0B8', mb: 1 }} />
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                  Sube una imagen para el banner del torneo
                </Typography>
                <Button variant="outlined" component="label" startIcon={<UploadFileIcon />}
                  sx={{ borderColor: 'rgba(123, 30, 59, 0.5)', color: '#F5F0F2', '&:hover': { borderColor: '#7B1E3B', backgroundColor: 'rgba(123, 30, 59, 0.1)' } }}>
                  Seleccionar imagen
                  <input type="file" accept="image/*" hidden onChange={handleImageUpload} />
                </Button>
              </>
            )}
          </>
        )}
        {uploadError && (
          <Typography variant="caption" color="error" sx={{ display: 'block', mt: 1 }}>
            {uploadError}
          </Typography>
        )}
      </Box>
      <Typography variant="caption" color="text.secondary">
        Máximo 5 MB. Formatos: JPG, PNG, WebP.
      </Typography>
    </Box>
  );
}