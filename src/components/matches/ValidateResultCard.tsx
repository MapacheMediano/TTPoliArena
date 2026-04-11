// src/components/matches/ValidateResultCard.tsx
'use client';
import { useState } from 'react';
import {
  Paper,
  Box,
  Typography,
  Avatar,
  Button,
  Chip,
  Divider,
  TextField,
  Dialog,
  DialogContent,
  IconButton,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import ImageIcon from '@mui/icons-material/Image';
import CloseIcon from '@mui/icons-material/Close';
import WarningIcon from '@mui/icons-material/Warning';
import PersonIcon from '@mui/icons-material/Person';

export interface PendingResult {
  id: number;
  torneo: string;
  ronda: string;
  fecha: string;
  teamA: { nombre: string; tag: string };
  teamB: { nombre: string; tag: string };
  scoreA: number;
  scoreB: number;
  reportadoPor: string;
  reportadoEquipo: string;
  comentario: string;
  screenshotUrls: string[];
  fechaReporte: string;
}

interface ValidateResultCardProps {
  result: PendingResult;
  onApprove: (id: number) => void;
  onReject: (id: number, motivo: string) => void;
}

export default function ValidateResultCard({
  result,
  onApprove,
  onReject,
}: ValidateResultCardProps) {
  const [viewImage, setViewImage] = useState<string | null>(null);
  const [rejecting, setRejecting] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  const winnerTag =
    result.scoreA > result.scoreB ? result.teamA.tag : result.teamB.tag;

  return (
    <>
      <Paper
        elevation={0}
        sx={{
          p: 3,
          backgroundColor: 'rgba(42, 21, 32, 0.8)',
          border: '1px solid rgba(123, 30, 59, 0.3)',
          mb: 2,
        }}
      >
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2, flexWrap: 'wrap', gap: 1 }}>
          <Box>
            <Typography variant="body2" color="text.secondary">
              {result.torneo} • {result.ronda}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Partida del {result.fecha}
            </Typography>
          </Box>
          <Chip
            label="Pendiente de validación"
            size="small"
            sx={{
              backgroundColor: 'rgba(212, 168, 75, 0.15)',
              color: '#D4A84B',
              fontWeight: 600,
            }}
          />
        </Box>

        {/* Marcador reportado */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 3,
            py: 2,
            px: 2,
            borderRadius: 2,
            backgroundColor: 'rgba(26, 10, 16, 0.5)',
            mb: 2,
          }}
        >
          <Box sx={{ textAlign: 'center' }}>
            <Avatar
              sx={{
                width: 44,
                height: 44,
                fontWeight: 800,
                fontSize: '0.85rem',
                mx: 'auto',
                mb: 0.5,
                background: result.scoreA > result.scoreB
                  ? 'linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)'
                  : 'rgba(123, 30, 59, 0.5)',
                color: '#F5F0F2',
              }}
            >
              {result.teamA.tag}
            </Avatar>
            <Typography variant="caption" sx={{ color: '#F5F0F2', fontWeight: 500, display: 'block' }}>
              {result.teamA.nombre}
            </Typography>
          </Box>

          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#F5F0F2' }}>
              {result.scoreA} — {result.scoreB}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Ganador: [{winnerTag}]
            </Typography>
          </Box>

          <Box sx={{ textAlign: 'center' }}>
            <Avatar
              sx={{
                width: 44,
                height: 44,
                fontWeight: 800,
                fontSize: '0.85rem',
                mx: 'auto',
                mb: 0.5,
                background: result.scoreB > result.scoreA
                  ? 'linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)'
                  : 'rgba(123, 30, 59, 0.5)',
                color: '#F5F0F2',
              }}
            >
              {result.teamB.tag}
            </Avatar>
            <Typography variant="caption" sx={{ color: '#F5F0F2', fontWeight: 500, display: 'block' }}>
              {result.teamB.nombre}
            </Typography>
          </Box>
        </Box>

        {/* Quién reportó */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <PersonIcon sx={{ fontSize: 16, color: '#C4B0B8' }} />
          <Typography variant="caption" color="text.secondary">
            Reportado por <span style={{ color: '#D4A84B', fontWeight: 600 }}>@{result.reportadoPor}</span> ({result.reportadoEquipo}) • {result.fechaReporte}
          </Typography>
        </Box>

        {/* Comentario del capitán */}
        {result.comentario && (
          <Box
            sx={{
              p: 1.5,
              borderRadius: 1.5,
              backgroundColor: 'rgba(26, 10, 16, 0.4)',
              mb: 2,
              borderLeft: '3px solid rgba(212, 168, 75, 0.5)',
            }}
          >
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.25 }}>
              Comentario del capitán:
            </Typography>
            <Typography variant="body2" sx={{ color: '#F5F0F2' }}>
              {result.comentario}
            </Typography>
          </Box>
        )}

        {/* Capturas de pantalla (evidencia) */}
        <Typography variant="body2" sx={{ color: '#F5F0F2', fontWeight: 500, mb: 1 }}>
          Evidencia ({result.screenshotUrls.length} capturas)
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 3 }}>
          {result.screenshotUrls.map((url, index) => (
            <Paper
              key={index}
              elevation={0}
              onClick={() => setViewImage(url)}
              sx={{
                width: 140,
                height: 100,
                borderRadius: 1.5,
                overflow: 'hidden',
                cursor: 'pointer',
                border: '1px solid rgba(123, 30, 59, 0.3)',
                position: 'relative',
                transition: 'all 0.2s',
                '&:hover': {
                  border: '1px solid #D4A84B',
                  transform: 'scale(1.03)',
                },
              }}
            >
              <Box
                component="img"
                src={url}
                alt={`Evidencia ${index + 1}`}
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  backgroundColor: 'rgba(0,0,0,0.6)',
                  px: 0.5,
                  py: 0.25,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.25,
                }}
              >
                <ImageIcon sx={{ fontSize: 12, color: '#F5F0F2' }} />
                <Typography variant="caption" sx={{ color: '#F5F0F2', fontSize: '0.6rem' }}>
                  Captura {index + 1} — Clic para ampliar
                </Typography>
              </Box>
            </Paper>
          ))}
        </Box>

        <Divider sx={{ borderColor: 'rgba(123, 30, 59, 0.2)', mb: 2 }} />

        {/* Zona de rechazo */}
        {rejecting ? (
          <Box sx={{ mb: 2 }}>
            <TextField
              fullWidth
              label="Motivo del rechazo"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              multiline
              rows={2}
              placeholder="Explica por qué el resultado no es válido..."
              sx={{ mb: 1.5 }}
            />
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="contained"
                size="small"
                onClick={() => {
                  if (!rejectReason.trim()) {
                    alert('Debes indicar el motivo del rechazo');
                    return;
                  }
                  onReject(result.id, rejectReason);
                  setRejecting(false);
                  setRejectReason('');
                }}
                sx={{
                  background: 'linear-gradient(135deg, #FF6B6B 0%, #CC4444 100%)',
                  '&:hover': { background: 'linear-gradient(135deg, #CC4444 0%, #AA2222 100%)' },
                }}
              >
                Confirmar rechazo
              </Button>
              <Button
                size="small"
                onClick={() => {
                  setRejecting(false);
                  setRejectReason('');
                }}
                sx={{ color: '#C4B0B8' }}
              >
                Cancelar
              </Button>
            </Box>
          </Box>
        ) : (
          /* Botones de aprobar / rechazar */
          <Box sx={{ display: 'flex', gap: 1.5 }}>
            <Button
              variant="contained"
              startIcon={<CheckCircleIcon />}
              onClick={() => onApprove(result.id)}
              sx={{
                flex: 1,
                background: 'linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)',
                '&:hover': { background: 'linear-gradient(135deg, #2E7D32 0%, #1B5E20 100%)' },
              }}
            >
              Aprobar resultado
            </Button>
            <Button
              variant="outlined"
              startIcon={<CancelIcon />}
              onClick={() => setRejecting(true)}
              sx={{
                flex: 1,
                borderColor: '#FF6B6B',
                color: '#FF6B6B',
                '&:hover': {
                  borderColor: '#CC4444',
                  backgroundColor: 'rgba(255, 107, 107, 0.08)',
                },
              }}
            >
              Rechazar
            </Button>
          </Box>
        )}
      </Paper>

      {/* Dialog para ver imagen ampliada */}
      <Dialog
        open={!!viewImage}
        onClose={() => setViewImage(null)}
        maxWidth="lg"
        PaperProps={{
          sx: {
            backgroundColor: '#1A0A10',
            border: '1px solid rgba(123, 30, 59, 0.3)',
            backgroundImage: 'none',
          },
        }}
      >
        <Box sx={{ position: 'relative' }}>
          <IconButton
            onClick={() => setViewImage(null)}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              backgroundColor: 'rgba(0,0,0,0.6)',
              color: '#F5F0F2',
              zIndex: 1,
              '&:hover': { backgroundColor: 'rgba(0,0,0,0.8)' },
            }}
          >
            <CloseIcon />
          </IconButton>
          <DialogContent sx={{ p: 0 }}>
            {viewImage && (
              <Box
                component="img"
                src={viewImage}
                alt="Evidencia ampliada"
                sx={{
                  width: '100%',
                  maxHeight: '80vh',
                  objectFit: 'contain',
                }}
              />
            )}
          </DialogContent>
        </Box>
      </Dialog>
    </>
  );
}