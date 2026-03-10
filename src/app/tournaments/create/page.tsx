// src/app/tournaments/create/page.tsx
'use client';
import { useState } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  Stepper,
  Step,
  StepLabel,
  Alert,
  Snackbar,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import PublishIcon from '@mui/icons-material/Publish';
import SaveIcon from '@mui/icons-material/Save';
import Navbar from '@/components/Navbar';
import StepBasicInfo from '@/components/tournaments/StepBasicInfo';
import StepRulesConfig from '@/components/tournaments/StepRulesConfig';
import StepReview from '@/components/tournaments/StepReview';

// Nombres de los pasos del stepper
const steps = ['Información básica', 'Reglas y configuración', 'Revisar y publicar'];

export default function CreateTournamentPage() {
  const router = useRouter();

  // Estado del paso actual
  const [activeStep, setActiveStep] = useState(0);

  // Estado del formulario completo
  const [formData, setFormData] = useState({
    // Paso 1
    nombre: '',
    juego: '',
    descripcion: '',
    imagenUrl: '',
    // Paso 2
    formato: '',
    maxEquipos: 16,
    fechaInicio: '',
    fechaFin: '',
    modalidad: '',
    reglas: '',
    reglamentoPdf: null as File | null,
    premios: '',
  });

  // Errores de validación
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Snackbar de éxito
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  // Manejar cambios en cualquier campo
  const handleChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Limpiar error del campo que se está editando
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // Validar paso 1
  const validateStep1 = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre del torneo es obligatorio';
    }
    if (!formData.juego) {
      newErrors.juego = 'Debes seleccionar un juego';
    }
    if (!formData.descripcion.trim()) {
      newErrors.descripcion = 'La descripción es obligatoria';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Validar paso 2
  const validateStep2 = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.formato) {
      newErrors.formato = 'Debes seleccionar un formato';
    }
    if (formData.maxEquipos < 2) {
      newErrors.maxEquipos = 'Mínimo 2 equipos';
    }
    if (formData.maxEquipos > 64) {
      newErrors.maxEquipos = 'Máximo 64 equipos';
    }
    if (!formData.fechaInicio) {
      newErrors.fechaInicio = 'La fecha de inicio es obligatoria';
    }
    if (!formData.fechaFin) {
      newErrors.fechaFin = 'La fecha de fin es obligatoria';
    }
    if (formData.fechaInicio && formData.fechaFin && formData.fechaFin < formData.fechaInicio) {
      newErrors.fechaFin = 'La fecha de fin debe ser posterior a la de inicio';
    }
    if (!formData.modalidad) {
      newErrors.modalidad = 'Selecciona una modalidad';
    }
    if (!formData.reglamentoPdf) {
      newErrors.reglamentoPdf = 'Debes subir el reglamento en PDF';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Avanzar paso
  const handleNext = () => {
    let isValid = false;

    if (activeStep === 0) {
      isValid = validateStep1();
    } else if (activeStep === 1) {
      isValid = validateStep2();
    }

    if (isValid) {
      setActiveStep((prev) => prev + 1);
    }
  };

  // Retroceder paso
  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  // Publicar torneo
  const handlePublish = async () => {
    setLoading(true);
    try {
      // TODO: Conectar con el backend cuando esté listo
      // const response = await fetch('/api/tournaments', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     ...formData,
      //     estado: 'Abierto',
      //   }),
      // });

      // Simulación
      await new Promise((resolve) => setTimeout(resolve, 1500));

      console.log('Torneo creado:', formData);
      setShowSuccess(true);

      // Redirigir después de 2 segundos
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
    } catch (err) {
      console.error('Error al crear torneo:', err);
    } finally {
      setLoading(false);
    }
  };

  // Guardar como borrador
  const handleSaveDraft = async () => {
    setLoading(true);
    try {
      // TODO: Conectar con el backend
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log('Borrador guardado:', formData);
      setShowSuccess(true);
    } catch (err) {
      console.error('Error al guardar borrador:', err);
    } finally {
      setLoading(false);
    }
  };

  // Renderizar el contenido del paso actual
  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <StepBasicInfo
            formData={formData}
            onChange={handleChange}
            errors={errors}
          />
        );
      case 1:
        return (
          <StepRulesConfig
            formData={formData}
            onChange={handleChange}
            errors={errors}
          />
        );
      case 2:
        return <StepReview formData={formData} />;
      default:
        return null;
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background:
          'linear-gradient(135deg, #1A0A10 0%, #2A1520 50%, #1A0A10 100%)',
      }}
    >
      <Navbar isLoggedIn={true} userName="Kevin Díaz" />

      <Container maxWidth="md" sx={{ py: 4 }}>
        {/* Título de la página */}
        <Box sx={{ mb: 4 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => router.push('/dashboard')}
            sx={{ color: '#C4B0B8', mb: 2 }}
          >
            Volver al dashboard
          </Button>
          <Typography
            variant="h4"
            sx={{ fontWeight: 800, color: '#F5F0F2' }}
          >
            Crear nuevo torneo
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Completa los pasos para publicar tu torneo
          </Typography>
        </Box>

        {/* Stepper */}
        <Stepper
          activeStep={activeStep}
          alternativeLabel
          sx={{
            mb: 4,
            '& .MuiStepLabel-label': {
              color: '#C4B0B8',
              '&.Mui-active': { color: '#D4A84B' },
              '&.Mui-completed': { color: '#4CAF50' },
            },
            '& .MuiStepIcon-root': {
              color: 'rgba(123, 30, 59, 0.3)',
              '&.Mui-active': { color: '#D4A84B' },
              '&.Mui-completed': { color: '#4CAF50' },
            },
            '& .MuiStepConnector-line': {
              borderColor: 'rgba(123, 30, 59, 0.3)',
            },
          }}
        >
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {/* Contenido del paso */}
        <Paper
          elevation={0}
          sx={{
            p: 4,
            backgroundColor: 'rgba(42, 21, 32, 0.8)',
            border: '1px solid rgba(123, 30, 59, 0.3)',
            backdropFilter: 'blur(10px)',
            mb: 3,
          }}
        >
          {renderStepContent()}
        </Paper>

        {/* Botones de navegación */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: 2,
          }}
        >
          {/* Izquierda */}
          <Box>
            {activeStep > 0 && (
              <Button
                startIcon={<ArrowBackIcon />}
                onClick={handleBack}
                sx={{ color: '#C4B0B8' }}
              >
                Anterior
              </Button>
            )}
          </Box>

          {/* Derecha */}
          <Box sx={{ display: 'flex', gap: 1 }}>
            {/* Guardar borrador (visible en pasos 1 y 2) */}
            {activeStep < 2 && (
              <Button
                variant="outlined"
                startIcon={<SaveIcon />}
                onClick={handleSaveDraft}
                disabled={loading}
                sx={{
                  borderColor: 'rgba(123, 30, 59, 0.5)',
                  color: '#C4B0B8',
                  '&:hover': {
                    borderColor: '#7B1E3B',
                    backgroundColor: 'rgba(123, 30, 59, 0.1)',
                  },
                }}
              >
                Guardar borrador
              </Button>
            )}

            {/* Siguiente o Publicar */}
            {activeStep < 2 ? (
              <Button
                variant="contained"
                endIcon={<ArrowForwardIcon />}
                onClick={handleNext}
              >
                Siguiente
              </Button>
            ) : (
              <Button
                variant="contained"
                startIcon={<PublishIcon />}
                onClick={handlePublish}
                disabled={loading}
                sx={{
                  background: 'linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #2E7D32 0%, #1B5E20 100%)',
                  },
                  px: 4,
                }}
              >
                {loading ? 'Publicando...' : 'Publicar torneo'}
              </Button>
            )}
          </Box>
        </Box>
      </Container>

      {/* Snackbar de éxito */}
      <Snackbar
        open={showSuccess}
        autoHideDuration={3000}
        onClose={() => setShowSuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" variant="filled" sx={{ width: '100%' }}>
          ¡Torneo creado exitosamente!
        </Alert>
      </Snackbar>
    </Box>
  );
}