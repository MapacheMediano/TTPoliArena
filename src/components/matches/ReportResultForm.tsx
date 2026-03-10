// src/components/matches/ReportResultForm.tsx
'use client';
import { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Avatar,
  Divider,
  Alert,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import ScreenshotUpload from './ScreenshotUpload';

interface TeamInfo {
  nombre: string;
  tag: string;
}

interface ReportResultFormProps {
  matchInfo: {
    id: number;
    ronda: string;
    fecha: string;
    torneo: string;
  };
  teamA: TeamInfo;
  teamB: TeamInfo;
  myTeamTag: string;
  onSubmit: (data: {
    scoreA: number;
    scoreB: number;
    screenshots: File[];
    comentario: string;
  }) => void;
}

export default function ReportResultForm({
  matchInfo,
  teamA,
  teamB,
  myTeamTag,
  onSubmit,
}: ReportResultFormProps) {
  const [scoreA, setScoreA] = useState('');
  const [scoreB, setScoreB] = useState('');
  const [screenshots, setScreenshots] = useState<File[]>([]);
  const [comentario, setComentario] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (scoreA === '' || isNaN(Number(scoreA)) || Number(scoreA) < 0) {
      newErrors.scoreA = 'Marcador inválido';
    }
    if (scoreB === '' || isNaN(Number(scoreB)) || Number(scoreB) < 0) {
      newErrors.scoreB = 'Marcador inválido';
    }
    if (scoreA === scoreB && scoreA !== '') {
      newErrors.scoreA = 'El marcador no puede ser empate';
      newErrors.scoreB = 'Debe haber un ganador';
    }
    if (screenshots.length === 0) {
      newErrors.screenshots = 'Debes subir al menos una captura de pantalla del resultado';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      await onSubmit({
        scoreA: Number(scoreA),
        scoreB: Number(scoreB),
        screenshots,
        comentario,
      });
    } finally {
      setLoading(false);
    }
  };

  const TeamScoreInput = ({
    team,
    score,
    onScoreChange,
    error,
    isMyTeam,
  }: {
    team: TeamInfo;
    score: string;
    onScoreChange: (val: string) => void;
    error?: string;
    isMyTeam: boolean;
  }) => (
    <Box sx={{ flex: 1, textAlign: 'center' }}>
      <Avatar
        sx={{
          width: 56,
          height: 56,
          fontWeight: 800,
          fontSize: '1rem',
          mx: 'auto',
          mb: 1,
          background: isMyTeam
            ? 'linear-gradient(135deg, #D4A84B 0%, #E0C078 100%)'
            : 'rgba(123, 30, 59, 0.5)',
          color: isMyTeam ? '#1A0A10' : '#F5F0F2',
          border: isMyTeam ? '2px solid #D4A84B' : '2px solid transparent',
        }}
      >
        {team.tag}
      </Avatar>
      <Typography
        variant="body2"
        sx={{
          color: '#F5F0F2',
          fontWeight: 600,
          mb: 1,
        }}
      >
        {team.nombre}
      </Typography>
      {isMyTeam && (
        <Typography variant="caption" sx={{ color: '#D4A84B', display: 'block', mb: 1 }}>
          Tu equipo
        </Typography>
      )}
      <TextField
        value={score}
        onChange={(e) => {
          const val = e.target.value;
          if (val === '' || (/^\d+$/.test(val) && Number(val) >= 0)) {
            onScoreChange(val);
            setErrors((prev) => {
              const n = { ...prev };
              delete n.scoreA;
              delete n.scoreB;
              return n;
            });
          }
        }}
        error={!!error}
        helperText={error}
        placeholder="0"
        inputProps={{
          style: {
            textAlign: 'center',
            fontSize: '2rem',
            fontWeight: 800,
            padding: '8px',
          },
        }}
        sx={{ width: 100 }}
      />
    </Box>
  );

  return (
    <Box>
      {/* Info de la partida */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 3,
          backgroundColor: 'rgba(26, 10, 16, 0.5)',
          border: '1px solid rgba(123, 30, 59, 0.15)',
        }}
      >
        <Typography variant="caption" color="text.secondary">
          {matchInfo.torneo} • {matchInfo.ronda} • {matchInfo.fecha}
        </Typography>
      </Paper>

      {/* Marcador */}
      <Typography variant="h6" sx={{ fontWeight: 700, color: '#F5F0F2', mb: 2 }}>
        Marcador final
      </Typography>

      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          backgroundColor: 'rgba(42, 21, 32, 0.6)',
          border: '1px solid rgba(123, 30, 59, 0.25)',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
            gap: 3,
          }}
        >
          <TeamScoreInput
            team={teamA}
            score={scoreA}
            onScoreChange={setScoreA}
            error={errors.scoreA}
            isMyTeam={teamA.tag === myTeamTag}
          />

          <Typography
            variant="h4"
            sx={{
              color: '#C4B0B850',
              fontWeight: 800,
              mt: 8,
            }}
          >
            VS
          </Typography>

          <TeamScoreInput
            team={teamB}
            score={scoreB}
            onScoreChange={setScoreB}
            error={errors.scoreB}
            isMyTeam={teamB.tag === myTeamTag}
          />
        </Box>
      </Paper>

      {/* Capturas de pantalla */}
      <Box sx={{ mb: 3 }}>
        <ScreenshotUpload
          screenshots={screenshots}
          onChange={setScreenshots}
          maxFiles={3}
          error={errors.screenshots}
        />
      </Box>

      <Divider sx={{ borderColor: 'rgba(123, 30, 59, 0.2)', mb: 3 }} />

      {/* Comentario opcional */}
      <TextField
        fullWidth
        label="Comentario (opcional)"
        value={comentario}
        onChange={(e) => setComentario(e.target.value)}
        multiline
        rows={2}
        placeholder="Agrega un comentario sobre la partida si lo necesitas..."
        helperText="Puedes reportar incidencias o aclaraciones aquí"
        sx={{ mb: 3 }}
      />

      {/* Aviso */}
      <Alert
        severity="warning"
        sx={{
          mb: 3,
          backgroundColor: 'rgba(212, 168, 75, 0.08)',
          border: '1px solid rgba(212, 168, 75, 0.2)',
        }}
      >
        Al enviar el reporte, un moderador revisará que el marcador coincida con las capturas de pantalla.
        Reportar resultados falsos puede resultar en sanciones para tu equipo.
      </Alert>

      {/* Botón enviar */}
      <Button
        variant="contained"
        size="large"
        fullWidth
        startIcon={<SendIcon />}
        onClick={handleSubmit}
        disabled={loading}
        sx={{
          py: 1.5,
          fontSize: '1rem',
          fontWeight: 700,
        }}
      >
        {loading ? 'Enviando reporte...' : 'Enviar reporte de resultado'}
      </Button>
    </Box>
  );
}