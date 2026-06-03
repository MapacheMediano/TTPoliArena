import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function GET() {
  try {
    const session = await getSession();

    if (!session.userId) {
      return NextResponse.json(
        { ok: false, error: "No autorizado" },
        { status: 401 }
      );
    }

    const tournaments = await prisma.tournament.findMany({
      where: {
        registrations: {
          some: {
            userId: session.userId,
          },
        },
      },
      orderBy: {
        startDate: "asc",
      },
      select: {
        id: true,
        title: true,
        game: true,
        description: true,
        format: true,
        maxPlayers: true,
        startDate: true,
        endDate: true,
        status: true,
        createdAt: true,
        imageUrl: true,
        registrations: {
        where: { userId: session.userId },
        select: {
        teamId: true,
        team: {
        select: { name: true, tag: true }
      }
    }
  }
},
    });

    return NextResponse.json({
      ok: true,
      tournaments,
    });
  } catch (error) {
    console.error("Error en /api/me/tournaments:", error);

    return NextResponse.json(
      { ok: false, error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}