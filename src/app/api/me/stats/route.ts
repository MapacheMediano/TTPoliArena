import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function GET() {
  try {
    const session = await getSession();
    if (!session.userId) {
      return NextResponse.json({ ok: false, error: "No autenticado" }, { status: 401 });
    }

    // Equipos del usuario
    const myTeams = await prisma.team.findMany({
      where: { captainId: session.userId },
      select: { id: true },
    });
    const teamIds = myTeams.map(t => t.id);

    // Torneos activos
    const torneosActivos = await prisma.tournamentRegistration.count({
      where: {
        userId: session.userId,
        tournament: { status: "IN_PROGRESS" },
      },
    });

    // Partidas jugadas
    const partidasJugadas = await prisma.match.count({
      where: {
        status: "FINISHED",
        OR: [
          { teamAId: { in: teamIds } },
          { teamBId: { in: teamIds } },
        ],
      },
    });

    // Victorias
    const victorias = await prisma.match.count({
      where: {
        status: "FINISHED",
        winnerId: { in: teamIds },
      },
    });

    // Torneos ganados
    const torneosGanados = await prisma.tournamentRegistration.count({
      where: {
        userId: session.userId,
        tournament: {
          status: "FINISHED",
          matches: {
            some: {
              bracket: { in: ["WINNERS", "GRAND_FINAL"] },
              winnerId: { in: teamIds },
              round: { gte: 1 },
            },
          },
        },
      },
    });

    return NextResponse.json({
      ok: true,
      stats: {
        torneosActivos,
        partidasJugadas,
        victorias,
        torneosGanados,
        racha: torneosGanados,
      },
    });
  } catch (error) {
    console.error("GET /api/me/stats error:", error);
    return NextResponse.json(
      { ok: false, error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}