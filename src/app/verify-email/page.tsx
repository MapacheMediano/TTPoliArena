'use client';
import { Suspense, useEffect, useState } from 'react';
import { Box, Container, Paper, Typography, CircularProgress, Button } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import { useRouter, useSearchParams } from 'next/navigation';

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const verified = searchParams.get('verified');
  const [status, setStatus] = useState<'confirm' | 'loading' | 'success' | 'error'>('confirm');

  useEffect(() => {
    if (verified === 'true') { setStatus('success'); return; }
    if (!token) { setStatus('error'); return; }
    setStatus('confirm');
  }, [token, verified]);

  const handleConfirm = async () => {
    setStatus('loading');
    try {
      const res = await fetch(`/api/auth/verify-email?token=${token}`, {
        method: 'POST',
      });
      const data = await res.json().catch(() => null);
      if (res.ok && data?.ok) {
        setStatus('success');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  return (
    <Paper elevation={0} sx={{ p: 4, textAlign: 'center', backgroundColor: 'rgba(42, 21, 32, 0.8)', border: '1px solid rgba(123, 30, 59, 0.3)' }}>
      {status === 'confirm' && (
        <>
          <MarkEmailReadIcon sx={{ fontSize: 64, color: '#D4A84B', mb: 2 }} />
          <Typography variant="h5" sx={{ color: '#F5F0F2', fontWeight: 700, mb: 1 }}>
            Verificar cuenta
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Haz click en el botón para confirmar tu correo y activar tu cuenta.
          </Typography>
          <Button variant="contained" fullWidth onClick={handleConfirm} size="large">
            Confirmar verificación
          </Button>
        </>
      )}
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
            Tu correo ha sido verificado correctamente.
          </Typography>
          <Button variant="contained" fullWidth onClick={() => router.push('/login')}>
            Iniciar sesión
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
            El enlace de verificación es inválido o ha expirado.
          </Typography>
          <Button variant="contained" fullWidth onClick={() => router.push('/register')}>
            Volver al registro
          </Button>
        </>
      )}
    </Paper>
  );
}

export default function VerifyEmailPage() {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #1A0A10 0%, #2A1520 50%, #1A0A10 100%)' }}>
      <Container maxWidth="xs">
        <Suspense fallback={<CircularProgress sx={{ color: '#D4A84B' }} />}>
          <VerifyEmailContent />
        </Suspense>
      </Container>
    </Box>
  );
}