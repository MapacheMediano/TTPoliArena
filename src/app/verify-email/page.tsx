'use client';
import { useEffect, useState } from 'react';
import { Box, Container, Paper, Typography, CircularProgress, Button } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import { useRouter, useSearchParams } from 'next/navigation';

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const verified = searchParams.get('verified');

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

  useEffect(() => {
    if (verified === 'true') {
      setStatus('success');
      return;
    }
    if (!token) {
      setStatus('error');
      return;
    }
    // El token se procesa en el GET del endpoint que redirige aquí
    setStatus('error');
  }, [token, verified]);

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #1A0A10 0%, #2A1520 50%, #1A0A10 100%)' }}>
      <Container maxWidth="xs">
        <Paper elevation={0} sx={{ p: 4, textAlign: 'center', backgroundColor: 'rgba(42, 21, 32, 0.8)', border: '1px solid rgba(123, 30, 59, 0.3)' }}>
          {status === 'loading' && (
            <>
              <CircularProgress sx={{ color: '#D4A84B', mb: 2 }} />
              <Typography variant="h6" sx={{ color: '#F5F0F2' }}>Verificando tu cuenta...</Typography>
            </>
          )}
          {status === 'success' && (
            <>
              <CheckCircleIcon sx={{ fontSize: 64, color: '#4CAF50', mb: 2 }} />
              <Typography variant="h5" sx={{ color: '#4CAF50', fontWeight: 700, mb: 1 }}>
                ¡Cuenta verificada!
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Tu correo ha sido verificado correctamente. Ya puedes usar todas las funciones de PoliArena.
              </Typography>
              <Button variant="contained" fullWidth onClick={() => router.push('/dashboard')}>
                Ir al dashboard
              </Button>
            </>
          )}
          {status === 'error' && (
            <>
              <ErrorIcon sx={{ fontSize: 64, color: '#FF6B6B', mb: 2 }} />
              <Typography variant="h5" sx={{ color: '#FF6B6B', fontWeight: 700, mb: 1 }}>
                Token inválido
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                El enlace de verificación es inválido o ha expirado. Intenta registrarte de nuevo.
              </Typography>
              <Button variant="contained" fullWidth onClick={() => router.push('/register')}>
                Volver al registro
              </Button>
            </>
          )}
        </Paper>
      </Container>
    </Box>
  );
}