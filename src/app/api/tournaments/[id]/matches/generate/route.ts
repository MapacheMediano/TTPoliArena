import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

type Params = {
  params: Promise<{
    id: string;
  }>;
};

export async function POST(_req: Request, { params }: Params) {
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
      include: {
        registrations: {
          orderBy: {
            createdAt: "asc",
          },
        },
        matches: true,
      },
    });

    if (!tournament) {
      return NextResponse.json(
        { ok: false, error: "Torneo no encontrado" },
        { status: 404 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: {
        id: true,
        role: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { ok: false, error: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    const canGenerate =
      tournament.creatorId === session.userId ||
      user.role === "STAFF" ||
      user.role === "ADMIN";

    if (!canGenerate) {
      return NextResponse.json(
        { ok: false, error: "No autorizado para generar matches" },
        { status: 403 }
      );
    }

    if (tournament.matches.length > 0) {
      return NextResponse.json(
        { ok: false, error: "Los matches ya fueron generados" },
        { status: 409 }
      );
    }

    const registrations = tournament.registrations;

    if (registrations.length < 2) {
      return NextResponse.json(
        { ok: false, error: "No hay suficientes participantes para generar matches" },
        { status: 400 }
      );
    }

    if (registrations.length % 2 !== 0) {
      return NextResponse.json(
        { ok: false, error: "Por ahora solo se permiten cantidades pares de participantes" },
        { status: 400 }
      );
    }

    const matchesData = [];

    for (let i = 0; i < registrations.length; i += 2) {
      const player1 = registrations[i];
      const player2 = registrations[i + 1];

      matchesData.push({
        tournamentId,
        round: 1,
        position: i / 2 + 1,
        player1Id: player1.userId,
        player2Id: player2.userId,
        status: "PENDING",
      });
    }

    await prisma.match.createMany({
      data: matchesData,
    });

    const createdMatches = await prisma.match.findMany({
      where: { tournamentId },
      orderBy: [
        { round: "asc" },
        { position: "asc" },
      ],
    });

    return NextResponse.json({
      ok: true,
      message: "Matches generados correctamente",
      matches: createdMatches,
    });
  } catch (error) {
    console.error("POST /api/tournaments/[id]/matches/generate error:", error);

    return NextResponse.json(
      { ok: false, error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}