import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Params = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(_req: Request, { params }: Params) {
  try {
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

    const matches = await prisma.match.findMany({
      where: { tournamentId },
      include: {
        player1: {
          select: {
            id: true,
            email: true,
            PlayerProfile: {
              select: {
                fullName: true,
                gamerTag: true,
                avatarUrl: true,
              },
            },
          },
        },
        player2: {
          select: {
            id: true,
            email: true,
            PlayerProfile: {
              select: {
                fullName: true,
                gamerTag: true,
                avatarUrl: true,
              },
            },
          },
        },
        winner: {
          select: {
            id: true,
            email: true,
            PlayerProfile: {
              select: {
                fullName: true,
                gamerTag: true,
                avatarUrl: true,
              },
            },
          },
        },
      },
      orderBy: [{ round: "asc" }, { position: "asc" }],
    });

    const formattedMatches = matches.map((match) => ({
      id: match.id,
      tournamentId: match.tournamentId,
      round: match.round,
      position: match.position,
      score: match.score,
      status: match.status,
      createdAt: match.createdAt,
      updatedAt: match.updatedAt,

      player1: match.player1
        ? {
            id: match.player1.id,
            email: match.player1.email,
            fullName: match.player1.PlayerProfile?.fullName || null,
            gamerTag: match.player1.PlayerProfile?.gamerTag || null,
            avatarUrl: match.player1.PlayerProfile?.avatarUrl || null,
          }
        : null,

      player2: match.player2
        ? {
            id: match.player2.id,
            email: match.player2.email,
            fullName: match.player2.PlayerProfile?.fullName || null,
            gamerTag: match.player2.PlayerProfile?.gamerTag || null,
            avatarUrl: match.player2.PlayerProfile?.avatarUrl || null,
          }
        : null,

      winner: match.winner
        ? {
            id: match.winner.id,
            email: match.winner.email,
            fullName: match.winner.PlayerProfile?.fullName || null,
            gamerTag: match.winner.PlayerProfile?.gamerTag || null,
            avatarUrl: match.winner.PlayerProfile?.avatarUrl || null,
          }
        : null,
    }));

    return NextResponse.json({
      ok: true,
      matches: formattedMatches,
    });
  } catch (error) {
    console.error("GET /api/tournaments/[id]/matches error:", error);

    return NextResponse.json(
      { ok: false, error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}