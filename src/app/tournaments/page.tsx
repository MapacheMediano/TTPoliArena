'use client';
import { useState, useMemo, useEffect } from 'react';
import {
  Box, Container, Typography, Grid, Button,
  Chip, Tabs, Tab, Paper, CircularProgress,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import AddIcon from '@mui/icons-material/Add';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import Navbar from '@/components/Navbar';
import TournamentCard, { TournamentData } from '@/components/TournamentCard';
import TournamentFilters, { Filters } from '@/components/tournaments/TournamentFilters';
import { getAllTournaments } from '@/lib/api/tournaments.service';
import { getCurrentUser } from '@/lib/api/auth.service';
import type { TournamentFromAPI } from '@/lib/api/types/auth.types';

const statusMap: Record<string, string> = {
  OPEN:        'Abierto',
  IN_PROGRESS: 'En curso',
  FINISHED:    'Finalizado',
  UPCOMING:    'Próximamente',
};

const formatoMap: Record<string, string> = {
  'eliminacion_simple': 'Eliminación simple',
  'eliminacion_doble':  'Eliminación doble',
  'round_robin':        'Round Robin',
  'grupos':             'Fase de grupos',
};

const defaultFilters: Filters = {
  busqueda: '',
  juego: 'Todos',
  estado: 'Todos',
  modalidad: 'Todas',
  formato: 'Todos',
};

function mapTournament(t: TournamentFromAPI): TournamentData {
  return {
    id: t.id,
    nombre: t.title,
    juego: t.game,
    formato: formatoMap[t.format] ?? t.format,
    fechaInicio: new Date(t.startDate).toLocaleDateString('es-MX'),
    estado: statusMap[t.status] ?? t.status,
    equiposInscritos: (t as any)._count?.registrations ?? 0,
    maxEquipos: t.maxPlayers,
    modalidad: 'Online',
    imagenUrl: t.imageUrl ?? null,
  };
}

export default function TournamentsPage() {
  const router = useRouter();
  const [tournaments, setTournaments] = useState<TournamentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const [tabValue, setTabValue] = useState(0);
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const [meRes, tournamentsRes] = await Promise.all([
          getCurrentUser(),
          getAllTournaments(),
        ]);
        if (!meRes.user) { router.push('/login'); return; }
        setUserName(meRes.user.email.split('@')[0]);
        setUserRole(meRes.user.role);
        if (tournamentsRes.ok && tournamentsRes.tournaments) {
          setTournaments(tournamentsRes.tournaments.map(mapTournament));
        }
      } catch (error) {
        console.error('Error cargando torneos:', error);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [router]);

  const handleFilterChange = (field: keyof Filters, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleClearFilters = () => setFilters(defaultFilters);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.busqueda) count++;
    if (filters.juego !== 'Todos') count++;
    if (filters.estado !== 'Todos') count++;
    if (filters.modalidad !== 'Todas') count++;
    if (filters.formato !== 'Todos') count++;
    return count;
  }, [filters]);

  const filteredTournaments = useMemo(() => {
    return tournaments.filter((t) => {
      if (filters.busqueda && !t.nombre.toLowerCase().includes(filters.busqueda.toLowerCase())) return false;
      if (filters.juego !== 'Todos' && t.juego !== filters.juego) return false;
      if (filters.estado !== 'Todos' && t.estado !== filters.estado) return false;
      if (filters.modalidad !== 'Todas' && t.modalidad !== filters.modalidad) return false;
      if (filters.formato !== 'Todos') {
        const normalizar = (str: string) =>
          str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '_');
        if (normalizar(t.formato) !== normalizar(filters.formato)) return false;
      }
      if (tabValue === 1 && t.estado !== 'Abierto') return false;
      if (tabValue === 2 && t.estado !== 'En curso') return false;
      if (tabValue === 3 && t.estado !== 'Finalizado') return false;
      return true;
    });
  }, [filters, tabValue, tournaments]);

  const counts = useMemo(() => ({
    todos:       tournaments.length,
    abiertos:    tournaments.filter((t) => t.estado === 'Abierto').length,
    enCurso:     tournaments.filter((t) => t.estado === 'En curso').length,
    finalizados: tournaments.filter((t) => t.estado === 'Finalizado').length,
  }), [tournaments]);

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #1A0A10 0%, #2A1520 50%, #1A0A10 100%)' }}>
        <CircularProgress sx={{ color: '#D4A84B' }} />
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1A0A10 0%, #2A1520 50%, #1A0A10 100%)' }}>
      <Navbar isLoggedIn={true} userName={userName} role={userRole} />

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3, flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
              <EmojiEventsIcon sx={{ fontSize: 32, color: '#D4A84B' }} />
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#F5F0F2' }}>Torneos</Typography>
              <Chip label={`${tournaments.length} torneos`} size="small"
                sx={{ backgroundColor: 'rgba(212, 168, 75, 0.15)', color: '#D4A84B', fontWeight: 600 }} />
            </Box>
            <Typography variant="body2" color="text.secondary">
              Explora los torneos disponibles en la comunidad del IPN
            </Typography>
          </Box>
          {(userRole === 'ADMIN' || userRole === 'STAFF') && (
            <Button variant="contained" startIcon={<AddIcon />} onClick={() => router.push('/tournaments/create')}>
              Crear torneo
            </Button>
          )}
        </Box>

        <Paper elevation={0} sx={{ backgroundColor: 'rgba(42, 21, 32, 0.5)', border: '1px solid rgba(123, 30, 59, 0.2)', mb: 3 }}>
          <Tabs value={tabValue} onChange={(_, v) => setTabValue(v)} variant="scrollable" scrollButtons="auto"
            sx={{ '& .MuiTab-root': { color: '#C4B0B8', textTransform: 'none', fontWeight: 500, '&.Mui-selected': { color: '#D4A84B' } }, '& .MuiTabs-indicator': { backgroundColor: '#D4A84B' } }}>
            <Tab label={`Todos (${counts.todos})`} />
            <Tab label={`Abiertos (${counts.abiertos})`} />
            <Tab label={`En curso (${counts.enCurso})`} />
            <Tab label={`Finalizados (${counts.finalizados})`} />
          </Tabs>
        </Paper>

        <Paper elevation={0} sx={{ p: 2.5, backgroundColor: 'rgba(42, 21, 32, 0.8)', border: '1px solid rgba(123, 30, 59, 0.3)', mb: 3 }}>
          <TournamentFilters filters={filters} onChange={handleFilterChange} onClear={handleClearFilters} activeFilterCount={activeFilterCount} />
        </Paper>

        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            {filteredTournaments.length} {filteredTournaments.length === 1 ? 'torneo encontrado' : 'torneos encontrados'}
          </Typography>
        </Box>

        {filteredTournaments.length > 0 ? (
          <Grid container spacing={2.5}>
            {filteredTournaments.map((tournament) => (
              <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={tournament.id}>
                <TournamentCard tournament={tournament} onClick={() => router.push(`/tournaments/${tournament.id}`)} />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Paper elevation={0} sx={{ p: 6, textAlign: 'center', backgroundColor: 'rgba(42, 21, 32, 0.5)', border: '1px solid rgba(123, 30, 59, 0.2)' }}>
            <EmojiEventsIcon sx={{ fontSize: 64, color: '#C4B0B8', opacity: 0.5, mb: 2 }} />
            <Typography variant="h6" sx={{ color: '#C4B0B8', mb: 1 }}>No se encontraron torneos</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              {tournaments.length === 0 ? 'Aún no hay torneos creados' : 'Intenta cambiar los filtros'}
            </Typography>
            <Button variant="outlined" onClick={handleClearFilters}
              sx={{ borderColor: 'rgba(123, 30, 59, 0.5)', color: '#F5F0F2', '&:hover': { borderColor: '#7B1E3B', backgroundColor: 'rgba(123, 30, 59, 0.1)' } }}>
              Limpiar filtros
            </Button>
          </Paper>
        )}
      </Container>
    </Box>
  );
}