'use client';
import { useState } from 'react';
import {
  Box, Container, Paper, Typography, TextField,
  Button, Alert, InputAdornment,
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import { useRouter } from 'next/navigation';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.endsWith('@alumno.ipn.mx')) {
      setError('Debes usar tu correo institucional (@alumno.ipn.mx)');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.ok) {
        setSuccess(true);
      } else {
        setError(data.error ?? 'Error al enviar el correo');
      }
    } catch {
      setError('Error de conexión. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #1A0A10 0%, #2A1520 50%, #1A0A10 100%)' }}>
      <Container maxWidth="xs">
        <Paper elevation={0} sx={{ p: 4, backgroundColor: 'rgba(42, 21, 32, 0.8)', border: '1px solid rgba(123, 30, 59, 0.3)' }}>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <SportsEsportsIcon sx={{ fontSize: 48, color: '#D4A84B', mb: 1 }} />
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#F5F0F2' }}>
              ¿Olvidaste tu contraseña?
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Ingresa tu correo institucional y te enviaremos las instrucciones
            </Typography>
          </Box>

          {success ? (
            <>
              <Alert severity="success" sx={{ mb: 3 }}>
                Te enviamos un correo con las instrucciones para restablecer tu contraseña. Revisa tu bandeja de entrada.
              </Alert>
              <Button fullWidth variant="contained" onClick={() => router.push('/login')}>
                Volver al login
              </Button>
            </>
          ) : (
            <Box component="form" onSubmit={handleSubmit}>
              {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

              <TextField
                fullWidth
                label="Correo institucional"
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(''); }}
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

              <Button type="submit" fullWidth variant="contained" size="large" disabled={loading} sx={{ mb: 2 }}>
                {loading ? 'Enviando...' : 'Enviar instrucciones'}
              </Button>

              <Button fullWidth startIcon={<ArrowBackIcon />} onClick={() => router.push('/login')} sx={{ color: '#C4B0B8' }}>
                Volver al login
              </Button>
            </Box>
          )}
        </Paper>
      </Container>
    </Box>
  );
}