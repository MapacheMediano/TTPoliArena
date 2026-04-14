import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Params) {
  try {
    const { id } = await params;

    const team = await prisma.team.findUnique({
      where: { id },
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

    if (!team) {
      return NextResponse.json({ ok: false, error: "Equipo no encontrado" }, { status: 404 });
    }

    return NextResponse.json({ ok: true, team });
  } catch (error) {
    console.error("GET /api/teams/[id] error:", error);
    return NextResponse.json({ ok: false, error: "Error interno del servidor" }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: Params) {
  try {
    const { id } = await params;
    const session = await getSession();

    if (!session.userId) {
      return NextResponse.json({ ok: false, error: "No autenticado" }, { status: 401 });
    }

    const team = await prisma.team.findUnique({ where: { id } });
    if (!team) {
      return NextResponse.json({ ok: false, error: "Equipo no encontrado" }, { status: 404 });
    }

    if (team.captainId !== session.userId) {
      return NextResponse.json({ ok: false, error: "Solo el capitán puede eliminar el equipo" }, { status: 403 });
    }

    await prisma.team.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("DELETE /api/teams/[id] error:", error);
    return NextResponse.json({ ok: false, error: "Error interno del servidor" }, { status: 500 });
  }
}