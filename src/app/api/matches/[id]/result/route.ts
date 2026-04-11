import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { z } from "zod";

type Params = {
  params: Promise<{
    id: string;
  }>;
};

const MatchResultSchema = z.object({
  winnerId: z.string(),
  score: z.string(),
});

export async function POST(req: Request, { params }: Params) {
  try {
    const session = await getSession();

    if (!session || !session.userId) {
      return NextResponse.json(
        { ok: false, error: "No autenticado" },
        { status: 401 }
      );
    }

    const { id: matchId } = await params;

    const body = await req.json().catch(() => null);

    if (!body) {
      return NextResponse.json(
        { ok: false, error: "Body inválido" },
        { status: 400 }
      );
    }

    const parsed = MatchResultSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: "Datos inválidos" },
        { status: 400 }
      );
    }

    const match = await prisma.match.findUnique({
      where: { id: matchId },
      include: {
        tournament: true,
      },
    });

    if (!match) {
      return NextResponse.json(
        { ok: false, error: "Match no encontrado" },
        { status: 404 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: { role: true },
    });

    const canReport =
      match.tournament.creatorId === session.userId ||
      user?.role === "STAFF" ||
      user?.role === "ADMIN";

    if (!canReport) {
      return NextResponse.json(
        { ok: false, error: "No autorizado" },
        { status: 403 }
      );
    }

    if (match.status === "COMPLETED") {
      return NextResponse.json(
        { ok: false, error: "Match ya completado" },
        { status: 409 }
      );
    }

    const { winnerId, score } = parsed.data;

    if (winnerId !== match.player1Id && winnerId !== match.player2Id) {
      return NextResponse.json(
        { ok: false, error: "Winner inválido" },
        { status: 400 }
      );
    }

    const updatedMatch = await prisma.match.update({
      where: { id: matchId },
      data: {
        winnerId,
        score,
        status: "COMPLETED",
      },
    });

    const currentRoundMatches = await prisma.match.count({
      where: {
        tournamentId: match.tournamentId,
        round: match.round,
      },
    });

    if (currentRoundMatches === 1) {
      return NextResponse.json({
        ok: true,
        message: "Resultado registrado correctamente. El torneo ya tiene ganador final.",
        match: updatedMatch,
      });
    }

    const nextRound = match.round + 1;
    const nextPosition = Math.ceil(match.position / 2);
    const isFirstSlot = match.position % 2 !== 0;

    const nextMatch = await prisma.match.findUnique({
      where: {
        tournamentId_round_position: {
          tournamentId: match.tournamentId,
          round: nextRound,
          position: nextPosition,
        },
      },
    });

    if (nextMatch) {
      await prisma.match.update({
        where: { id: nextMatch.id },
        data: isFirstSlot
          ? { player1Id: winnerId }
          : { player2Id: winnerId },
      });
    } else {
      await prisma.match.create({
        data: {
          tournamentId: match.tournamentId,
          round: nextRound,
          position: nextPosition,
          player1Id: isFirstSlot ? winnerId : null,
          player2Id: isFirstSlot ? null : winnerId,
          status: "PENDING",
        },
      });
    }

    return NextResponse.json({
      ok: true,
      message: "Resultado registrado y ganador avanzado correctamente",
      match: updatedMatch,
    });
  } catch (error) {
    console.error("POST /api/matches/[id]/result error:", error);

    return NextResponse.json(
      { ok: false, error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}