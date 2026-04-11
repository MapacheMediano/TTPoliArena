// src/components/teams/InviteMemberModal.tsx
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
  Alert,
  InputAdornment,
} from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import EmailIcon from '@mui/icons-material/Email';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

interface InviteMemberModalProps {
  open: boolean;
  onClose: () => void;
  teamName: string;
  onInvited: (correo: string) => void;
}

export default function InviteMemberModal({
  open,
  onClose,
  teamName,
  onInvited,
}: InviteMemberModalProps) {
  const [correo, setCorreo] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const validate = (): boolean => {
    if (!correo.trim()) {
      setError('El correo es obligatorio');
      return false;
    }
    if (!correo.endsWith('@alumno.ipn.mx')) {
      setError('Solo se puede invitar a alumnos del IPN (@alumno.ipn.mx)');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setLoading(true);
    setError('');

    try {
      // TODO: Conectar con el backend
      // const response = await fetch('/api/teams/invite', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ teamId: ..., correo }),
      // });

      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log('Invitación enviada a:', correo);
      setSuccess(true);

      setTimeout(() => {
        onInvited(correo);
        handleClose();
      }, 1500);
    } catch (err) {
      setError('Error al enviar la invitación. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setCorreo('');
    setError('');
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
      <DialogTitle sx={{ fontWeight: 700, color: '#F5F0F2' }}>
        Invitar integrante
        <Typography variant="body2" color="text.secondary">
          Enviar invitación para unirse a {teamName}
        </Typography>
      </DialogTitle>

      <DialogContent>
        {success ? (
          <Box sx={{ textAlign: 'center', py: 3 }}>
            <CheckCircleIcon sx={{ fontSize: 64, color: '#4CAF50', mb: 2 }} />
            <Typography variant="h6" sx={{ color: '#4CAF50', fontWeight: 700, mb: 1 }}>
              ¡Invitación enviada!
            </Typography>
            <Typography variant="body2" color="text.secondary">
              El jugador recibirá una notificación para unirse al equipo.
            </Typography>
          </Box>
        ) : (
          <Box sx={{ pt: 1 }}>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <Alert
              severity="info"
              sx={{
                mb: 2,
                backgroundColor: 'rgba(33, 150, 243, 0.1)',
                border: '1px solid rgba(33, 150, 243, 0.2)',
              }}
            >
              Solo puedes invitar a estudiantes registrados en PoliArena con correo institucional del IPN.
            </Alert>

            <TextField
              fullWidth
              label="Correo institucional del jugador"
              value={correo}
              onChange={(e) => {
                setCorreo(e.target.value);
                setError('');
              }}
              error={!!error}
              placeholder="jugador@alumno.ipn.mx"
              helperText="Ingresa el correo @alumno.ipn.mx del jugador que quieres invitar"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon sx={{ color: '#C4B0B8' }} />
                  </InputAdornment>
                ),
              }}
            />
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
            <Button
              variant="contained"
              startIcon={<PersonAddIcon />}
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? 'Enviando...' : 'Enviar invitación'}
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
}