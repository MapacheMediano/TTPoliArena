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

    const participants = await prisma.tournamentRegistration.findMany({
      where: { tournamentId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            PlayerProfile: {
              select: {
                fullName: true,
                gamerTag: true,
                school: true,
                avatarUrl: true,
              },
            },
          },
        },
      },
    });

    const formattedParticipants = participants.map((p) => ({
      id: p.user.id,
      email: p.user.email,
      fullName: p.user.PlayerProfile?.fullName || null,
      gamerTag: p.user.PlayerProfile?.gamerTag || null,
      school: p.user.PlayerProfile?.school || null,
      avatarUrl: p.user.PlayerProfile?.avatarUrl || null,
      joinedAt: p.createdAt,
    }));

    return NextResponse.json({
      ok: true,
      participants: formattedParticipants,
    });
  } catch (error) {
    console.error("GET participants error:", error);

    return NextResponse.json(
      { ok: false, error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}