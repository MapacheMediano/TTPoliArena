import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const tournaments = await prisma.tournament.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      ok: true,
      tournaments,
    });
  } catch (error) {
    console.error("GET /api/tournaments error:", error);

    return NextResponse.json(
      { ok: false, error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {

    const body = await req.json();

    const tournament = await prisma.tournament.create({
      data: {
        title: body.title,
        game: body.game,
        description: body.description,
        format: body.format,
        maxPlayers: body.maxPlayers,
        startDate: new Date(body.startDate),
      },
    });

    return NextResponse.json({
      ok: true,
      tournament,
    });

  } catch (error) {

    console.error("POST /api/tournaments error:", error);

    return NextResponse.json(
      { ok: false, error: "Error creando torneo" },
      { status: 500 }
    );
  }
}