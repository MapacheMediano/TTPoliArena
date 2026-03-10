// src/components/tournaments/InscriptionModal.tsx
'use client';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  Box,
  TextField,
  MenuItem,
  Alert,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import { useState } from 'react';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import WarningIcon from '@mui/icons-material/Warning';

interface InscriptionModalProps {
  open: boolean;
  onClose: () => void;
  tournamentName: string;
  tournamentGame: string;
  hasReglamento: boolean;
}

// Equipos mock del usuario (en el futuro vendrán del backend)
const misEquipos = [
  { id: 1, nombre: 'ESCOM Elite', tag: 'ELT', miembros: 5 },
  { id: 2, nombre: 'Poli Gamers', tag: 'PLG', miembros: 3 },
];

export default function InscriptionModal({
  open,
  onClose,
  tournamentName,
  tournamentGame,
  hasReglamento,
}: InscriptionModalProps) {
  const [selectedTeam, setSelectedTeam] = useState('');
  const [acceptRules, setAcceptRules] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    // Validaciones
    if (!selectedTeam) {
      setError('Debes seleccionar un equipo.');
      return;
    }
    if (hasReglamento && !acceptRules) {
      setError('Debes aceptar que leíste el reglamento.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      // TODO: Conectar con el backend
      // const response = await fetch('/api/tournaments/inscribe', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     tournamentId: ...,
      //     teamId: selectedTeam,
      //   }),
      // });

      // Simulación
      await new Promise((resolve) => setTimeout(resolve, 1500));

      console.log('Inscripción:', { equipo: selectedTeam, torneo: tournamentName });
      setSuccess(true);
    } catch (err) {
      setError('Error al inscribirse. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSelectedTeam('');
    setAcceptRules(false);
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
        Inscribirse al torneo
        <Typography variant="body2" color="text.secondary">
          {tournamentName}
        </Typography>
      </DialogTitle>

      <DialogContent>
        {success ? (
          /* Éxito */
          <Box sx={{ textAlign: 'center', py: 3 }}>
            <HowToRegIcon
              sx={{ fontSize: 64, color: '#4CAF50', mb: 2 }}
            />
            <Typography
              variant="h6"
              sx={{ color: '#4CAF50', fontWeight: 700, mb: 1 }}
            >
              ¡Inscripción exitosa!
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Tu equipo ha sido inscrito en el torneo. Recibirás una
              notificación cuando se publiquen las llaves.
            </Typography>
          </Box>
        ) : (
          /* Formulario */
          <Box sx={{ pt: 1 }}>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            {/* Seleccionar equipo */}
            <TextField
              fullWidth
              select
              label="Selecciona tu equipo"
              value={selectedTeam}
              onChange={(e) => {
                setSelectedTeam(e.target.value);
                setError('');
              }}
              helperText="Solo puedes inscribir equipos donde eres capitán"
              sx={{ mb: 3 }}
            >
              {misEquipos.map((equipo) => (
                <MenuItem key={equipo.id} value={equipo.id.toString()}>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      [{equipo.tag}] {equipo.nombre}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {equipo.miembros} integrantes
                    </Typography>
                  </Box>
                </MenuItem>
              ))}
            </TextField>

            {/* Info del juego */}
            <Alert
              severity="info"
              sx={{
                mb: 2,
                backgroundColor: 'rgba(33, 150, 243, 0.1)',
                border: '1px solid rgba(33, 150, 243, 0.2)',
              }}
            >
              Este torneo es de <strong>{tournamentGame}</strong>. Asegúrate de
              que todos los integrantes de tu equipo tengan cuenta activa en el
              juego.
            </Alert>

            {/* Aceptar reglamento */}
            {hasReglamento && (
              <Box
                sx={{
                  p: 2,
                  borderRadius: 2,
                  backgroundColor: 'rgba(26, 10, 16, 0.5)',
                  border: '1px solid rgba(123, 30, 59, 0.2)',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 1 }}>
                  <WarningIcon sx={{ color: '#D4A84B', fontSize: 20, mt: 0.25 }} />
                  <Typography variant="body2" sx={{ color: '#D4A84B', fontWeight: 500 }}>
                    Antes de inscribirte, descarga y lee el reglamento del torneo
                    desde la sección de arriba.
                  </Typography>
                </Box>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={acceptRules}
                      onChange={(e) => {
                        setAcceptRules(e.target.checked);
                        setError('');
                      }}
                      sx={{
                        color: '#C4B0B8',
                        '&.Mui-checked': { color: '#D4A84B' },
                      }}
                    />
                  }
                  label={
                    <Typography variant="body2" color="text.secondary">
                      Confirmo que he leído y acepto el reglamento del torneo
                    </Typography>
                  }
                />
              </Box>
            )}
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        {success ? (
          <Button
            variant="contained"
            onClick={handleClose}
            fullWidth
          >
            Cerrar
          </Button>
        ) : (
          <>
            <Button
              onClick={handleClose}
              sx={{ color: '#C4B0B8' }}
            >
              Cancelar
            </Button>
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? 'Inscribiendo...' : 'Confirmar inscripción'}
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
}