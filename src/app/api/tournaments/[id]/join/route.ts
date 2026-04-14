import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

type Params = {
  params: Promise<{ id: string }>;
};

export async function POST(_req: Request, { params }: Params) {
  try {
    const { id } = await params;
    const session = await getSession();

    if (!session.userId) {
      return NextResponse.json(
        { ok: false, error: "No autenticado" },
        { status: 401 }
      );
    }

    const tournament = await prisma.tournament.findUnique({
      where: { id },
      select: {
        id: true,
        status: true,
        maxPlayers: true,
        _count: { select: { registrations: true } },
      },
    });

    if (!tournament) {
      return NextResponse.json(
        { ok: false, error: "Torneo no encontrado" },
        { status: 404 }
      );
    }

    if (tournament.status !== "OPEN") {
      return NextResponse.json(
        { ok: false, error: "El torneo no está abierto para inscripciones" },
        { status: 400 }
      );
    }

    if (tournament._count.registrations >= tournament.maxPlayers) {
      return NextResponse.json(
        { ok: false, error: "El torneo ya está lleno" },
        { status: 400 }
      );
    }

    const existing = await prisma.tournamentRegistration.findUnique({
      where: {
        userId_tournamentId: {
          userId: session.userId,
          tournamentId: id,
        },
      },
    });

    if (existing) {
      return NextResponse.json(
        { ok: false, error: "Ya estás inscrito en este torneo" },
        { status: 409 }
      );
    }

    const registration = await prisma.tournamentRegistration.create({
      data: {
        userId: session.userId,
        tournamentId: id,
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