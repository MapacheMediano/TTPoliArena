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

    if (currentUser?.role !== "ADMIN") {
      return NextResponse.json({ ok: false, error: "No autorizado" }, { status: 403 });
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        PlayerProfile: {
          select: {
            fullName: true,
            gamerTag: true,
            school: true,
          },
        },
        _count: {
          select: { tournamentRegistrations: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    // Agrega conteo de equipos al response
    const totalEquipos = await prisma.team.count();
    const pendingMatches = await prisma.match.count({ where: { status: "REPORTED" } });

    return NextResponse.json({ ok: true, users, totalEquipos, pendingMatches });
    return NextResponse.json({ ok: true, users });
  } catch (error) {
    console.error("GET /api/admin/users error:", error);
    return NextResponse.json({ ok: false, error: "Error interno del servidor" }, { status: 500 });
  }
}