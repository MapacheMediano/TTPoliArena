import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const teams = await prisma.team.findMany({
      include: {
        _count: {
          select: {
            matchesWon: true,
            matchesAsTeamA: true,
            matchesAsTeamB: true,
          },
        },
      },
    });

    if (teams.length === 0) {
      return NextResponse.json({ ok: true, rankings: [] });
    }

    const rankings = teams.map((team: any) => {
      const victorias = team._count.matchesWon;
      const totalPartidas = team._count.matchesAsTeamA + team._count.matchesAsTeamB;
      const derrotas = totalPartidas - victorias;
      const puntos = victorias * 100 + totalPartidas * 10;

      return {
        posicion: 0,
        equipo: team.name,
        tag: team.tag,
        juego: team.game,
        victorias,
        derrotas,
        puntos,
        racha: victorias > 0 ? 'W' + victorias : 'N/A',
        cambio: 'same' as const,
      };
    });

    // Ordena por puntos y asigna posiciones
    rankings.sort((a: any, b: any) => b.puntos - a.puntos);
    rankings.forEach((r: any, i: number) => { r.posicion = i + 1; });

    return NextResponse.json({ ok: true, rankings });
  } catch (error) {
    console.error("GET /api/rankings error:", error);
    return NextResponse.json(
      { ok: false, error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}