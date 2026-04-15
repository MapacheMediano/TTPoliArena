import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Params) {
  try {
    const { id } = await params;

    const matches = await prisma.match.findMany({
      where: { tournamentId: id },
      include: {
        teamA: { select: { id: true, name: true, tag: true } },
        teamB: { select: { id: true, name: true, tag: true } },
        winner: { select: { id: true, name: true, tag: true } },
      },
      orderBy: [{ bracket: "asc" }, { round: "asc" }, { position: "asc" }],
    });

    const tournament = await prisma.tournament.findUnique({
      where: { id },
      select: { id: true, title: true, format: true, status: true },
    });

    if (!tournament) {
      return NextResponse.json({ ok: false, error: "Torneo no encontrado" }, { status: 404 });
    }

    return NextResponse.json({ ok: true, matches, tournament });
  } catch (error) {
    console.error("GET /api/tournaments/[id]/brackets error:", error);
    return NextResponse.json({ ok: false, error: "Error interno del servidor" }, { status: 500 });
  }
}