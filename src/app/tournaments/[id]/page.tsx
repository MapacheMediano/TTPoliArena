// src/app/tournaments/[id]/page.tsx
'use client';
import { useState } from 'react';
import {
  Box,
  Container,
  Button,
  Grid,
} from '@mui/material';
import { useRouter, useParams } from 'next/navigation';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import Navbar from '@/components/Navbar';
import TournamentHeader from '@/components/tournaments/TournamentHeader';
import TournamentInfo from '@/components/tournaments/TournamentInfo';
import InscriptionModal from '@/components/tournaments/InscriptionModal';

// ============================================
// DATOS SIMULADOS (mock data)
// Cuando el backend esté listo, se hará un
// GET /api/tournaments/:id para obtener esto
// ============================================

const mockTournamentDetail = {
  nombre: 'Interpolitécnicos 2025 - Valorant',
  juego: 'Valorant',
  formato: 'Eliminación simple',
  fechaInicio: '18/11/2025',
  fechaFin: '15/12/2025',
  estado: 'Abierto',
  equiposInscritos: 12,
  maxEquipos: 16,
  modalidad: 'Online / Final Presencial',
  imagenUrl: '/games/valorant.jpg',
  organizador: 'EsportsIPN Staff',
  organizadorUnidad: 'ESCOM - Escuela Superior de Cómputo',
  descripcion: `¡Bienvenidos a los Interpolitécnicos 2025 en la disciplina de Valorant!

Este torneo está abierto para todos los estudiantes con matrícula activa del Instituto Politécnico Nacional. Los equipos competirán en formato de eliminación simple hasta coronar al campeón.

Las fases clasificatorias se jugarán en línea y la gran final será presencial en las instalaciones de ESCOM.

Requisitos:
- Todos los integrantes deben tener matrícula vigente del IPN
- Cada equipo debe contar con 5 jugadores titulares
- Los jugadores deben tener cuenta de Valorant nivel 20 o superior
- Cada equipo debe designar un capitán responsable`,
  reglamentoPdfUrl: '/reglamentos/valorant-interpolitecnicos-2025.pdf',
  premios: `🥇 1er lugar: Trofeo + Periféricos gaming + Reconocimiento oficial del IPN
🥈 2do lugar: Periféricos gaming + Reconocimiento
🥉 3er lugar: Reconocimiento oficial

Todos los participantes recibirán constancia de participación expedida por la Dirección de Actividades Deportivas del IPN.`,
};

const mockTeamsInscribed = [
  { nombre: 'ESCOM Elite', tag: 'ELT', capitan: 'MapacheMediano', miembros: 5 },
  { nombre: 'UPIICSA Warriors', tag: 'UPW', capitan: 'DragonIPN', miembros: 5 },
  { nombre: 'ESIME Thunder', tag: 'ETH', capitan: 'ThunderBolt', miembros: 5 },
  { nombre: 'CECyT Legends', tag: 'CYL', capitan: 'LegendKing', miembros: 5 },
  { nombre: 'Poli Gamers', tag: 'PLG', capitan: 'PoliPro', miembros: 5 },
  { nombre: 'ESIA Snipers', tag: 'ESN', capitan: 'SniperX', miembros: 5 },
  { nombre: 'ENCB Team', tag: 'ENC', capitan: 'BioGamer', miembros: 5 },
  { nombre: 'Zacatenco FC', tag: 'ZFC', capitan: 'ZacaPlay', miembros: 5 },
  { nombre: 'UPIITA Robots', tag: 'UPR', capitan: 'RobotMaster', miembros: 5 },
  { nombre: 'ESCA Sharks', tag: 'ESH', capitan: 'SharkByte', miembros: 5 },
  { nombre: 'CIC Hackers', tag: 'CIH', capitan: 'HackPro', miembros: 5 },
  { nombre: 'ESFM Quantum', tag: 'EFQ', capitan: 'QuantumX', miembros: 5 },
];

// ============================================

export default function TournamentDetailPage() {
  const router = useRouter();
  const params = useParams();
  const tournamentId = params.id;

  const [isInscribed, setIsInscribed] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  // TODO: Cuando haya backend, hacer fetch del torneo por ID
  // useEffect(() => {
  //   const fetchTournament = async () => {
  //     const response = await fetch(`/api/tournaments/${tournamentId}`);
  //     const data = await response.json();
  //     setTournament(data);
  //   };
  //   fetchTournament();
  // }, [tournamentId]);

  const tournament = mockTournamentDetail;

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
        {/* Botón volver */}
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => router.push('/tournaments')}
          sx={{ color: '#C4B0B8', mb: 2 }}
        >
          Volver a torneos
        </Button>

        {/* Header / Banner */}
        <TournamentHeader
          tournament={tournament}
          isInscribed={isInscribed}
          onInscribe={() => setModalOpen(true)}
        />

        {/* Botón ver brackets */}
        <Box sx={{ mt: 3, mb: 3 }}>
          <Button
            variant="outlined"
            startIcon={<AccountTreeIcon />}
            onClick={() => router.push(`/tournaments/${tournamentId}/brackets`)}
            sx={{
              borderColor: 'rgba(212, 168, 75, 0.5)',
              color: '#D4A84B',
              '&:hover': {
                borderColor: '#D4A84B',
                backgroundColor: 'rgba(212, 168, 75, 0.1)',
              },
            }}
          >
            Ver brackets / llaves
          </Button>
        </Box>

        {/* Contenido */}
        <Box>
          <TournamentInfo
            tournament={tournament}
            teamsInscribed={mockTeamsInscribed}
          />
        </Box>
      </Container>

      {/* Modal de inscripción */}
      <InscriptionModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          // Simular que se inscribió exitosamente
          // En producción esto se haría después de la respuesta del backend
        }}
        tournamentName={tournament.nombre}
        tournamentGame={tournament.juego}
        hasReglamento={!!tournament.reglamentoPdfUrl}
      />
    </Box>
  );
}