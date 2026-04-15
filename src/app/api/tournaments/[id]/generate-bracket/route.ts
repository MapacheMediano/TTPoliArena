import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

type Params = { params: Promise<{ id: string }> };

// Utilidad: siguiente potencia de 2
function nextPowerOf2(n: number): number {
  let p = 1;
  while (p < n) p *= 2;
  return p;
}

// Mezcla aleatoria (Fisher-Yates)
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export async function POST(_req: Request, { params }: Params) {
  try {
    const { id } = await params;
    const session = await getSession();

    if (!session.userId) {
      return NextResponse.json({ ok: false, error: "No autenticado" }, { status: 401 });
    }

    // Solo ADMIN o STAFF pueden generar brackets
    const currentUser = await prisma.user.findUnique({
      where: { id: session.userId },
      select: { role: true },
    });

    if (!["ADMIN", "STAFF"].includes(currentUser?.role ?? "")) {
      return NextResponse.json({ ok: false, error: "No autorizado" }, { status: 403 });
    }

    const tournament = await prisma.tournament.findUnique({
      where: { id },
      include: {
        registrations: { include: { user: true } },
        matches: true,
      },
    });

    if (!tournament) {
      return NextResponse.json({ ok: false, error: "Torneo no encontrado" }, { status: 404 });
    }

    if (tournament.matches.length > 0) {
      return NextResponse.json({ ok: false, error: "El bracket ya fue generado" }, { status: 400 });
    }

    // Obtiene los equipos inscritos
    // Obtiene equipos de los capitanes inscritos del mismo juego
        const teams = await prisma.team.findMany({
        where: {
            captainId: { in: tournament.registrations.map(r => r.userId) },
            game: tournament.game,
        },
        });

    if (teams.length < 2) {
      return NextResponse.json(
        { ok: false, error: "Se necesitan al menos 2 equipos para generar el bracket" },
        { status: 400 }
      );
    }

    const shuffledTeams = shuffle(teams);
    const format = tournament.format;
    const matches: any[] = [];

    if (format === "eliminacion_simple") {
      // Eliminación simple
      const slots = nextPowerOf2(shuffledTeams.length);
      const totalRounds = Math.log2(slots);

      // Ronda 1 — empareja equipos
      for (let i = 0; i < slots / 2; i++) {
        const teamA = shuffledTeams[i * 2] ?? null;
        const teamB = shuffledTeams[i * 2 + 1] ?? null;
        matches.push({
          tournamentId: id,
          teamAId: teamA?.id ?? null,
          teamBId: teamB?.id ?? null,
          winnerId: !teamB ? teamA?.id : null, // bye automático
          round: 1,
          position: i + 1,
          status: !teamB ? "BYE" : "PENDING",
          bracket: "WINNERS",
        });
      }

      // Rondas siguientes — slots vacíos
      for (let r = 2; r <= totalRounds; r++) {
        const matchesInRound = slots / Math.pow(2, r);
        for (let i = 0; i < matchesInRound; i++) {
          matches.push({
            tournamentId: id,
            teamAId: null,
            teamBId: null,
            round: r,
            position: i + 1,
            status: "PENDING",
            bracket: "WINNERS",
          });
        }
      }

    } else if (format === "round_robin") {
      // Round Robin — todos contra todos
      let position = 1;
      for (let i = 0; i < shuffledTeams.length; i++) {
        for (let j = i + 1; j < shuffledTeams.length; j++) {
          matches.push({
            tournamentId: id,
            teamAId: shuffledTeams[i].id,
            teamBId: shuffledTeams[j].id,
            round: 1,
            position: position++,
            status: "PENDING",
            bracket: "ROUND_ROBIN",
          });
        }
      }

    } else if (format === "eliminacion_doble") {
      // Eliminación doble — winners bracket igual a simple
      const slots = nextPowerOf2(shuffledTeams.length);
      const totalRounds = Math.log2(slots);

      for (let i = 0; i < slots / 2; i++) {
        const teamA = shuffledTeams[i * 2] ?? null;
        const teamB = shuffledTeams[i * 2 + 1] ?? null;
        matches.push({
          tournamentId: id,
          teamAId: teamA?.id ?? null,
          teamBId: teamB?.id ?? null,
          winnerId: !teamB ? teamA?.id : null,
          round: 1,
          position: i + 1,
          status: !teamB ? "BYE" : "PENDING",
          bracket: "WINNERS",
        });
      }

      for (let r = 2; r <= totalRounds; r++) {
        const matchesInRound = slots / Math.pow(2, r);
        for (let i = 0; i < matchesInRound; i++) {
          matches.push({
            tournamentId: id,
            teamAId: null,
            teamBId: null,
            round: r,
            position: i + 1,
            status: "PENDING",
            bracket: "WINNERS",
          });
        }
      }

      // Losers bracket — rondas iniciales
      const loserRounds = (totalRounds - 1) * 2;
      for (let r = 1; r <= loserRounds; r++) {
        const matchesInRound = Math.max(1, slots / Math.pow(2, Math.ceil(r / 2) + 1));
        for (let i = 0; i < matchesInRound; i++) {
          matches.push({
            tournamentId: id,
            teamAId: null,
            teamBId: null,
            round: r,
            position: i + 1,
            status: "PENDING",
            bracket: "LOSERS",
          });
        }
      }

      // Gran final
      matches.push({
        tournamentId: id,
        teamAId: null,
        teamBId: null,
        round: 1,
        position: 1,
        status: "PENDING",
        bracket: "GRAND_FINAL",
      });
    }

    // Guarda todos los partidos
    await prisma.match.createMany({ data: matches });
        // Avanza automáticamente los byes a la siguiente ronda
       // Avanza automáticamente los byes a la siguiente ronda
const byeMatches = await prisma.match.findMany({
  where: { tournamentId: id, status: "BYE" },
});
console.log('Bye matches encontrados:', byeMatches.length);
console.log('Bye matches data:', JSON.stringify(byeMatches, null, 2));
for (const byeMatch of byeMatches) {
  const winnerId = byeMatch.teamAId; // en bye siempre teamA es el que avanza
  if (!winnerId) continue;

  const nextRound = byeMatch.round + 1;
  const nextPosition = Math.ceil(byeMatch.position / 2);

  const nextMatch = await prisma.match.findFirst({
    where: {
      tournamentId: id,
      bracket: byeMatch.bracket,
      round: nextRound,
      position: nextPosition,
    },
  });

  if (nextMatch) {
    const isSlotA = byeMatch.position % 2 === 1;
    await prisma.match.update({
      where: { id: nextMatch.id },
      data: isSlotA
        ? { teamA: { connect: { id: winnerId } } }
        : { teamB: { connect: { id: winnerId } } },
    });
  }
} 
    // Actualiza el status del torneo
    await prisma.tournament.update({
      where: { id },
      data: { status: "IN_PROGRESS" },
    });

    const createdMatches = await prisma.match.findMany({
      where: { tournamentId: id },
      orderBy: [{ bracket: "asc" }, { round: "asc" }, { position: "asc" }],
    });

    return NextResponse.json({ ok: true, matches: createdMatches });
  } catch (error) {
    console.error("POST generate-bracket error:", error);
    return NextResponse.json({ ok: false, error: "Error interno del servidor" }, { status: 500 });
  }
}