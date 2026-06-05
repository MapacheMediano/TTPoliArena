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

      console.log(`Partido ${id} aprobado. Ganador: ${winnerId}, Perdedor: ${loserId}, Bracket: ${match.bracket}`);

      // 2 — Avanza ganador usando nextWinnerMatchId
      if (match.nextWinnerMatchId && winnerId) {
        const nextWinnerMatch = await prisma.match.findUnique({
          where: { id: match.nextWinnerMatchId },
        });

        if (nextWinnerMatch) {
          const slotA = !nextWinnerMatch.teamAId;
          await prisma.match.update({
            where: { id: nextWinnerMatch.id },
            data: slotA
              ? { teamA: { connect: { id: winnerId } } }
              : { teamB: { connect: { id: winnerId } } },
          });
          console.log(`Ganador colocado en ${slotA ? 'slot A' : 'slot B'} de ${nextWinnerMatch.id}`);
        }
      }

      // 3 — Manda perdedor a Losers usando nextLoserMatchId
      if (match.nextLoserMatchId && loserId) {
        const nextLoserMatch = await prisma.match.findUnique({
          where: { id: match.nextLoserMatchId },
        });

        if (nextLoserMatch) {
          const slotA = !nextLoserMatch.teamAId;
          await prisma.match.update({
            where: { id: nextLoserMatch.id },
            data: slotA
              ? { teamA: { connect: { id: loserId } } }
              : { teamB: { connect: { id: loserId } } },
          });
          console.log(`Perdedor colocado en ${slotA ? 'slot A' : 'slot B'} de ${nextLoserMatch.id}`);
        }
      }

      // 4 — Si no hay nextWinnerMatchId y es GRAND_FINAL o WINNERS sin Gran Final → torneo finalizado
      if (!match.nextWinnerMatchId && winnerId) {
        if (match.bracket === "GRAND_FINAL") {
          await prisma.tournament.update({
            where: { id: match.tournamentId },
            data: { status: "FINISHED" },
          });
          console.log(`Torneo finalizado. Campeón: ${winnerId}`);
        }

        if (match.bracket === "WINNERS") {
          const grandFinal = await prisma.match.findFirst({
            where: { tournamentId: match.tournamentId, bracket: "GRAND_FINAL" },
          });
          if (!grandFinal) {
            await prisma.tournament.update({
              where: { id: match.tournamentId },
              data: { status: "FINISHED" },
            });
            console.log(`Torneo eliminación simple finalizado. Campeón: ${winnerId}`);
          }
        }
      }
      // Verificar si el torneo debe finalizar
const pendingMatches = await prisma.match.count({
  where: {
    tournamentId: match.tournamentId,
    status: { in: ["PENDING", "REPORTED"] },
  },
});

if (pendingMatches === 0) {
  await prisma.tournament.update({
    where: { id: match.tournamentId },
    data: { status: "FINISHED" },
  });
  console.log(`Torneo ${match.tournamentId} finalizado - todos los partidos completados`);
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