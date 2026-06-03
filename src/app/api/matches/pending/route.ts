import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function GET() {
  try {
    const session = await getSession();
    if (!session.userId) {
      return NextResponse.json({ ok: false, error: "No autenticado" }, { status: 401 });
    }

    const currentUser = await prisma.user.findUnique({
      where: { id: session.userId },
      select: { role: true },
    });

    if (!["ADMIN", "STAFF"].includes(currentUser?.role ?? "")) {
      return NextResponse.json({ ok: false, error: "No autorizado" }, { status: 403 });
    }

    const matches = await prisma.match.findMany({
      where: { status: "REPORTED" },
      include: {
        tournament: { select: { id: true, title: true } },
        teamA: { select: { id: true, name: true, tag: true } },
        teamB: { select: { id: true, name: true, tag: true } },
        reporter: {
          select: {
            id: true,
            email: true,
            PlayerProfile: { select: { fullName: true, gamerTag: true } },
          captainOf: { select: { id: true, name: true } },
          },
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json({ ok: true, matches });
  } catch (error) {
    console.error("GET /api/matches/pending error:", error);
    return NextResponse.json(
      { ok: false, error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}