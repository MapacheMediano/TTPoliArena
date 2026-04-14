import { apiClient } from "./client";
import type { UserRole } from "./types/auth.types";

export interface AdminUser {
  id: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  PlayerProfile: {
    fullName: string | null;
    gamerTag: string | null;
    school: string | null;
  } | null;
  _count: {
    tournamentRegistrations: number;
  };
}

export interface AdminUsersResponse {
  ok: boolean;
  users?: AdminUser[];
  error?: string;
}

export interface UpdateUserResponse {
  ok: boolean;
  user?: { id: string; email: string; role: UserRole; isActive: boolean };
  error?: string;
}

// GET /api/admin/users
export async function getAdminUsers(): Promise<AdminUsersResponse> {
  try {
    return await apiClient<AdminUsersResponse>("/api/admin/users");
  } catch (error) {
    return { ok: false, error: "Error al obtener usuarios" };
  }
}

// PATCH /api/admin/users/[id]
export async function updateUserRole(
  id: string,
  role: UserRole
): Promise<UpdateUserResponse> {
  try {
    return await apiClient<UpdateUserResponse>(`/api/admin/users/${id}`, {
      method: "PATCH",
      body: { role },
    });
  } catch (error) {
    return { ok: false, error: "Error al actualizar rol" };
  }
}

// PATCH /api/admin/users/[id] — toggle isActive
export async function toggleUserStatus(
  id: string,
  isActive: boolean
): Promise<UpdateUserResponse> {
  try {
    return await apiClient<UpdateUserResponse>(`/api/admin/users/${id}`, {
      method: "PATCH",
      body: { isActive },
    });
  } catch (error) {
    return { ok: false, error: "Error al actualizar estado" };
  }
}