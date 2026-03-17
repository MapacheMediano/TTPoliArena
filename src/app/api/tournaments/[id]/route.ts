import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Params = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(
  _req: Request,
  { params }: Params
) {
  try {
    const { id } = await params;

    const tournament = await prisma.tournament.findUnique({
      where: { id },
    });

    if (!tournament) {
      return NextResponse.json(
        { ok: false, error: "Torneo no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ok: true,
      tournament,
    });
  } catch (error) {
    console.error("GET /api/tournaments/[id] error:", error);

    return NextResponse.json(
      { ok: false, error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}