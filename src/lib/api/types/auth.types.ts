// Roles que maneja el sistema
export type UserRole = "PLAYER" | "ADMIN" | "STAFF" | "CAPTAIN";

// Usuario base que devuelven todos los endpoints de auth
export interface AuthUser {
  id: string;
  email: string;
  name?: string | null;
  role: UserRole;
}

// ─── REQUEST BODIES ───────────────────────────────────────

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
}

// ─── RESPONSES ────────────────────────────────────────────

export interface LoginResponse {
  ok: boolean;
  user?: AuthUser;
  error?: string;
}

export interface RegisterResponse {
  ok: boolean;
  user?: AuthUser;
  error?: string;
}

export interface MeResponse {
  ok: boolean;
  user: AuthUser | null;
}

// ─── PERFIL ───────────────────────────────────────────────

export interface PlayerProfile {
  id: string;
  userId: string;
  fullName: string | null;
  school: string | null;
  gamerTag: string | null;
  avatarUrl: string | null;
  createdAt: string;
  updatedAt: string;
  discord: string | null;
}

export interface UserProfile {
  id: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  PlayerProfile: PlayerProfile | null;
}

export interface MeProfileResponse {
  ok: boolean;
  user?: UserProfile;
  error?: string;
}

export interface UpdateProfileRequest {
  fullName?: string;
  school?: string;
  gamerTag?: string;
  avatarUrl?: string;
  discord?: string;
}

export interface UpdateProfileResponse {
  ok: boolean;
  message?: string;
  profile?: PlayerProfile;
  error?: string;
}

// ─── TORNEOS ──────────────────────────────────────────────

export interface TournamentFromAPI {
  id: string;
  title: string;
  game: string;
  description: string | null;
  format: string;
  maxPlayers: number;
  startDate: string;
  endDate: string | null;
  status: string;
  createdAt: string;
  reglamentoUrl?: string | null;
  imageUrl?: string | null;
  _count?: { registrations: number };
}

export interface MyTournamentsResponse {
  ok: boolean;
  tournaments?: TournamentFromAPI[];
  error?: string;
}