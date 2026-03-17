import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

const CreateTournamentSchema = z.object({
  title: z.string().min(3, "El título debe tener al menos 3 caracteres"),
  game: z.string().min(2, "El juego es obligatorio"),
  description: z.string().optional(),
  format: z.string().min(2, "El formato es obligatorio"),
  maxPlayers: z.number().int().positive("maxPlayers debe ser mayor a 0"),
  startDate: z.string().datetime("startDate debe ser una fecha ISO válida"),
  endDate: z.string().datetime().optional(),
});

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
    const session = await getSession();

    if (!session || !session.userId) {
      return NextResponse.json(
        { ok: false, error: "No autenticado" },
        { status: 401 }
      );
    }

    const body = await req.json().catch(() => null);
    const parsed = CreateTournamentSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          ok: false,
          error: "Datos inválidos",
          details: parsed.error.flatten(),
        },
        { status: 400 }
      );
    }

    const tournament = await prisma.tournament.create({
      data: {
        title: parsed.data.title.trim(),
        game: parsed.data.game.trim(),
        description: parsed.data.description?.trim() || null,
        format: parsed.data.format.trim(),
        maxPlayers: parsed.data.maxPlayers,
        startDate: new Date(parsed.data.startDate),
        endDate: parsed.data.endDate ? new Date(parsed.data.endDate) : null,
      },
    });

    return NextResponse.json(
      { ok: true, tournament },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/tournaments error:", error);

    return NextResponse.json(
      { ok: false, error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}