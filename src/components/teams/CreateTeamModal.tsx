// src/components/teams/CreateTeamModal.tsx
'use client';
import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  TextField,
  Button,
  Box,
  MenuItem,
  Alert,
  InputAdornment,
} from '@mui/material';
import GroupsIcon from '@mui/icons-material/Groups';
import LabelIcon from '@mui/icons-material/Label';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

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

interface CreateTeamModalProps {
  open: boolean;
  onClose: () => void;
  onCreated: (team: { nombre: string; tag: string; juego: string }) => void;
}

export default function CreateTeamModal({ open, onClose, onCreated }: CreateTeamModalProps) {
  const [formData, setFormData] = useState({
    nombre: '',
    tag: '',
    juego: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre del equipo es obligatorio';
    }
    if (!formData.tag.trim()) {
      newErrors.tag = 'El tag es obligatorio';
    }
    if (formData.tag.length > 4) {
      newErrors.tag = 'El tag debe tener máximo 4 caracteres';
    }
    if (!formData.juego) {
      newErrors.juego = 'Selecciona un juego';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      // TODO: Conectar con el backend
      // const response = await fetch('/api/teams', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData),
      // });

      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log('Equipo creado:', formData);
      setSuccess(true);

      setTimeout(() => {
        onCreated(formData);
        handleClose();
      }, 1500);
    } catch (err) {
      setErrors({ general: 'Error al crear el equipo. Intenta de nuevo.' });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({ nombre: '', tag: '', juego: '' });
    setErrors({});
    setSuccess(false);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: '#2A1520',
          border: '1px solid rgba(123, 30, 59, 0.3)',
          backgroundImage: 'none',
        },
      }}
    >
      <DialogTitle>
        <Typography variant="h6" sx={{ fontWeight: 700, color: '#F5F0F2' }}>
          Crear nuevo equipo
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Tú serás el capitán del equipo automáticamente
        </Typography>
      </DialogTitle>

      <DialogContent>
        {success ? (
          <Box sx={{ textAlign: 'center', py: 3 }}>
            <CheckCircleIcon sx={{ fontSize: 64, color: '#4CAF50', mb: 2 }} />
            <Typography variant="h6" sx={{ color: '#4CAF50', fontWeight: 700, mb: 1 }}>
              ¡Equipo creado exitosamente!
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Ahora puedes invitar integrantes a tu equipo.
            </Typography>
          </Box>
        ) : (
          <Box sx={{ pt: 1 }}>
            {errors.general && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {errors.general}
              </Alert>
            )}

            <TextField
              fullWidth
              label="Nombre del equipo"
              value={formData.nombre}
              onChange={(e) => handleChange('nombre', e.target.value)}
              error={!!errors.nombre}
              helperText={errors.nombre || 'Ej: ESCOM Elite'}
              sx={{ mb: 2.5 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <GroupsIcon sx={{ color: '#C4B0B8' }} />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              label="Tag del equipo"
              value={formData.tag}
              onChange={(e) => handleChange('tag', e.target.value.toUpperCase())}
              error={!!errors.tag}
              helperText={errors.tag || 'Máximo 4 caracteres (ej: ELT, PLG)'}
              sx={{ mb: 2.5 }}
              inputProps={{ maxLength: 4 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LabelIcon sx={{ color: '#C4B0B8' }} />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              select
              label="Juego principal"
              value={formData.juego}
              onChange={(e) => handleChange('juego', e.target.value)}
              error={!!errors.juego}
              helperText={errors.juego || 'El juego principal en el que competirá tu equipo'}
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
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        {success ? (
          <Button variant="contained" onClick={handleClose} fullWidth>
            Cerrar
          </Button>
        ) : (
          <>
            <Button onClick={handleClose} sx={{ color: '#C4B0B8' }}>
              Cancelar
            </Button>
            <Button variant="contained" onClick={handleSubmit} disabled={loading}>
              {loading ? 'Creando...' : 'Crear equipo'}
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
}