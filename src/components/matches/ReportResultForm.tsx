'use client';
import { useState } from 'react';
import {
  Box, Typography, TextField, Button,
  Paper, Avatar, Divider, Alert, CircularProgress,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

interface TeamInfo {
  nombre: string;
  tag: string;
}

interface ReportResultFormProps {
  matchInfo: {
    id: number | string;
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
  matchInfo, teamA, teamB, myTeamTag, onSubmit,
}: ReportResultFormProps) {
  const [scoreA, setScoreA] = useState('');
  const [scoreB, setScoreB] = useState('');
  const [evidenceUrl, setEvidenceUrl] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [comentario, setComentario] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Valida que sea imagen
    if (!file.type.startsWith('image/')) {
      setErrors(prev => ({ ...prev, evidenceUrl: 'Solo se permiten imágenes' }));
      return;
    }

    // Valida tamaño máx 5MB
    if (file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, evidenceUrl: 'La imagen no puede pesar más de 5MB' }));
      return;
    }

    setUploadingImage(true);
    setErrors(prev => { const n = { ...prev }; delete n.evidenceUrl; return n; });

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!);

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: 'POST', body: formData }
      );

      const data = await res.json();
      if (data.secure_url) {
        setEvidenceUrl(data.secure_url);
      } else {
        setErrors(prev => ({ ...prev, evidenceUrl: 'Error al subir la imagen' }));
      }
    } catch (error) {
      setErrors(prev => ({ ...prev, evidenceUrl: 'Error de conexión al subir la imagen' }));
    } finally {
      setUploadingImage(false);
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (scoreA === '' || isNaN(Number(scoreA)) || Number(scoreA) < 0) {
      newErrors.scoreA = 'Marcador inválido';
    }
    if (scoreB === '' || isNaN(Number(scoreB)) || Number(scoreB) < 0) {
      newErrors.scoreB = 'Marcador inválido';
    }
    if (scoreA !== '' && scoreB !== '' && scoreA === scoreB) {
      newErrors.scoreA = 'El marcador no puede ser empate';
      newErrors.scoreB = 'Debe haber un ganador';
    }
    if (!evidenceUrl.trim()) {
      newErrors.evidenceUrl = 'Debes subir una captura de pantalla como evidencia';
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
        screenshots: [],
        comentario: evidenceUrl,
      });
    } finally {
      setLoading(false);
    }
  };

  const TeamScoreInput = ({
    team, score, onScoreChange, error, isMyTeam,
  }: {
    team: TeamInfo; score: string;
    onScoreChange: (val: string) => void;
    error?: string; isMyTeam: boolean;
  }) => (
    <Box sx={{ flex: 1, textAlign: 'center' }}>
      <Avatar sx={{
        width: 56, height: 56, fontWeight: 800, fontSize: '1rem',
        mx: 'auto', mb: 1,
        background: isMyTeam
          ? 'linear-gradient(135deg, #D4A84B 0%, #E0C078 100%)'
          : 'rgba(123, 30, 59, 0.5)',
        color: isMyTeam ? '#1A0A10' : '#F5F0F2',
        border: isMyTeam ? '2px solid #D4A84B' : '2px solid transparent',
      }}>
        {team.tag}
      </Avatar>
      <Typography variant="body2" sx={{ color: '#F5F0F2', fontWeight: 600, mb: 1 }}>
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
            setErrors(prev => { const n = { ...prev }; delete n.scoreA; delete n.scoreB; return n; });
          }
        }}
        error={!!error}
        helperText={error}
        placeholder="0"
        inputProps={{ style: { textAlign: 'center', fontSize: '2rem', fontWeight: 800, padding: '8px' } }}
        sx={{ width: 100 }}
      />
    </Box>
  );

  return (
    <Box>
      {/* Info de la partida */}
      <Paper elevation={0} sx={{ p: 2, mb: 3, backgroundColor: 'rgba(26, 10, 16, 0.5)', border: '1px solid rgba(123, 30, 59, 0.15)' }}>
        <Typography variant="caption" color="text.secondary">
          {matchInfo.torneo} • {matchInfo.ronda} • {matchInfo.fecha}
        </Typography>
      </Paper>

      {/* Marcador */}
      <Typography variant="h6" sx={{ fontWeight: 700, color: '#F5F0F2', mb: 2 }}>
        Marcador final
      </Typography>
      <Paper elevation={0} sx={{ p: 3, mb: 3, backgroundColor: 'rgba(42, 21, 32, 0.6)', border: '1px solid rgba(123, 30, 59, 0.25)' }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center', gap: 3 }}>
          <TeamScoreInput
            team={teamA} score={scoreA} onScoreChange={setScoreA}
            error={errors.scoreA} isMyTeam={teamA.tag === myTeamTag}
          />
          <Typography variant="h4" sx={{ color: '#C4B0B850', fontWeight: 800, mt: 8 }}>
            VS
          </Typography>
          <TeamScoreInput
            team={teamB} score={scoreB} onScoreChange={setScoreB}
            error={errors.scoreB} isMyTeam={teamB.tag === myTeamTag}
          />
        </Box>
      </Paper>

      {/* Subida de evidencia */}
      <Typography variant="h6" sx={{ fontWeight: 700, color: '#F5F0F2', mb: 1 }}>
        Evidencia del resultado
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Sube una captura de pantalla que muestre el marcador final de la partida
      </Typography>

      <Box sx={{ mb: 3 }}>
        {evidenceUrl ? (
          // Preview de la imagen subida
          <Box>
            <Box
              component="img"
              src={evidenceUrl}
              alt="Evidencia"
              sx={{
                width: '100%',
                maxHeight: 300,
                objectFit: 'contain',
                borderRadius: 2,
                border: '1px solid rgba(76, 175, 80, 0.4)',
                mb: 1,
              }}
            />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <CheckCircleIcon sx={{ color: '#4CAF50', fontSize: 18 }} />
              <Typography variant="caption" sx={{ color: '#4CAF50' }}>
                Imagen subida correctamente
              </Typography>
            </Box>
            <Button
              size="small"
              onClick={() => setEvidenceUrl('')}
              sx={{ color: '#FF6B6B' }}
            >
              Cambiar imagen
            </Button>
          </Box>
        ) : (
          // Zona de carga
          <Paper
            elevation={0}
            component="label"
            sx={{
              p: 4,
              textAlign: 'center',
              backgroundColor: 'rgba(26, 10, 16, 0.4)',
              border: errors.evidenceUrl
                ? '2px dashed #FF6B6B'
                : '2px dashed rgba(123, 30, 59, 0.4)',
              borderRadius: 2,
              cursor: 'pointer',
              display: 'block',
              transition: 'all 0.2s',
              '&:hover': {
                borderColor: '#D4A84B',
                backgroundColor: 'rgba(212, 168, 75, 0.05)',
              },
            }}
          >
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={handleImageUpload}
            />
            {uploadingImage ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                <CircularProgress size={32} sx={{ color: '#D4A84B' }} />
                <Typography variant="body2" color="text.secondary">
                  Subiendo imagen...
                </Typography>
              </Box>
            ) : (
              <Box>
                <CloudUploadIcon sx={{ fontSize: 40, color: '#C4B0B8', mb: 1 }} />
                <Typography variant="body2" sx={{ color: '#F5F0F2', fontWeight: 500 }}>
                  Haz clic para seleccionar una captura
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  JPG, PNG o WEBP • Máx 5MB
                </Typography>
              </Box>
            )}
          </Paper>
        )}
        {errors.evidenceUrl && (
          <Typography variant="caption" sx={{ color: '#FF6B6B', mt: 0.5, display: 'block' }}>
            {errors.evidenceUrl}
          </Typography>
        )}
      </Box>

      <Divider sx={{ borderColor: 'rgba(123, 30, 59, 0.2)', mb: 3 }} />

      {/* Comentario */}
      <TextField
        fullWidth
        label="Comentario (opcional)"
        value={comentario}
        onChange={(e) => setComentario(e.target.value)}
        multiline rows={2}
        placeholder="Agrega un comentario sobre la partida..."
        helperText="Puedes reportar incidencias o aclaraciones aquí"
        sx={{ mb: 3 }}
      />

      <Alert severity="warning" sx={{ mb: 3, backgroundColor: 'rgba(212, 168, 75, 0.08)', border: '1px solid rgba(212, 168, 75, 0.2)' }}>
        Al enviar el reporte, un moderador revisará que el marcador coincida con la evidencia.
        Reportar resultados falsos puede resultar en sanciones para tu equipo.
      </Alert>

      <Button
        variant="contained" size="large" fullWidth
        startIcon={<SendIcon />}
        onClick={handleSubmit} disabled={loading || uploadingImage}
        sx={{ py: 1.5, fontSize: '1rem', fontWeight: 700 }}
      >
        {loading ? 'Enviando reporte...' : 'Enviar reporte de resultado'}
      </Button>
    </Box>
  );
}