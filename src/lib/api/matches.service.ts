import { apiClient } from "./client";

export interface MatchDetail {
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
  evidenceUrl: string | null;
  reportedBy: string | null;
  bracket: string;
  playedAt: string | null;
  tournament: { id: string; title: string; game: string };
  teamA: {
    id: string; name: string; tag: string; captainId: string;
    members: { user: { id: string; email: string } }[];
  } | null;
  teamB: {
    id: string; name: string; tag: string; captainId: string;
    members: { user: { id: string; email: string } }[];
  } | null;
  winner: { id: string; name: string; tag: string } | null;
}

export interface MatchResponse {
  ok: boolean;
  match?: MatchDetail;
  error?: string;
}

export interface ReportResultRequest {
  scoreA: number;
  scoreB: number;
  evidenceUrl?: string;
  comentario?: string;
}

// GET /api/matches/[id]
export async function getMatchById(id: string): Promise<MatchResponse> {
  try {
    return await apiClient<MatchResponse>(`/api/matches/${id}`);
  } catch (error) {
    return { ok: false, error: "Error al obtener la partida" };
  }
}

// POST /api/matches/[id]/report
export async function reportMatchResult(
  id: string,
  data: ReportResultRequest
): Promise<MatchResponse> {
  try {
    return await apiClient<MatchResponse>(`/api/matches/${id}/report`, {
      method: "POST",
      body: data,
    });
  } catch (error) {
    return { ok: false, error: "Error al reportar resultado" };
  }
}

// POST /api/matches/[id]/validate
export async function validateMatchResult(
  id: string,
  action: "APPROVE" | "REJECT",
  reason?: string
): Promise<MatchResponse> {
  try {
    return await apiClient<MatchResponse>(`/api/matches/${id}/validate`, {
      method: "POST",
      body: { action, reason },
    });
  } catch (error) {
    return { ok: false, error: "Error al validar resultado" };
  }
}