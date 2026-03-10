// src/app/tournaments/page.tsx
'use client';
import { useState, useMemo } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Button,
  Chip,
  Tabs,
  Tab,
  Paper,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import AddIcon from '@mui/icons-material/Add';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import Navbar from '@/components/Navbar';
import TournamentCard, { TournamentData } from '@/components/TournamentCard';
import TournamentFilters, { Filters } from '@/components/tournaments/TournamentFilters';

// ============================================
// DATOS SIMULADOS (mock data)
// Cuando el backend esté listo, vendrán de
// una llamada a GET /api/tournaments
// ============================================

const mockTournaments: TournamentData[] = [
  {
    id: 1,
    nombre: 'Interpolitécnicos 2025 - Valorant',
    juego: 'Valorant',
    formato: 'Eliminación simple',
    fechaInicio: '18/11/2025',
    estado: 'En curso',
    equiposInscritos: 16,
    maxEquipos: 16,
    modalidad: 'Online / Final Presencial',
  },
  {
    id: 2,
    nombre: 'Copa ESCOM - League of Legends',
    juego: 'League of Legends',
    formato: 'Eliminación doble',
    fechaInicio: '25/11/2025',
    estado: 'Abierto',
    equiposInscritos: 8,
    maxEquipos: 16,
    modalidad: 'Online',
  },
  {
    id: 3,
    nombre: 'Torneo Relámpago - Rocket League',
    juego: 'Rocket League',
    formato: 'Round Robin',
    fechaInicio: '01/12/2025',
    estado: 'Abierto',
    equiposInscritos: 3,
    maxEquipos: 8,
    modalidad: 'Online',
  },
  {
    id: 4,
    nombre: 'Interpolitécnicos 2025 - Overwatch',
    juego: 'Overwatch',
    formato: 'Eliminación simple',
    fechaInicio: '18/11/2025',
    estado: 'En curso',
    equiposInscritos: 12,
    maxEquipos: 12,
    modalidad: 'Online / Final Presencial',
  },
  {
    id: 5,
    nombre: 'Copa IPN - Fortnite',
    juego: 'Fortnite',
    formato: 'Eliminación simple',
    fechaInicio: '10/12/2025',
    estado: 'Próximamente',
    equiposInscritos: 0,
    maxEquipos: 32,
    modalidad: 'Online',
  },
  {
    id: 6,
    nombre: 'Interpolitécnicos 2025 - Smash Bros',
    juego: 'Super Smash Bros',
    formato: 'Eliminación doble',
    fechaInicio: '18/11/2025',
    estado: 'En curso',
    equiposInscritos: 24,
    maxEquipos: 32,
    modalidad: 'Presencial',
  },
  {
    id: 7,
    nombre: 'Torneo UPIICSA - Clash Royale',
    juego: 'Clash Royale',
    formato: 'Round Robin',
    fechaInicio: '05/12/2025',
    estado: 'Abierto',
    equiposInscritos: 10,
    maxEquipos: 16,
    modalidad: 'Online',
  },
  {
    id: 8,
    nombre: 'Copa Marvel Rivals - ESIME',
    juego: 'Marvel Rivals',
    formato: 'Eliminación simple',
    fechaInicio: '15/12/2025',
    estado: 'Próximamente',
    equiposInscritos: 0,
    maxEquipos: 16,
    modalidad: 'Online / Final Presencial',
  },
  {
    id: 9,
    nombre: 'Liga Politécnica Valorant S2',
    juego: 'Valorant',
    formato: 'Round Robin',
    fechaInicio: '20/12/2025',
    estado: 'Abierto',
    equiposInscritos: 5,
    maxEquipos: 10,
    modalidad: 'Online',
  },
  {
    id: 10,
    nombre: 'Torneo de Pretemporada - LoL',
    juego: 'League of Legends',
    formato: 'Eliminación simple',
    fechaInicio: '01/10/2025',
    estado: 'Finalizado',
    equiposInscritos: 16,
    maxEquipos: 16,
    modalidad: 'Online',
  },
  {
    id: 11,
    nombre: 'Copa Bienvenida - Rocket League',
    juego: 'Rocket League',
    formato: 'Eliminación doble',
    fechaInicio: '15/09/2025',
    estado: 'Finalizado',
    equiposInscritos: 8,
    maxEquipos: 8,
    modalidad: 'Presencial',
  },
  {
    id: 12,
    nombre: 'Interpolitécnicos 2025 - League of Legends',
    juego: 'League of Legends',
    formato: 'Eliminación doble',
    fechaInicio: '18/11/2025',
    estado: 'En curso',
    equiposInscritos: 16,
    maxEquipos: 16,
    modalidad: 'Online / Final Presencial',
  },
];

// Filtros por defecto
const defaultFilters: Filters = {
  busqueda: '',
  juego: 'Todos',
  estado: 'Todos',
  modalidad: 'Todas',
  formato: 'Todos',
};

// ============================================

