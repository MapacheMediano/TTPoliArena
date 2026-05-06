import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { isTeamGame } from "@/lib/gameConfig";

type Params = { params: Promise<{ id: string }> };

function nextPowerOf2(n: number): number {
  let p = 1;
  while (p < n) p *= 2;
  return p;
}

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


// Obtiene participantes según el tipo de juego
let participants: { id: string; name: string; tag: string }[] = [];

if (isTeamGame(tournament.game)) {
  const teams = await prisma.team.findMany({
    where: {
      captainId: { in: tournament.registrations.map(r => r.userId) },
      game: tournament.game,
    },
    select: { id: true, name: true, tag: true },
  });
  participants = teams;
} else {
  // Juego individual — crea equipos virtuales por cada jugador
  const users = await prisma.user.findMany({
    where: { id: { in: tournament.registrations.map(r => r.userId) } },
    include: { PlayerProfile: { select: { fullName: true, gamerTag: true } } },
  });

  // Busca o crea un equipo virtual por cada jugador
  for (const u of users) {
    const tag = (u.PlayerProfile?.gamerTag ?? u.email.split('@')[0])
      .slice(0, 4)
      .toUpperCase();
    const name = u.PlayerProfile?.fullName ?? u.email.split('@')[0];

    // Busca si ya tiene equipo del mismo juego
    let team = await prisma.team.findFirst({
      where: { captainId: u.id, game: tournament.game },
    });

    // Si no tiene, crea uno virtual
    if (!team) {
      team = await prisma.team.create({
        data: {
          name,
          tag: tag + '_' + u.id.slice(-4),
          game: tournament.game,
          captainId: u.id,
        },
      });
    }

    participants.push({ id: team.id, name: team.name, tag: team.tag });
  }
}

if (participants.length < 2) {
  return NextResponse.json(
    { ok: false, error: "Se necesitan al menos 2 participantes para generar el bracket" },
    { status: 400 }
  );
}

const shuffledTeams = shuffle(participants);
    const format = tournament.format;
    const matches: any[] = [];

    if (format === "eliminacion_simple") {
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

    } else if (format === "eliminacion_doble") {
      const slots = nextPowerOf2(shuffledTeams.length);
      const wRounds = Math.log2(slots); // rondas del winners

      // Winners bracket
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

      for (let r = 2; r <= wRounds; r++) {
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

      // Losers bracket
      // Ronda L1: losers de W1 se enfrentan entre sí
      // Ronda L2: ganadores de L1 vs losers de W2
      // etc.
      const lRounds = (wRounds - 1) * 2;
      for (let r = 1; r <= lRounds; r++) {
        // Número de partidos en cada ronda del losers
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

      // Gran Final
      matches.push({
        tournamentId: id,
        teamAId: null,
        teamBId: null,
        round: 1,
        position: 1,
        status: "PENDING",
        bracket: "GRAND_FINAL",
      });

    } else if (format === "round_robin") {
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
    }

    await prisma.match.createMany({ data: matches });

    // Avanza byes automáticamente
    const byeMatches = await prisma.match.findMany({
      where: { tournamentId: id, status: "BYE" },
    });

    for (const byeMatch of byeMatches) {
      const winnerId = byeMatch.teamAId;
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