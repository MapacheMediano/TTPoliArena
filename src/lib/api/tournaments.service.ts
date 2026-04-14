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
  id: string
): Promise<JoinTournamentResponse> {
  try {
    return await apiClient<JoinTournamentResponse>(
      `/api/tournaments/${id}/join`,
      { method: "POST" }
    );
  } catch (error) {
    return { ok: false, error: "Error al inscribirse" };
  }
}