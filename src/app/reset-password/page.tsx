'use client';
import { useState } from 'react';
import {
  Box, Container, Paper, Typography, TextField,
  Button, Alert, InputAdornment, IconButton,
} from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import { useRouter, useSearchParams } from 'next/navigation';

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres');
      return;
    }
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (data.ok) {
        setSuccess(true);
        setTimeout(() => router.push('/login'), 3000);
      } else {
        setError(data.error ?? 'Error al restablecer la contraseña');
      }
    } catch {
      setError('Error de conexión. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #1A0A10 0%, #2A1520 50%, #1A0A10 100%)' }}>
        <Container maxWidth="xs">
          <Paper elevation={0} sx={{ p: 4, textAlign: 'center', backgroundColor: 'rgba(42, 21, 32, 0.8)', border: '1px solid rgba(123, 30, 59, 0.3)' }}>
            <Alert severity="error">Enlace inválido. Solicita un nuevo correo de recuperación.</Alert>
            <Button fullWidth variant="contained" sx={{ mt: 2 }} onClick={() => router.push('/forgot-password')}>
              Solicitar nuevo enlace
            </Button>
          </Paper>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #1A0A10 0%, #2A1520 50%, #1A0A10 100%)' }}>
      <Container maxWidth="xs">
        <Paper elevation={0} sx={{ p: 4, backgroundColor: 'rgba(42, 21, 32, 0.8)', border: '1px solid rgba(123, 30, 59, 0.3)' }}>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <SportsEsportsIcon sx={{ fontSize: 48, color: '#D4A84B', mb: 1 }} />
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#F5F0F2' }}>
              Nueva contraseña
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Ingresa tu nueva contraseña
            </Typography>
          </Box>

          {success ? (
            <Alert severity="success">
              ¡Contraseña actualizada! Redirigiendo al login...
            </Alert>
          ) : (
            <Box component="form" onSubmit={handleSubmit}>
              {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

              <TextField
                fullWidth
                label="Nueva contraseña"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(''); }}
                helperText="Mínimo 8 caracteres"
                sx={{ mb: 2 }}
                InputProps={{
                  startAdornment: <InputAdornment position="start"><LockIcon sx={{ color: '#C4B0B8' }} /></InputAdornment>,
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} sx={{ color: '#C4B0B8' }}>
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                fullWidth
                label="Confirmar contraseña"
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => { setConfirmPassword(e.target.value); setError(''); }}
                sx={{ mb: 3 }}
                InputProps={{
                  startAdornment: <InputAdornment position="start"><LockIcon sx={{ color: '#C4B0B8' }} /></InputAdornment>,
                }}
              />

              <Button type="submit" fullWidth variant="contained" size="large" disabled={loading}>
                {loading ? 'Actualizando...' : 'Actualizar contraseña'}
              </Button>
            </Box>
          )}
        </Paper>
      </Container>
    </Box>
  );
}