import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

type Params = {
  params: Promise<{
    id: string;
  }>;
};

const UpdateTournamentSchema = z
  .object({
    title: z.string().min(3, "El título debe tener al menos 3 caracteres").optional(),
    game: z.string().min(2, "El juego es obligatorio").optional(),
    description: z.string().optional().nullable(),
    format: z.string().min(2, "El formato es obligatorio").optional(),
    maxPlayers: z.coerce
      .number()
      .int("maxPlayers debe ser entero")
      .positive("maxPlayers debe ser mayor a 0")
      .optional(),
    startDate: z.string().datetime("startDate debe ser una fecha ISO válida").optional(),
    endDate: z.string().datetime("endDate debe ser una fecha ISO válida").optional().nullable(),
    status: z.string().optional(),
  })
  .refine(
    (data) => {
      if (!data.startDate || !data.endDate) return true;
      return new Date(data.endDate) >= new Date(data.startDate);
    },
    {
      message: "endDate no puede ser menor que startDate",
      path: ["endDate"],
    }
  );

export async function GET(_req: Request, { params }: Params) {
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

export async function PATCH(req: Request, { params }: Params) {
  try {
    const session = await getSession();

    if (!session || !session.userId) {
      return NextResponse.json(
        { ok: false, error: "No autenticado" },
        { status: 401 }
      );
    }

    const { id } = await params;

    const existingTournament = await prisma.tournament.findUnique({
      where: { id },
    });

    if (!existingTournament) {
      return NextResponse.json(
        { ok: false, error: "Torneo no encontrado" },
        { status: 404 }
      );
    }

    const body = await req.json().catch(() => null);

    if (!body) {
      return NextResponse.json(
        { ok: false, error: "Body inválido o vacío" },
        { status: 400 }
      );
    }

    const parsed = UpdateTournamentSchema.safeParse(body);

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

    const dataToUpdate: {
      title?: string;
      game?: string;
      description?: string | null;
      format?: string;
      maxPlayers?: number;
      startDate?: Date;
      endDate?: Date | null;
      status?: string;
    } = {};

    if (parsed.data.title !== undefined) {
      dataToUpdate.title = parsed.data.title.trim();
    }

    if (parsed.data.game !== undefined) {
      dataToUpdate.game = parsed.data.game.trim();
    }

    if (parsed.data.description !== undefined) {
      dataToUpdate.description = parsed.data.description?.trim() || null;
    }

    if (parsed.data.format !== undefined) {
      dataToUpdate.format = parsed.data.format.trim();
    }

    if (parsed.data.maxPlayers !== undefined) {
      dataToUpdate.maxPlayers = parsed.data.maxPlayers;
    }

    if (parsed.data.startDate !== undefined) {
      dataToUpdate.startDate = new Date(parsed.data.startDate);
    }

    if (parsed.data.endDate !== undefined) {
      dataToUpdate.endDate = parsed.data.endDate
        ? new Date(parsed.data.endDate)
        : null;
    }

    if (parsed.data.status !== undefined) {
      dataToUpdate.status = parsed.data.status.trim();
    }

    const updatedTournament = await prisma.tournament.update({
      where: { id },
      data: dataToUpdate,
    });

    return NextResponse.json({
      ok: true,
      tournament: updatedTournament,
    });
  } catch (error) {
    console.error("PATCH /api/tournaments/[id] error:", error);

    return NextResponse.json(
      { ok: false, error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

export async function DELETE(_req: Request, { params }: Params) {
  try {
    const session = await getSession();

    if (!session || !session.userId) {
      return NextResponse.json(
        { ok: false, error: "No autenticado" },
        { status: 401 }
      );
    }

    const { id } = await params;

    const existingTournament = await prisma.tournament.findUnique({
      where: { id },
    });

    if (!existingTournament) {
      return NextResponse.json(
        { ok: false, error: "Torneo no encontrado" },
        { status: 404 }
      );
    }

    await prisma.tournament.delete({
      where: { id },
    });

    return NextResponse.json({
      ok: true,
      message: "Torneo eliminado correctamente",
    });
  } catch (error) {
    console.error("DELETE /api/tournaments/[id] error:", error);

    return NextResponse.json(
      { ok: false, error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}