// src/app/login/page.tsx
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
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import Navbar from '@/components/Navbar';

export default function LoginPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    correo: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.correo || !formData.password) {
      setError('Todos los campos son requeridos.');
      return;
    }

    if (!formData.correo.endsWith('@alumno.ipn.mx')) {
      setError('Debes usar tu correo institucional (@alumno.ipn.mx).');
      return;
    }

    setLoading(true);
    try {
      // TODO: Conectar con el backend cuando esté listo
      // const response = await fetch('/api/auth/login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData),
      // });

      // Simulación
      await new Promise((resolve) => setTimeout(resolve, 1000));

      console.log('Datos de login:', formData);
      alert('¡Inicio de sesión exitoso! (Simulado - sin backend)');
      // router.push('/dashboard'); // Descomentar cuando exista el dashboard
    } catch (err) {
      setError('Credenciales incorrectas. Intenta de nuevo.');
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

      <Container maxWidth="xs" sx={{ py: 8 }}>
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
              Inicio de sesión
            </Typography>
          </Box>

          {/* Error */}
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {/* Formulario */}
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Correo Institucional"
              name="correo"
              type="email"
              value={formData.correo}
              onChange={handleChange}
              required
              placeholder="ejemplo@alumno.ipn.mx"
              sx={{ mb: 3 }}
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
              sx={{ mb: 3 }}
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
              {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
            </Button>

            <Box sx={{ textAlign: 'center', mb: 2 }}>
              <Link
                component="button"
                type="button"
                variant="body2"
                sx={{
                  color: '#D4A84B',
                  textDecoration: 'none',
                  '&:hover': { textDecoration: 'underline' },
                }}
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </Box>

            <Divider sx={{ my: 2, borderColor: 'rgba(123, 30, 59, 0.3)' }} />

            <Typography
              variant="body2"
              color="text.secondary"
              align="center"
            >
              ¿No tienes cuenta?{' '}
              <Link
                component="button"
                type="button"
                variant="body2"
                onClick={() => router.push('/register')}
                sx={{
                  color: '#D4A84B',
                  textDecoration: 'none',
                  fontWeight: 600,
                  '&:hover': { textDecoration: 'underline' },
                }}
              >
                Regístrate aquí
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}