export default function TournamentsPage() {
  const router = useRouter();
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const [tabValue, setTabValue] = useState(0);

  // Manejar cambio de filtros
  const handleFilterChange = (field: keyof Filters, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  // Limpiar filtros
  const handleClearFilters = () => {
    setFilters(defaultFilters);
  };

  // Contar filtros activos
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.busqueda) count++;
    if (filters.juego !== 'Todos') count++;
    if (filters.estado !== 'Todos') count++;
    if (filters.modalidad !== 'Todas') count++;
    if (filters.formato !== 'Todos') count++;
    return count;
  }, [filters]);

  // Filtrar torneos
  const filteredTournaments = useMemo(() => {
    return mockTournaments.filter((t) => {
      // Búsqueda por nombre
      if (
        filters.busqueda &&
        !t.nombre.toLowerCase().includes(filters.busqueda.toLowerCase())
      ) {
        return false;
      }
      // Filtro por juego
      if (filters.juego !== 'Todos' && t.juego !== filters.juego) {
        return false;
      }
      // Filtro por estado
      if (filters.estado !== 'Todos' && t.estado !== filters.estado) {
        return false;
      }
      // Filtro por modalidad
      if (filters.modalidad !== 'Todas' && t.modalidad !== filters.modalidad) {
        return false;
      }
      // Filtro por formato
      if (filters.formato !== 'Todos' && t.formato !== filters.formato) {
        return false;
      }
      // Filtro por tab
      if (tabValue === 1 && t.estado !== 'Abierto') return false;
      if (tabValue === 2 && t.estado !== 'En curso') return false;
      if (tabValue === 3 && t.estado !== 'Finalizado') return false;

      return true;
    });
  }, [filters, tabValue]);

  // Contadores por estado (para los tabs)
  const counts = useMemo(() => {
    return {
      todos: mockTournaments.length,
      abiertos: mockTournaments.filter((t) => t.estado === 'Abierto').length,
      enCurso: mockTournaments.filter((t) => t.estado === 'En curso').length,
      finalizados: mockTournaments.filter((t) => t.estado === 'Finalizado').length,
    };
  }, []);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background:
          'linear-gradient(135deg, #1A0A10 0%, #2A1520 50%, #1A0A10 100%)',
      }}
    >
      <Navbar isLoggedIn={true} userName="Kevin Díaz" />

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Encabezado */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            mb: 3,
            flexWrap: 'wrap',
            gap: 2,
          }}
        >
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
              <EmojiEventsIcon sx={{ fontSize: 32, color: '#D4A84B' }} />
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#F5F0F2' }}>
                Torneos
              </Typography>
              <Chip
                label={`${mockTournaments.length} torneos`}
                size="small"
                sx={{
                  backgroundColor: 'rgba(212, 168, 75, 0.15)',
                  color: '#D4A84B',
                  fontWeight: 600,
                }}
              />
            </Box>
            <Typography variant="body2" color="text.secondary">
              Explora los torneos disponibles en la comunidad del IPN
            </Typography>
          </Box>

          {/* Botón crear torneo (solo para organizadores) */}
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => router.push('/tournaments/create')}
          >
            Crear torneo
          </Button>
        </Box>

        {/* Tabs de estado rápido */}
        <Paper
          elevation={0}
          sx={{
            backgroundColor: 'rgba(42, 21, 32, 0.5)',
            border: '1px solid rgba(123, 30, 59, 0.2)',
            mb: 3,
          }}
        >
          <Tabs
            value={tabValue}
            onChange={(_, newValue) => setTabValue(newValue)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              '& .MuiTab-root': {
                color: '#C4B0B8',
                textTransform: 'none',
                fontWeight: 500,
                '&.Mui-selected': {
                  color: '#D4A84B',
                },
              },
              '& .MuiTabs-indicator': {
                backgroundColor: '#D4A84B',
              },
            }}
          >
            <Tab label={`Todos (${counts.todos})`} />
            <Tab label={`Abiertos (${counts.abiertos})`} />
            <Tab label={`En curso (${counts.enCurso})`} />
            <Tab label={`Finalizados (${counts.finalizados})`} />
          </Tabs>
        </Paper>

        {/* Filtros */}
        <Paper
          elevation={0}
          sx={{
            p: 2.5,
            backgroundColor: 'rgba(42, 21, 32, 0.8)',
            border: '1px solid rgba(123, 30, 59, 0.3)',
            mb: 3,
          }}
        >
          <TournamentFilters
            filters={filters}
            onChange={handleFilterChange}
            onClear={handleClearFilters}
            activeFilterCount={activeFilterCount}
          />
        </Paper>

        {/* Resultados */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            {filteredTournaments.length}{' '}
            {filteredTournaments.length === 1 ? 'torneo encontrado' : 'torneos encontrados'}
          </Typography>
        </Box>

        {/* Grid de torneos */}
        {filteredTournaments.length > 0 ? (
          <Grid container spacing={2.5}>
            {filteredTournaments.map((tournament) => (
              <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={tournament.id}>
                <TournamentCard
                  tournament={tournament}
                  onClick={() => router.push(`/tournaments/${tournament.id}`)}
                />
              </Grid>
            ))}
          </Grid>
        ) : (
          /* Estado vacío */
          <Paper
            elevation={0}
            sx={{
              p: 6,
              textAlign: 'center',
              backgroundColor: 'rgba(42, 21, 32, 0.5)',
              border: '1px solid rgba(123, 30, 59, 0.2)',
            }}
          >
            <EmojiEventsIcon
              sx={{ fontSize: 64, color: '#C4B0B8', opacity: 0.5, mb: 2 }}
            />
            <Typography
              variant="h6"
              sx={{ color: '#C4B0B8', mb: 1 }}
            >
              No se encontraron torneos
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Intenta cambiar los filtros o la búsqueda
            </Typography>
            <Button
              variant="outlined"
              onClick={handleClearFilters}
              sx={{
                borderColor: 'rgba(123, 30, 59, 0.5)',
                color: '#F5F0F2',
                '&:hover': {
                  borderColor: '#7B1E3B',
                  backgroundColor: 'rgba(123, 30, 59, 0.1)',
                },
              }}
            >
              Limpiar filtros
            </Button>
          </Paper>
        )}
      </Container>
    </Box>
  );
}