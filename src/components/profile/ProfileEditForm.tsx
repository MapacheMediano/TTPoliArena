// src/components/profile/ProfileEditForm.tsx
'use client';
import { useState } from 'react';
import {
  Paper,
  Box,
  Typography,
  TextField,
  Button,
  MenuItem,
  InputAdornment,
  Alert,
  Chip,
  Checkbox,
  FormControlLabel,
  FormGroup,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import PersonIcon from '@mui/icons-material/Person';
import BadgeIcon from '@mui/icons-material/Badge';
import SchoolIcon from '@mui/icons-material/School';
import { UserProfile } from './ProfileView';

const unidadesAcademicas = [
  'ESCOM - Escuela Superior de Cómputo',
  'ESIME Zacatenco - Ing. Eléctrica',
  'ESIME Zacatenco - Ing. Comunicaciones y Electrónica',
  'ESIME Culhuacán',
  'ESIA Zacatenco',
  'ESIA Tecamachalco',
  'ENCB - Escuela Nacional de Ciencias Biológicas',
  'ESCA Santo Tomás',
  'ESCA Tepepan',
  'ESFM - Escuela Superior de Física y Matemáticas',
  'EST - Escuela Superior de Turismo',
  'UPIICSA',
  'UPIITA',
  'UPIBI',
  'UPIIG',
  'UPIIH',
  'UPIIZ',
  'CIC - Centro de Investigación en Computación',
];

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

interface ProfileEditFormProps {
  user: UserProfile;
  onSave: (updatedUser: Partial<UserProfile>) => void;
  onCancel: () => void;
}

export default function ProfileEditForm({ user, onSave, onCancel }: ProfileEditFormProps) {
  const [formData, setFormData] = useState({
    nombre: user.nombre,
    nickname: user.nickname,
    unidadAcademica: user.unidadAcademica,
    juegosFavoritos: [...user.juegosFavoritos],
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

  const handleToggleJuego = (juego: string) => {
    setFormData((prev) => {
      const current = prev.juegosFavoritos;
      if (current.includes(juego)) {
        return { ...prev, juegosFavoritos: current.filter((j) => j !== juego) };
      } else {
        return { ...prev, juegosFavoritos: [...current, juego] };
      }
    });
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es obligatorio';
    }
    if (!formData.nickname.trim()) {
      newErrors.nickname = 'El nickname es obligatorio';
    }
    if (formData.nickname.length < 3) {
      newErrors.nickname = 'El nickname debe tener al menos 3 caracteres';
    }
    if (!formData.unidadAcademica) {
      newErrors.unidadAcademica = 'Selecciona tu unidad académica';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      // TODO: Conectar con el backend
      // const response = await fetch('/api/users/profile', {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData),
      // });

      // Simulación
      await new Promise((resolve) => setTimeout(resolve, 1000));

      console.log('Perfil actualizado:', formData);
      setSuccess(true);

      setTimeout(() => {
        onSave(formData);
      }, 1000);
    } catch (err) {
      setErrors({ general: 'Error al guardar. Intenta de nuevo.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        backgroundColor: 'rgba(42, 21, 32, 0.8)',
        border: '1px solid rgba(123, 30, 59, 0.3)',
      }}
    >
      <Typography variant="h6" sx={{ fontWeight: 700, color: '#F5F0F2', mb: 1 }}>
        Editar perfil
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Modifica tu información personal y preferencias
      </Typography>

      {errors.general && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errors.general}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          ¡Perfil actualizado correctamente!
        </Alert>
      )}

      {/* Nombre */}
      <TextField
        fullWidth
        label="Nombre completo"
        value={formData.nombre}
        onChange={(e) => handleChange('nombre', e.target.value)}
        error={!!errors.nombre}
        helperText={errors.nombre}
        sx={{ mb: 2.5 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <PersonIcon sx={{ color: '#C4B0B8' }} />
            </InputAdornment>
          ),
        }}
      />

      {/* Nickname */}
      <TextField
        fullWidth
        label="Nickname"
        value={formData.nickname}
        onChange={(e) => handleChange('nickname', e.target.value)}
        error={!!errors.nickname}
        helperText={errors.nickname || 'Este es tu nombre visible para otros jugadores'}
        sx={{ mb: 2.5 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <BadgeIcon sx={{ color: '#C4B0B8' }} />
            </InputAdornment>
          ),
        }}
      />

      {/* Correo (no editable) */}
      <TextField
        fullWidth
        label="Correo institucional"
        value={user.correo}
        disabled
        helperText="El correo institucional no se puede modificar"
        sx={{
          mb: 2.5,
          '& .MuiInputBase-input.Mui-disabled': {
            WebkitTextFillColor: '#C4B0B8',
          },
        }}
      />

      {/* Unidad académica */}
      <TextField
        fullWidth
        select
        label="Unidad académica"
        value={formData.unidadAcademica}
        onChange={(e) => handleChange('unidadAcademica', e.target.value)}
        error={!!errors.unidadAcademica}
        helperText={errors.unidadAcademica}
        sx={{ mb: 3 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SchoolIcon sx={{ color: '#C4B0B8' }} />
            </InputAdornment>
          ),
        }}
      >
        {unidadesAcademicas.map((unidad) => (
          <MenuItem key={unidad} value={unidad}>
            {unidad}
          </MenuItem>
        ))}
      </TextField>

      {/* Juegos favoritos */}
      <Typography variant="subtitle2" sx={{ color: '#D4A84B', fontWeight: 600, mb: 1 }}>
        Juegos favoritos
      </Typography>
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1.5 }}>
        Selecciona los juegos en los que te interesa competir
      </Typography>
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 1,
          mb: 3,
          p: 2,
          borderRadius: 2,
          backgroundColor: 'rgba(26, 10, 16, 0.5)',
          border: '1px solid rgba(123, 30, 59, 0.15)',
        }}
      >
        {juegosDisponibles.map((juego) => {
          const isSelected = formData.juegosFavoritos.includes(juego);
          return (
            <Chip
              key={juego}
              label={juego}
              onClick={() => handleToggleJuego(juego)}
              sx={{
                backgroundColor: isSelected
                  ? 'rgba(212, 168, 75, 0.2)'
                  : 'rgba(42, 21, 32, 0.5)',
                color: isSelected ? '#D4A84B' : '#C4B0B8',
                border: isSelected
                  ? '1px solid #D4A84B'
                  : '1px solid rgba(123, 30, 59, 0.3)',
                fontWeight: isSelected ? 600 : 400,
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: isSelected
                    ? 'rgba(212, 168, 75, 0.3)'
                    : 'rgba(123, 30, 59, 0.2)',
                },
              }}
            />
          );
        })}
      </Box>

      {/* Botones */}
      <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'flex-end' }}>
        <Button
          startIcon={<CancelIcon />}
          onClick={onCancel}
          sx={{ color: '#C4B0B8' }}
          disabled={loading}
        >
          Cancelar
        </Button>
        <Button
          variant="contained"
          startIcon={<SaveIcon />}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? 'Guardando...' : 'Guardar cambios'}
        </Button>
      </Box>
    </Paper>
  );
}