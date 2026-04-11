// src/app/register/page.tsx
'use client';
import { useState } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Link,
  Alert,
  InputAdornment,
  IconButton,
  Divider,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import BadgeIcon from '@mui/icons-material/Badge';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import Navbar from '@/components/Navbar';

export default function RegisterPage() {
  const router = useRouter();

  // Estado del formulario
  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    password: '',
    confirmPassword: '',
    nickname: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Manejar cambios en los campos
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError(''); // Limpiar error al escribir
  };

  // Validar correo institucional
  const validarCorreo = (correo: string): boolean => {
    return correo.endsWith('@alumno.ipn.mx');
  };

  // Manejar envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validaciones
    if (!formData.nombre || !formData.correo || !formData.password || !formData.confirmPassword) {
      setError('Todos los campos obligatorios deben ser llenados.');
      return;
    }

    if (!validarCorreo(formData.correo)) {
      setError('Debes usar tu correo institucional (@alumno.ipn.mx).');
      return;
    }

    if (formData.password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    // Simular registro (aquí irá la llamada al backend después)
    setLoading(true);
    try {
      // TODO: Conectar con el backend cuando esté listo
      // const response = await fetch('/api/auth/register', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData),
      // });

      // Simulación: espera 1 segundo y "registra"
      await new Promise((resolve) => setTimeout(resolve, 1000));

      console.log('Datos de registro:', formData);
      alert('¡Registro exitoso! (Simulado - sin backend)');
      router.push('/login');
    } catch (err) {
      setError('Error al registrar. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1A0A10 0%, #2A1520 50%, #1A0A10 100%)',
      }}
    >
      <Navbar />

      <Container maxWidth="sm" sx={{ py: 6 }}>
        <Paper
          elevation={0}
          sx={{
            p: 4,
            backgroundColor: 'rgba(42, 21, 32, 0.8)',
            border: '1px solid rgba(123, 30, 59, 0.3)',
            backdropFilter: 'blur(10px)',
          }}
        >
          {/* Encabezado */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <SportsEsportsIcon
              sx={{ fontSize: 48, color: '#D4A84B', mb: 1 }}
            />
            <Typography
              variant="h4"
              sx={{
                fontWeight: 800,
                background: 'linear-gradient(135deg, #D4A84B 0%, #E0C078 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Crea una nueva cuenta
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Únete a la comunidad de esports del IPN
            </Typography>
          </Box>

          {/* Mensaje de error */}
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {/* Formulario */}
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Nombre completo"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
              sx={{ mb: 2.5 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon sx={{ color: '#C4B0B8' }} />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              label="Correo Institucional"
              name="correo"
              type="email"
              value={formData.correo}
              onChange={handleChange}
              required
              placeholder="ejemplo@alumno.ipn.mx"
              helperText="Usa tu correo con dominio @alumno.ipn.mx"
              sx={{ mb: 2.5 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon sx={{ color: '#C4B0B8' }} />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              label="Contraseña"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange}
              required
              helperText="Mínimo 8 caracteres"
              sx={{ mb: 2.5 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon sx={{ color: '#C4B0B8' }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      sx={{ color: '#C4B0B8' }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              label="Confirmar contraseña"
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              sx={{ mb: 2.5 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon sx={{ color: '#C4B0B8' }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      edge="end"
                      sx={{ color: '#C4B0B8' }}
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              label="Nickname (opcional - para moderadores)"
              name="nickname"
              value={formData.nickname}
              onChange={handleChange}
              sx={{ mb: 3 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <BadgeIcon sx={{ color: '#C4B0B8' }} />
                  </InputAdornment>
                ),
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{
                py: 1.5,
                fontSize: '1.1rem',
                fontWeight: 700,
                mb: 2,
              }}
            >
              {loading ? 'Creando cuenta...' : 'Crear cuenta'}
            </Button>

            <Divider sx={{ my: 2, borderColor: 'rgba(123, 30, 59, 0.3)' }} />

            <Typography
              variant="body2"
              color="text.secondary"
              align="center"
            >
              ¿Ya tienes una cuenta?{' '}
              <Link
                component="button"
                type="button"
                variant="body2"
                onClick={() => router.push('/login')}
                sx={{
                  color: '#D4A84B',
                  textDecoration: 'none',
                  fontWeight: 600,
                  '&:hover': {
                    textDecoration: 'underline',
                  },
                }}
              >
                Ingresa aquí
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}