import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { z } from "zod";

const UpdateProfileSchema = z.object({
  fullName: z.string().trim().min(1).max(100).optional(),
  school: z.string().trim().min(1).max(100).optional(),
  gamerTag: z.string().trim().min(1).max(50).optional(),
  avatarUrl: z.string().trim().url().max(500).optional(),
});

export async function GET() {
  try {
    const session = await getSession();

    if (!session.userId) {
      return NextResponse.json(
        { ok: false, error: "No autorizado" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        id: session.userId,
      },
      select: {
        id: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        PlayerProfile: {
          select: {
            id: true,
            userId: true,
            fullName: true,
            school: true,
            gamerTag: true,
            avatarUrl: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { ok: false, error: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ok: true,
      user,
    });
  } catch (error) {
    console.error("Error en /api/me/profile:", error);

    return NextResponse.json(
      { ok: false, error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getSession();

    if (!session.userId) {
      return NextResponse.json(
        { ok: false, error: "No autorizado" },
        { status: 401 }
      );
    }

    const body = await req.json().catch(() => null);
    const parsed = UpdateProfileSchema.safeParse(body);

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

    const data = parsed.data;

    const profile = await prisma.playerProfile.upsert({
      where: {
        userId: session.userId,
      },
      update: {
        ...(data.fullName !== undefined && { fullName: data.fullName }),
        ...(data.school !== undefined && { school: data.school }),
        ...(data.gamerTag !== undefined && { gamerTag: data.gamerTag }),
        ...(data.avatarUrl !== undefined && { avatarUrl: data.avatarUrl }),
        updatedAt: new Date(),
      },
      create: {
        id: session.userId,
        userId: session.userId,
        fullName: data.fullName,
        school: data.school,
        gamerTag: data.gamerTag,
        avatarUrl: data.avatarUrl,
        updatedAt: new Date(),
      },
      select: {
        id: true,
        userId: true,
        fullName: true,
        school: true,
        gamerTag: true,
        avatarUrl: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      ok: true,
      message: "Perfil actualizado correctamente",
      profile,
    });
  } catch (error) {
    console.error("Error en PUT /api/me/profile:", error);

    return NextResponse.json(
      { ok: false, error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}