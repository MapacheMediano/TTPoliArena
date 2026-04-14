import { apiClient } from "./client";
import type { RankingEntry } from "@/components/rankings/RankingTable";

export interface RankingsResponse {
  ok: boolean;
  rankings?: RankingEntry[];
  error?: string;
}

export async function getRankings(): Promise<RankingsResponse> {
  try {
    return await apiClient<RankingsResponse>("/api/rankings");
  } catch (error) {
    return { ok: false, error: "Error al obtener rankings" };
  }
}