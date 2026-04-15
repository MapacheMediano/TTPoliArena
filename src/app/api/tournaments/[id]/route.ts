import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isTeamGame } from "@/lib/gameConfig";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Params) {
  try {
    const { id } = await params;

    const tournament = await prisma.tournament.findUnique({
      where: { id },
      include: {
        registrations: {
          select: {
            id: true,
            userId: true,
            createdAt: true,
            user: {
              select: {
                id: true,
                email: true,
                PlayerProfile: {
                  select: { fullName: true, gamerTag: true, school: true },
                },
              },
            },
          },
        },
      },
    });

    if (!tournament) {
      return NextResponse.json(
        { ok: false, error: "Torneo no encontrado" },
        { status: 404 }
      );
    }

    // Si es juego de equipo, busca el equipo de cada capitán inscrito
    let teamsInscribed: any[] = [];
    if (isTeamGame(tournament.game)) {
      teamsInscribed = await prisma.team.findMany({
        where: {
          captainId: { in: tournament.registrations.map(r => r.userId) },
          game: tournament.game,
        },
        include: {
          captain: {
            select: {
              id: true,
              email: true,
              PlayerProfile: { select: { fullName: true, gamerTag: true } },
            },
          },
          members: {
            include: {
              user: {
                select: {
                  id: true,
                  email: true,
                  PlayerProfile: { select: { fullName: true, gamerTag: true } },
                },
              },
            },
          },
        },
      });
    }

    return NextResponse.json({
      ok: true,
      tournament,
      teamsInscribed,
      isTeamGame: isTeamGame(tournament.game),
    });
  } catch (error) {
    console.error("GET /api/tournaments/[id] error:", error);
    return NextResponse.json(
      { ok: false, error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}