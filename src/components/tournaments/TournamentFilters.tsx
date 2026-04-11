// src/components/tournaments/TournamentFilters.tsx
'use client';
import {
  Box,
  TextField,
  MenuItem,
  InputAdornment,
  Chip,
  Button,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import ClearIcon from '@mui/icons-material/Clear';

const juegos = [
  'Todos',
  'Valorant',
  'League of Legends',
  'Rocket League',
  'Overwatch',
  'Marvel Rivals',
  'Fortnite',
  'Clash Royale',
  'Super Smash Bros',
];

const estados = ['Todos', 'Abierto', 'En curso', 'Próximamente', 'Finalizado'];
const modalidades = ['Todas', 'Online', 'Presencial', 'Online / Final Presencial'];
const formatos = ['Todos', 'Eliminación simple', 'Eliminación doble', 'Round Robin'];

export interface Filters {
  busqueda: string;
  juego: string;
  estado: string;
  modalidad: string;
  formato: string;
}

interface TournamentFiltersProps {
  filters: Filters;
  onChange: (field: keyof Filters, value: string) => void;
  onClear: () => void;
  activeFilterCount: number;
}

export default function TournamentFilters({
  filters,
  onChange,
  onClear,
  activeFilterCount,
}: TournamentFiltersProps) {
  return (
    <Box>
      {/* Barra de búsqueda */}
      <TextField
        fullWidth
        placeholder="Buscar torneos por nombre..."
        value={filters.busqueda}
        onChange={(e) => onChange('busqueda', e.target.value)}
        sx={{ mb: 2 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ color: '#C4B0B8' }} />
            </InputAdornment>
          ),
        }}
      />

      {/* Filtros en fila */}
      <Box
        sx={{
          display: 'flex',
          gap: 1.5,
          flexWrap: 'wrap',
          alignItems: 'center',
        }}
      >
        <FilterListIcon sx={{ color: '#C4B0B8', fontSize: 20 }} />

        {/* Filtro por juego */}
        <TextField
          select
          size="small"
          label="Juego"
          value={filters.juego}
          onChange={(e) => onChange('juego', e.target.value)}
          sx={{ minWidth: 160 }}
        >
          {juegos.map((j) => (
            <MenuItem key={j} value={j}>
              {j}
            </MenuItem>
          ))}
        </TextField>

        {/* Filtro por estado */}
        <TextField
          select
          size="small"
          label="Estado"
          value={filters.estado}
          onChange={(e) => onChange('estado', e.target.value)}
          sx={{ minWidth: 140 }}
        >
          {estados.map((e) => (
            <MenuItem key={e} value={e}>
              {e}
            </MenuItem>
          ))}
        </TextField>

        {/* Filtro por modalidad */}
        <TextField
          select
          size="small"
          label="Modalidad"
          value={filters.modalidad}
          onChange={(e) => onChange('modalidad', e.target.value)}
          sx={{ minWidth: 180 }}
        >
          {modalidades.map((m) => (
            <MenuItem key={m} value={m}>
              {m}
            </MenuItem>
          ))}
        </TextField>

        {/* Filtro por formato */}
        <TextField
          select
          size="small"
          label="Formato"
          value={filters.formato}
          onChange={(e) => onChange('formato', e.target.value)}
          sx={{ minWidth: 170 }}
        >
          {formatos.map((f) => (
            <MenuItem key={f} value={f}>
              {f}
            </MenuItem>
          ))}
        </TextField>

        {/* Botón limpiar filtros */}
        {activeFilterCount > 0 && (
          <Chip
            label={`Limpiar filtros (${activeFilterCount})`}
            onDelete={onClear}
            deleteIcon={<ClearIcon />}
            size="small"
            sx={{
              backgroundColor: 'rgba(123, 30, 59, 0.2)',
              color: '#C4B0B8',
              '& .MuiChip-deleteIcon': {
                color: '#C4B0B8',
                '&:hover': { color: '#FF6B6B' },
              },
            }}
          />
        )}
      </Box>
    </Box>
  );
}