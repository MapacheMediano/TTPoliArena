import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function GET() {
  try {
    const session = await getSession();

    if (!session || !session.userId) {
      return NextResponse.json(
        { ok: false, error: "No autenticado" },
        { status: 401 }
      );
    }

    const myRegistrations = await prisma.tournamentRegistration.findMany({
      where: {
        userId: session.userId,
      },
      include: {
        tournament: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const tournaments = myRegistrations.map((registration) => registration.tournament);

    return NextResponse.json({
      ok: true,
      tournaments,
    });
  } catch (error) {
    console.error("Error en GET /api/my-tournaments:", error);

    return NextResponse.json(
      { ok: false, error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}