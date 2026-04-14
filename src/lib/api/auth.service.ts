import { apiClient } from "./client";
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  MeResponse,
} from "./types/auth.types";

// POST /api/auth/login
export async function loginUser(
  credentials: LoginRequest
): Promise<LoginResponse> {
  try {
    return await apiClient<LoginResponse>("/api/auth/login", {
      method: "POST",
      body: credentials,
    });
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Error al iniciar sesión",
    };
  }
}

// POST /api/auth/register
export async function registerUser(
  data: RegisterRequest
): Promise<RegisterResponse> {
  try {
    return await apiClient<RegisterResponse>("/api/auth/register", {
      method: "POST",
      body: data,
    });
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Error al registrarse",
    };
  }
}

// GET /api/auth/me
export async function getCurrentUser(): Promise<MeResponse> {
  try {
    return await apiClient<MeResponse>("/api/auth/me");
  } catch (error) {
    return { ok: true, user: null };
  }
}

// POST /api/auth/logout
export async function logoutUser(): Promise<void> {
  await apiClient("/api/auth/logout", { method: "POST" });
}

import type {
  MeProfileResponse,
  UpdateProfileRequest,
  UpdateProfileResponse,
  MyTournamentsResponse,
} from "./types/auth.types";

// GET /api/me/profile
export async function getMyProfile(): Promise<MeProfileResponse> {
  try {
    return await apiClient<MeProfileResponse>("/api/me/profile");
  } catch (error) {
    return { ok: false, error: "Error al obtener perfil" };
  }
}

// PUT /api/me/profile
export async function updateMyProfile(
  data: UpdateProfileRequest
): Promise<UpdateProfileResponse> {
  try {
    return await apiClient<UpdateProfileResponse>("/api/me/profile", {
      method: "PUT",
      body: data,
    });
  } catch (error) {
    return { ok: false, error: "Error al actualizar perfil" };
  }
}

// GET /api/me/tournaments
export async function getMyTournaments(): Promise<MyTournamentsResponse> {
  try {
    return await apiClient<MyTournamentsResponse>("/api/me/tournaments");
  } catch (error) {
    return { ok: false, tournaments: [], error: "Error al obtener torneos" };
  }
}