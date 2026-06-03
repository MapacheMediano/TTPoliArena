import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function GET() {
  try {
    const session = await getSession();
    if (!session.userId) {
      return NextResponse.json({ ok: false, error: "No autenticado" }, { status: 401 });
    }

    // Equipos del usuario (capitán o miembro)
    const myTeamsMember = await prisma.teamMember.findMany({
      where: { userId: session.userId, status: "ACCEPTED" },
      select: { teamId: true },
    });
    const myTeamsCaptain = await prisma.team.findMany({
      where: { captainId: session.userId },
      select: { id: true },
    });

    const teamIds = [
      ...new Set([
        ...myTeamsMember.map(t => t.teamId),
        ...myTeamsCaptain.map(t => t.id),
      ])
    ];

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

    // Racha actual — partidas ganadas consecutivas más recientes
    const ultimasPartidas = await prisma.match.findMany({
      where: {
        status: "FINISHED",
        OR: [
          { teamAId: { in: teamIds } },
          { teamBId: { in: teamIds } },
        ],
      },
      orderBy: { updatedAt: "desc" },
      take: 20,
      select: { winnerId: true },
    });

    let racha = 0;
    for (const match of ultimasPartidas) {
      if (match.winnerId && teamIds.includes(match.winnerId)) {
        racha++;
      } else {
        break;
      }
    }

    // Torneos ganados — el equipo del usuario ganó la última partida del torneo
const torneosFinalizados = await prisma.tournament.findMany({
  where: {
    status: "FINISHED",
    registrations: { some: { userId: session.userId } },
  },
  select: {
    id: true,
    format: true,
    matches: {
      where: { 
        status: "FINISHED",
        bracket: { in: ["WINNERS", "GRAND_FINAL"] }
      },
      orderBy: [
        { bracket: "desc" },
        { round: "desc" },
      ],
      take: 1,
      select: { winnerId: true, bracket: true },
    },
  },
});

let torneosGanados = 0;
for (const torneo of torneosFinalizados) {
  const ultimaPartida = torneo.matches[0];
  if (ultimaPartida?.winnerId && teamIds.includes(ultimaPartida.winnerId)) {
    torneosGanados++;
  }
}
    return NextResponse.json({
      ok: true,
      stats: {
        torneosActivos,
        partidasJugadas,
        victorias,
        torneosGanados,
        racha,
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