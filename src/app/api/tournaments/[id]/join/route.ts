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
    });

    if (!tournament) {
      return NextResponse.json(
        { ok: false, error: "Torneo no encontrado" },
        { status: 404 }
      );
    }

    if (tournament.status !== "OPEN") {
      return NextResponse.json(
        { ok: false, error: "El torneo no está abierto para registros" },
        { status: 400 }
      );
    }

    const existingRegistration =
      await prisma.tournamentRegistration.findUnique({
        where: {
          userId_tournamentId: {
            userId: session.userId,
            tournamentId,
          },
        },
      });

    if (existingRegistration) {
      return NextResponse.json(
        { ok: false, error: "Ya estás registrado en este torneo" },
        { status: 400 }
      );
    }

    const registrationsCount = await prisma.tournamentRegistration.count({
      where: { tournamentId },
    });

    if (registrationsCount >= tournament.maxPlayers) {
      return NextResponse.json(
        { ok: false, error: "El torneo ya alcanzó el límite de jugadores" },
        { status: 400 }
      );
    }

    const registration = await prisma.tournamentRegistration.create({
      data: {
        userId: session.userId,
        tournamentId,
      },
    });

    return NextResponse.json(
      { ok: true, registration },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/tournaments/[id]/join error:", error);

    return NextResponse.json(
      { ok: false, error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}