import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { z } from "zod";

type Params = { params: Promise<{ id: string }> };

const AddMemberSchema = z.object({
  email: z.string().email(),
});

export async function POST(req: Request, { params }: Params) {
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
      return NextResponse.json({ ok: false, error: "Solo el capitán puede agregar miembros" }, { status: 403 });
    }

    const body = await req.json().catch(() => null);
    const parsed = AddMemberSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ ok: false, error: "Correo inválido" }, { status: 400 });
    }

    const userToAdd = await prisma.user.findUnique({
      where: { email: parsed.data.email.toLowerCase() },
      select: { id: true, email: true, PlayerProfile: { select: { fullName: true, gamerTag: true } } },
    });

    if (!userToAdd) {
      return NextResponse.json({ ok: false, error: "Usuario no encontrado" }, { status: 404 });
    }

    const existing = await prisma.teamMember.findUnique({
      where: { teamId_userId: { teamId: id, userId: userToAdd.id } },
    });

    if (existing) {
      return NextResponse.json({ ok: false, error: "El usuario ya es miembro del equipo" }, { status: 409 });
    }

    const member = await prisma.teamMember.create({
      data: { teamId: id, userId: userToAdd.id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            PlayerProfile: { select: { fullName: true, gamerTag: true } },
          },
        },
      },
    });

    return NextResponse.json({ ok: true, member }, { status: 201 });
  } catch (error) {
    console.error("POST /api/teams/[id]/members error:", error);
    return NextResponse.json({ ok: false, error: "Error interno del servidor" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: Params) {
  try {
    const { id } = await params;
    const session = await getSession();

    if (!session.userId) {
      return NextResponse.json({ ok: false, error: "No autenticado" }, { status: 401 });
    }

    const body = await req.json().catch(() => null);
    const userId = body?.userId as string;

    if (!userId) {
      return NextResponse.json({ ok: false, error: "userId requerido" }, { status: 400 });
    }

    const team = await prisma.team.findUnique({ where: { id } });
    if (!team) {
      return NextResponse.json({ ok: false, error: "Equipo no encontrado" }, { status: 404 });
    }

    if (team.captainId !== session.userId) {
      return NextResponse.json({ ok: false, error: "Solo el capitán puede eliminar miembros" }, { status: 403 });
    }

    if (userId === team.captainId) {
      return NextResponse.json({ ok: false, error: "No puedes eliminarte como capitán" }, { status: 400 });
    }

    await prisma.teamMember.delete({
      where: { teamId_userId: { teamId: id, userId } },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("DELETE /api/teams/[id]/members error:", error);
    return NextResponse.json({ ok: false, error: "Error interno del servidor" }, { status: 500 });
  }
}