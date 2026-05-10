import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const [totalUsuarios, totalTorneos, totalEquipos] = await Promise.all([
      prisma.user.count({ where: { isActive: true } }),
      prisma.tournament.count(),
      prisma.team.count(),
    ]);

    return NextResponse.json({
      ok: true,
      stats: {
        jugadores: totalUsuarios,
        torneos: totalTorneos,
        equipos: totalEquipos,
        juegos: 8,
      },
    });
  } catch (error) {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}