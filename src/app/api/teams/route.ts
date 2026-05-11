import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { z } from "zod";

const CreateTeamSchema = z.object({
  name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  tag: z.string().min(2).max(5, "El tag debe tener entre 2 y 5 caracteres"),
  game: z.string().min(2, "El juego es obligatorio"),
});

export async function GET() {
  try {
    const session = await getSession();
    if (!session.userId) {
      return NextResponse.json({ ok: false, error: "No autenticado" }, { status: 401 });
    }

    const teams = await prisma.team.findMany({
      where: {
        OR: [
          { captainId: session.userId },
          { members: { some: { userId: session.userId } } },
        ],
      },
      include: {
        captain: {
          select: {
            id: true,
            email: true,
            PlayerProfile: { select: { fullName: true, gamerTag: true } },
          },
        },
        members: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                PlayerProfile: { select: { fullName: true, gamerTag: true } },
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ ok: true, teams });
  } catch (error) {
    console.error("GET /api/teams error:", error);
    return NextResponse.json({ ok: false, error: "Error interno del servidor" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session.userId) {
      return NextResponse.json({ ok: false, error: "No autenticado" }, { status: 401 });
    }

    const body = await req.json().catch(() => null);
    const parsed = CreateTeamSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: "Datos inválidos", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const existing = await prisma.team.findUnique({
      where: { tag: parsed.data.tag.toUpperCase() },
    });
    if (existing) {
      return NextResponse.json(
        { ok: false, error: "El tag ya está en uso" },
        { status: 409 }
      );
    }

    const team = await prisma.team.create({
      data: {
        name: parsed.data.name.trim(),
        tag: parsed.data.tag.toUpperCase().trim(),
        game: parsed.data.game.trim(),
        captainId: session.userId,
        members: {
          create: { userId: session.userId, status: "ACCEPTED" },
        },
      },
      include: {
        captain: {
          select: {
            id: true,
            email: true,
            PlayerProfile: { select: { fullName: true, gamerTag: true } },
          },
        },
        members: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                PlayerProfile: { select: { fullName: true, gamerTag: true } },
              },
            },
          },
        },
      },
    });

    return NextResponse.json({ ok: true, team }, { status: 201 });
  } catch (error) {
    console.error("POST /api/teams error:", error);
    return NextResponse.json({ ok: false, error: "Error interno del servidor" }, { status: 500 });
  }
}