import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

const UpdateProfileSchema = z.object({
  fullName: z.string().min(2).optional(),
  school: z.string().min(2).optional(),
  gamerTag: z.string().min(2).optional(),
  avatarUrl: z.string().url().optional(),
});

export async function GET() {
  try {
    const session = await getSession();

    if (!session.userId) {
      return NextResponse.json(
        { ok: false, error: "No autenticado" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: {
        id: true,
        email: true,
        role: true,
        PlayerProfile: true,
      },
    });

    return NextResponse.json({
      ok: true,
      profile: user,
    });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getSession();

    if (!session || !session.userId) {
      return NextResponse.json(
        { ok: false, error: "No autenticado" },
        { status: 401 }
      );
    }

    const body = await req.json().catch(() => null);

    if (!body) {
      return NextResponse.json(
        { ok: false, error: "Body inválido" },
        { status: 400 }
      );
    }

    const parsed = UpdateProfileSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: "Datos inválidos", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const existingProfile = await prisma.playerProfile.findUnique({
      where: { userId: session.userId },
    });

    let profile;

    if (existingProfile) {
      profile = await prisma.playerProfile.update({
        where: { userId: session.userId },
        data: {
          fullName: parsed.data.fullName,
          school: parsed.data.school,
          gamerTag: parsed.data.gamerTag,
          avatarUrl: parsed.data.avatarUrl,
        },
      });
    } else {
      profile = await prisma.playerProfile.create({
        data: {
          id: session.userId,
          userId: session.userId,
          fullName: parsed.data.fullName,
          school: parsed.data.school,
          gamerTag: parsed.data.gamerTag,
          avatarUrl: parsed.data.avatarUrl,
        },
      });
    }

    return NextResponse.json({
      ok: true,
      profile,
    });
  } catch (error) {
    console.error("PATCH /api/player-profile/me error:", error);

    return NextResponse.json(
      { ok: false, error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}