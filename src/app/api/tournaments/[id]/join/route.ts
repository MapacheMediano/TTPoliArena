import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { isTeamGame } from "@/lib/gameConfig";

type Params = { params: Promise<{ id: string }> };

export async function POST(req: Request, { params }: Params) {
  try {
    const { id } = await params;
    const session = await getSession();

    if (!session.userId) {
      return NextResponse.json({ ok: false, error: "No autenticado" }, { status: 401 });
    }

    const tournament = await prisma.tournament.findUnique({
      where: { id },
      select: {
        id: true,
        status: true,
        maxPlayers: true,
        game: true,
        _count: { select: { registrations: true } },
      },
    });

    if (!tournament) {
      return NextResponse.json({ ok: false, error: "Torneo no encontrado" }, { status: 404 });
    }

    if (tournament.status !== "OPEN") {
      return NextResponse.json(
        { ok: false, error: "El torneo no está abierto para inscripciones" },
        { status: 400 }
      );
    }

    if (tournament._count.registrations >= tournament.maxPlayers) {
      return NextResponse.json({ ok: false, error: "El torneo ya está lleno" }, { status: 400 });
    }

    // Si es juego de equipo — validar que sea capitán y tenga equipo del mismo juego
    if (isTeamGame(tournament.game)) {
      const body = await req.json().catch(() => null);
      const teamId = body?.teamId as string | undefined;

      if (!teamId) {
        return NextResponse.json(
          { ok: false, error: "Debes seleccionar un equipo para inscribirte" },
          { status: 400 }
        );
      }

      // Verifica que el equipo existe y el usuario es capitán
      const team = await prisma.team.findUnique({
        where: { id: teamId },
        select: { id: true, captainId: true, game: true },
      });

      if (!team) {
        return NextResponse.json({ ok: false, error: "Equipo no encontrado" }, { status: 404 });
      }

      if (team.captainId !== session.userId) {
        return NextResponse.json(
          { ok: false, error: "Solo el capitán puede inscribir al equipo" },
          { status: 403 }
        );
      }

      if (team.game.toLowerCase() !== tournament.game.toLowerCase()) {
        return NextResponse.json(
          { ok: false, error: `El equipo debe ser de ${tournament.game}` },
          { status: 400 }
        );
      }
    }

    // Verifica que el usuario no esté ya inscrito
    const existing = await prisma.tournamentRegistration.findUnique({
      where: {
        userId_tournamentId: { userId: session.userId, tournamentId: id },
      },
    });

    if (existing) {
      return NextResponse.json(
        { ok: false, error: "Ya estás inscrito en este torneo" },
        { status: 409 }
      );
    }

    const registration = await prisma.tournamentRegistration.create({
      data: { userId: session.userId, tournamentId: id },
    });

    return NextResponse.json({ ok: true, registration }, { status: 201 });
  } catch (error) {
    console.error("POST /api/tournaments/[id]/join error:", error);
    return NextResponse.json({ ok: false, error: "Error interno del servidor" }, { status: 500 });
  }
}