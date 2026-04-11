import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

type Params = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(_req: Request, { params }: Params) {
  try {
    const session = await getSession();

    if (!session || !session.userId) {
      return NextResponse.json(
        { ok: false, error: "No autenticado" },
        { status: 401 }
      );
    }

    const { id: tournamentId } = await params;

    const tournament = await prisma.tournament.findUnique({
      where: { id: tournamentId },
    });

    if (!tournament) {
      return NextResponse.json(
        { ok: false, error: "Torneo no encontrado" },
        { status: 404 }
      );
    }

    const registration = await prisma.tournamentRegistration.findUnique({
      where: {
        userId_tournamentId: {
          userId: session.userId,
          tournamentId,
        },
      },
    });

    const registrationsCount = await prisma.tournamentRegistration.count({
      where: { tournamentId },
    });

    const slotsAvailable = Math.max(
      tournament.maxPlayers - registrationsCount,
      0
    );

    const canJoin =
      tournament.status === "OPEN" &&
      !registration &&
      registrationsCount < tournament.maxPlayers;

    return NextResponse.json({
      ok: true,
      isJoined: !!registration,
      registrationsCount,
      maxPlayers: tournament.maxPlayers,
      slotsAvailable,
      tournamentStatus: tournament.status,
      canJoin,
    });
  } catch (error) {
    console.error("GET join-status error:", error);

    return NextResponse.json(
      { ok: false, error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}