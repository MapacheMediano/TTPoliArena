import { apiClient } from "./client";

// ─── TYPES ────────────────────────────────────────────────

export interface TeamMemberUser {
  id: string;
  email: string;
  PlayerProfile: {
    fullName: string | null;
    gamerTag: string | null;
  } | null;
}

export interface TeamMember {
  id: string;
  teamId: string;
  userId: string;
  joinedAt: string;
  user: TeamMemberUser;
}

export interface Team {
  id: string;
  name: string;
  tag: string;
  game: string;
  captainId: string;
  createdAt: string;
  updatedAt: string;
  captain: TeamMemberUser;
  members: TeamMember[];
}

export interface TeamsResponse {
  ok: boolean;
  teams?: Team[];
  error?: string;
}

export interface TeamResponse {
  ok: boolean;
  team?: Team;
  error?: string;
}

export interface CreateTeamRequest {
  name: string;
  tag: string;
  game: string;
}

export interface AddMemberRequest {
  email: string;
}

// ─── SERVICES ─────────────────────────────────────────────

// GET /api/teams — mis equipos
export async function getMyTeams(): Promise<TeamsResponse> {
  try {
    return await apiClient<TeamsResponse>("/api/teams");
  } catch (error) {
    return { ok: false, error: "Error al obtener equipos" };
  }
}

// POST /api/teams — crear equipo
export async function createTeam(data: CreateTeamRequest): Promise<TeamResponse> {
  try {
    return await apiClient<TeamResponse>("/api/teams", {
      method: "POST",
      body: data,
    });
  } catch (error) {
    return { ok: false, error: "Error al crear equipo" };
  }
}

// GET /api/teams/[id]
export async function getTeamById(id: string): Promise<TeamResponse> {
  try {
    return await apiClient<TeamResponse>(`/api/teams/${id}`);
  } catch (error) {
    return { ok: false, error: "Error al obtener equipo" };
  }
}

// DELETE /api/teams/[id]
export async function deleteTeam(id: string): Promise<{ ok: boolean; error?: string }> {
  try {
    return await apiClient(`/api/teams/${id}`, { method: "DELETE" });
  } catch (error) {
    return { ok: false, error: "Error al eliminar equipo" };
  }
}

// POST /api/teams/[id]/members — agregar miembro
export async function addTeamMember(
  teamId: string,
  data: AddMemberRequest
): Promise<{ ok: boolean; member?: TeamMember; error?: string }> {
  try {
    return await apiClient(`/api/teams/${teamId}/members`, {
      method: "POST",
      body: data,
    });
  } catch (error) {
    return { ok: false, error: "Error al agregar miembro" };
  }
}

// DELETE /api/teams/[id]/members — eliminar miembro
export async function removeTeamMember(
  teamId: string,
  userId: string
): Promise<{ ok: boolean; error?: string }> {
  try {
    return await apiClient(`/api/teams/${teamId}/members`, {
      method: "DELETE",
      body: { userId },
    });
  } catch (error) {
    return { ok: false, error: "Error al eliminar miembro" };
  }
}