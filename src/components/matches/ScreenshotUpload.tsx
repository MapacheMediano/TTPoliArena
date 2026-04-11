// src/components/matches/ScreenshotUpload.tsx
'use client';
import { useState, useRef } from 'react';
import {
  Box,
  Typography,
  Button,
  IconButton,
  Paper,
} from '@mui/material';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import DeleteIcon from '@mui/icons-material/Delete';
import ImageIcon from '@mui/icons-material/Image';
import WarningIcon from '@mui/icons-material/Warning';

interface ScreenshotUploadProps {
  screenshots: File[];
  onChange: (files: File[]) => void;
  maxFiles?: number;
  error?: string;
}

export default function ScreenshotUpload({
  screenshots,
  onChange,
  maxFiles = 3,
  error,
}: ScreenshotUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newFiles: File[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // Validar que sea imagen
      if (!file.type.startsWith('image/')) {
        alert(`"${file.name}" no es una imagen válida.`);
        continue;
      }

      // Validar tamaño (máx 5MB por imagen)
      if (file.size > 5 * 1024 * 1024) {
        alert(`"${file.name}" supera los 5 MB.`);
        continue;
      }

      newFiles.push(file);
    }

    // Verificar que no se exceda el máximo
    const totalFiles = screenshots.length + newFiles.length;
    if (totalFiles > maxFiles) {
      alert(`Máximo ${maxFiles} capturas permitidas.`);
      const allowed = maxFiles - screenshots.length;
      onChange([...screenshots, ...newFiles.slice(0, allowed)]);
    } else {
      onChange([...screenshots, ...newFiles]);
    }

    // Limpiar input para permitir subir el mismo archivo de nuevo
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemove = (index: number) => {
    const updated = screenshots.filter((_, i) => i !== index);
    onChange(updated);
  };

  return (
    <Box>
      <Typography variant="body2" sx={{ color: '#F5F0F2', mb: 1, fontWeight: 500 }}>
        Capturas de pantalla del resultado
      </Typography>
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1.5 }}>
        Sube capturas que muestren el marcador final de la partida ({screenshots.length}/{maxFiles})
      </Typography>

      {/* Zona de subida */}
      <Box
        sx={{
          border: `1px dashed ${error ? '#FF6B6B' : 'rgba(123, 30, 59, 0.4)'}`,
          borderRadius: 2,
          p: 3,
          textAlign: 'center',
          backgroundColor: 'rgba(26, 10, 16, 0.5)',
          mb: 1,
          cursor: screenshots.length < maxFiles ? 'pointer' : 'default',
          transition: 'border-color 0.2s',
          '&:hover': screenshots.length < maxFiles
            ? { borderColor: '#D4A84B' }
            : {},
        }}
        onClick={() => {
          if (screenshots.length < maxFiles && fileInputRef.current) {
            fileInputRef.current.click();
          }
        }}
      >
        {screenshots.length < maxFiles ? (
          <>
            <AddPhotoAlternateIcon sx={{ fontSize: 40, color: '#C4B0B8', mb: 1 }} />
            <Typography variant="body2" color="text.secondary">
              Haz clic para seleccionar capturas de pantalla
            </Typography>
            <Typography variant="caption" color="text.secondary">
              JPG, PNG o WEBP • Máx 5 MB por imagen
            </Typography>
          </>
        ) : (
          <Typography variant="body2" color="text.secondary">
            Máximo de capturas alcanzado ({maxFiles})
          </Typography>
        )}
      </Box>

      {/* Input oculto */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={handleFileSelect}
      />

      {error && (
        <Typography variant="caption" color="error" sx={{ ml: 1 }}>
          {error}
        </Typography>
      )}

      {/* Aviso de importancia */}
      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 0.75, mt: 1, mb: 2 }}>
        <WarningIcon sx={{ fontSize: 16, color: '#D4A84B', mt: 0.2 }} />
        <Typography variant="caption" sx={{ color: '#D4A84B' }}>
          Las capturas deben mostrar claramente el marcador final. Un moderador verificará que el resultado coincida con la evidencia.
        </Typography>
      </Box>

      {/* Preview de capturas subidas */}
      {screenshots.length > 0 && (
        <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
          {screenshots.map((file, index) => (
            <Paper
              key={index}
              elevation={0}
              sx={{
                position: 'relative',
                width: 160,
                height: 120,
                borderRadius: 2,
                overflow: 'hidden',
                border: '1px solid rgba(123, 30, 59, 0.3)',
              }}
            >
              <Box
                component="img"
                src={URL.createObjectURL(file)}
                alt={`Captura ${index + 1}`}
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
              {/* Botón eliminar */}
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove(index);
                }}
                sx={{
                  position: 'absolute',
                  top: 4,
                  right: 4,
                  backgroundColor: 'rgba(0,0,0,0.6)',
                  color: '#FF6B6B',
                  '&:hover': {
                    backgroundColor: 'rgba(0,0,0,0.8)',
                  },
                  width: 28,
                  height: 28,
                }}
              >
                <DeleteIcon sx={{ fontSize: 16 }} />
              </IconButton>
              {/* Nombre del archivo */}
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  backgroundColor: 'rgba(0,0,0,0.7)',
                  px: 0.75,
                  py: 0.25,
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    color: '#F5F0F2',
                    fontSize: '0.6rem',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: 'block',
                  }}
                >
                  {file.name}
                </Typography>
              </Box>
            </Paper>
          ))}
        </Box>
      )}
    </Box>
  );
}