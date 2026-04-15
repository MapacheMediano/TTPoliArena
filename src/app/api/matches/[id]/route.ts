import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Params) {
  try {
    const { id } = await params;
    const session = await getSession();

    if (!session.userId) {
      return NextResponse.json({ ok: false, error: "No autenticado" }, { status: 401 });
    }

    const match = await prisma.match.findUnique({
      where: { id },
      include: {
        tournament: { select: { id: true, title: true, game: true } },
        teamA: {
          select: {
            id: true, name: true, tag: true, captainId: true,
            members: { include: { user: { select: { id: true, email: true } } } },
          },
        },
        teamB: {
          select: {
            id: true, name: true, tag: true, captainId: true,
            members: { include: { user: { select: { id: true, email: true } } } },
          },
        },
        winner: { select: { id: true, name: true, tag: true } },
      },
    });

    if (!match) {
      return NextResponse.json({ ok: false, error: "Partida no encontrada" }, { status: 404 });
    }

    return NextResponse.json({ ok: true, match });
  } catch (error) {
    console.error("GET /api/matches/[id] error:", error);
    return NextResponse.json({ ok: false, error: "Error interno del servidor" }, { status: 500 });
  }
}