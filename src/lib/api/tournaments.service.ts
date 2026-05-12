import { apiClient } from "./client";
import type { TournamentFromAPI } from "./types/auth.types";

// ─── TYPES ────────────────────────────────────────────────

export interface CreateTournamentRequest {
  title: string;
  game: string;
  description?: string;
  format: string;
  maxPlayers: number;
  startDate: string; // ISO string
  endDate?: string;  // ISO string
  reglamentoUrl?: string;
}

export interface TournamentsResponse {
  ok: boolean;
  tournaments?: TournamentFromAPI[];
  error?: string;
}

export interface CreateTournamentResponse {
  ok: boolean;
  tournament?: TournamentFromAPI;
  error?: string;
}

// ─── SERVICES ─────────────────────────────────────────────

// GET /api/tournaments
export async function getAllTournaments(): Promise<TournamentsResponse> {
  try {
    return await apiClient<TournamentsResponse>("/api/tournaments");
  } catch (error) {
    return { ok: false, error: "Error al obtener torneos" };
  }
}

// POST /api/tournaments
export async function createTournament(
  data: CreateTournamentRequest
): Promise<CreateTournamentResponse> {
  try {
    return await apiClient<CreateTournamentResponse>("/api/tournaments", {
      method: "POST",
      body: data,
    });
  } catch (error) {
    return { ok: false, error: "Error al crear torneo" };
  }
}
export interface TeamInscribed {
  id: string;
  name: string;
  tag: string;
  game: string;
  captainId: string;
  captain: {
    id: string;
    email: string;
    PlayerProfile: { fullName: string | null; gamerTag: string | null } | null;
  };
  members: {
    id: string;
    userId: string;
    user: {
      id: string;
      email: string;
      PlayerProfile: { fullName: string | null; gamerTag: string | null } | null;
    };
  }[];
}

export interface TournamentDetailResponse {
  ok: boolean;
  tournament?: TournamentFromAPI & {
    registrations: {
      id: string;
      userId: string;
      createdAt: string;
      user: {
        id: string;
        email: string;
        PlayerProfile: {
          fullName: string | null;
          gamerTag: string | null;
          school: string | null;
        } | null;
      };
    }[];
  };
  teamsInscribed?: TeamInscribed[];
  isTeamGame?: boolean;
  error?: string;
}

export interface JoinTournamentResponse {
  ok: boolean;
  registration?: { id: string; userId: string; tournamentId: string };
  error?: string;
}

// GET /api/tournaments/[id]
export async function getTournamentById(
  id: string
): Promise<TournamentDetailResponse> {
  try {
    return await apiClient<TournamentDetailResponse>(`/api/tournaments/${id}`);
  } catch (error) {
    return { ok: false, error: "Error al obtener el torneo" };
  }
}


// POST /api/tournaments/[id]/join
export async function joinTournament(
  id: string,
  teamId?: string
): Promise<JoinTournamentResponse> {
  try {
    return await apiClient<JoinTournamentResponse>(
      `/api/tournaments/${id}/join`,
      { method: "POST", body: teamId ? { teamId } : {} }
    );
  } catch (error) {
    return { ok: false, error: "Error al inscribirse" };
  }
}

// ─── BRACKETS ─────────────────────────────────────────────

export interface MatchTeam {
  id: string;
  name: string;
  tag: string;
}

export interface BracketMatch {
  id: string;
  tournamentId: string;
  teamAId: string | null;
  teamBId: string | null;
  scoreA: number | null;
  scoreB: number | null;
  winnerId: string | null;
  round: number;
  position: number;
  status: string;
  bracket: string;
  evidenceUrl: string | null;
  teamA: MatchTeam | null;
  teamB: MatchTeam | null;
  winner: MatchTeam | null;
}

export interface BracketsResponse {
  ok: boolean;
  matches?: BracketMatch[];
  tournament?: { id: string; title: string; format: string; status: string };
  error?: string;
}

export interface GenerateBracketResponse {
  ok: boolean;
  matches?: BracketMatch[];
  error?: string;
}

// GET /api/tournaments/[id]/brackets
export async function getTournamentBrackets(
  id: string
): Promise<BracketsResponse> {
  try {
    return await apiClient<BracketsResponse>(`/api/tournaments/${id}/brackets`);
  } catch (error) {
    return { ok: false, error: "Error al obtener brackets" };
  }
}

// POST /api/tournaments/[id]/generate-bracket
export async function generateBracket(
  id: string
): Promise<GenerateBracketResponse> {
  try {
    return await apiClient<GenerateBracketResponse>(
      `/api/tournaments/${id}/generate-bracket`,
      { method: "POST" }
    );
  } catch (error) {
    return { ok: false, error: "Error al generar bracket" };
  }
}