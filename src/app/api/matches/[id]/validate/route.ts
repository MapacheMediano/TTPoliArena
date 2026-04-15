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
      // Aprueba el resultado
      await prisma.match.update({
        where: { id },
        data: {
          status: "FINISHED",
          validator: { connect: { id: session.userId } },
        },
      });

      // Avanza al ganador a la siguiente ronda
      if (match.winnerId) {
        const nextRound = match.round + 1;
        const nextPosition = Math.ceil(match.position / 2);

        const nextMatch = await prisma.match.findFirst({
          where: {
            tournamentId: match.tournamentId,
            bracket: match.bracket,
            round: nextRound,
            position: nextPosition,
          },
        });
        // Si no hay siguiente partida, es el campeón — marca el torneo como FINISHED
            if (!nextMatch && match.winnerId) {
            await prisma.tournament.update({
                where: { id: match.tournamentId },
                data: { status: "FINISHED" },
            });
            }

        if (nextMatch) {
          const isSlotA = match.position % 2 === 1;
          await prisma.match.update({
            where: { id: nextMatch.id },
            data: isSlotA
              ? { teamA: { connect: { id: match.winnerId } } }
              : { teamB: { connect: { id: match.winnerId } } },
          });
        }
      }
    } else {
      // Rechaza — regresa a PENDING
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