import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { z } from "zod";

type Params = { params: Promise<{ id: string }> };

const ValidateSchema = z.object({
  action: z.enum(["APPROVE", "REJECT"]),
  reason: z.string().optional(),
});

export async function POST(req: Request, { params }: Params) {
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
      return NextResponse.json(
        { ok: false, error: "Solo el staff puede validar resultados" },
        { status: 403 }
      );
    }

    const match = await prisma.match.findUnique({ where: { id } });

    if (!match) {
      return NextResponse.json({ ok: false, error: "Partida no encontrada" }, { status: 404 });
    }

    if (match.status !== "REPORTED") {
      return NextResponse.json(
        { ok: false, error: "Esta partida no tiene un resultado pendiente de validación" },
        { status: 400 }
      );
    }

    const body = await req.json().catch(() => null);
    const parsed = ValidateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ ok: false, error: "Datos inválidos" }, { status: 400 });
    }

    if (parsed.data.action === "APPROVE") {

      // 1 — Marca el partido como FINISHED
      await prisma.match.update({
        where: { id },
        data: {
          status: "FINISHED",
          validator: { connect: { id: session.userId } },
        },
      });

      const winnerId = match.winnerId;
      const loserId = winnerId === match.teamAId ? match.teamBId : match.teamAId;

      console.log(`Partido ${id} aprobado. Ganador: ${winnerId}, Perdedor: ${loserId}, Bracket: ${match.bracket}, Ronda: ${match.round}, Posición: ${match.position}`);

      // 2 — Avanza ganador al siguiente partido del mismo bracket
      const nextWinnerRound = match.round + 1;
      const nextWinnerPosition = match.bracket === "LOSERS"
        ? match.position
        : Math.ceil(match.position / 2);

      const nextWinnerMatch = await prisma.match.findFirst({
        where: {
          tournamentId: match.tournamentId,
          bracket: match.bracket,
          round: nextWinnerRound,
          position: nextWinnerPosition,
        },
      });

      console.log(`Siguiente partido ganador: ${nextWinnerMatch?.id ?? 'ninguno'} (ronda ${nextWinnerRound}, pos ${nextWinnerPosition})`);

     if (nextWinnerMatch && winnerId) {
        const slotA = !nextWinnerMatch.teamAId;
        await prisma.match.update({
          where: { id: nextWinnerMatch.id },
          data: slotA
            ? { teamA: { connect: { id: winnerId } } }
            : { teamB: { connect: { id: winnerId } } },
        });
        console.log(`Ganador colocado en slot ${slotA ? 'A' : 'B'} del partido ${nextWinnerMatch.id}`);
      }

      // 3 — Si es eliminación doble y el partido es del Winners bracket
// el perdedor baja al Losers bracket en la ronda correspondiente
if (match.bracket === "WINNERS" && loserId) {
  const loserRound = match.round;
  const loserPosition = Math.ceil(match.position / 2);

  const loserMatch = await prisma.match.findFirst({
    where: {
      tournamentId: match.tournamentId,
      bracket: "LOSERS",
      round: loserRound,
      position: loserPosition,
    },
  });

  console.log(`Partido losers encontrado: ${loserMatch?.id ?? 'ninguno'} (ronda ${loserRound}, pos ${loserPosition})`);

  if (loserMatch) {
    const slotA = !loserMatch.teamAId;
    await prisma.match.update({
      where: { id: loserMatch.id },
      data: slotA
        ? { teamA: { connect: { id: loserId } } }
        : { teamB: { connect: { id: loserId } } },
    });
    console.log(`Perdedor colocado en slot ${slotA ? 'A' : 'B'} del partido losers ${loserMatch.id}`);
  }
}

      // 4 — Si el partido es del Losers bracket, el ganador avanza en Losers
      // ya está cubierto por el paso 2 (mismo bracket)

      // 5 — Si el ganador del Losers va a la Gran Final
      if (match.bracket === "LOSERS" && !nextWinnerMatch && winnerId) {
        const grandFinal = await prisma.match.findFirst({
          where: {
            tournamentId: match.tournamentId,
            bracket: "GRAND_FINAL",
          },
        });

        if (grandFinal) {
          const slotA = !grandFinal.teamAId;
          await prisma.match.update({
            where: { id: grandFinal.id },
            data: slotA
              ? { teamA: { connect: { id: winnerId } } }
              : { teamB: { connect: { id: winnerId } } },
          });
          console.log(`Ganador de Losers colocado en Gran Final`);
        }
      }

      // 6 — Si el partido es del Winners y es la final, el ganador va a Gran Final
      if (match.bracket === "WINNERS" && !nextWinnerMatch && winnerId) {
        const grandFinal = await prisma.match.findFirst({
          where: {
            tournamentId: match.tournamentId,
            bracket: "GRAND_FINAL",
          },
        });

        if (grandFinal) {
          const slotA = !grandFinal.teamAId;
          await prisma.match.update({
            where: { id: grandFinal.id },
            data: slotA
              ? { teamA: { connect: { id: winnerId } } }
              : { teamB: { connect: { id: winnerId } } },
          });
          console.log(`Campeón de Winners colocado en Gran Final`);
        }
      }

      // 7 — Si es Gran Final, el ganador es campeón
      if (match.bracket === "GRAND_FINAL" && !nextWinnerMatch && winnerId) {
        await prisma.tournament.update({
          where: { id: match.tournamentId },
          data: { status: "FINISHED" },
        });
        console.log(`Torneo finalizado. Campeón: ${winnerId}`);
      }
      // 8 — Si es eliminación simple y no hay siguiente partido, el ganador es campeón
if (match.bracket === "WINNERS" && !nextWinnerMatch && winnerId) {
  const grandFinal = await prisma.match.findFirst({
    where: {
      tournamentId: match.tournamentId,
      bracket: "GRAND_FINAL",
    },
  });

  if (!grandFinal) {
    await prisma.tournament.update({
      where: { id: match.tournamentId },
      data: { status: "FINISHED" },
    });
    console.log(`Torneo de eliminación simple finalizado. Campeón: ${winnerId}`);
  }
}

    } else {
      // REJECT — regresa a PENDING
      await prisma.match.update({
        where: { id },
        data: {
          status: "PENDING",
          validator: { connect: { id: session.userId } },
          scoreA: null,
          scoreB: null,
          winner: { disconnect: true },
          reporter: { disconnect: true },
          evidenceUrl: null,
          playedAt: null,
        },
      });
    }

    const updated = await prisma.match.findUnique({ where: { id } });
    return NextResponse.json({ ok: true, match: updated });
  } catch (error) {
    console.error("POST /api/matches/[id]/validate error:", error);
    return NextResponse.json(
      { ok: false, error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}