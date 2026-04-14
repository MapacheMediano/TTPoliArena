import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { z } from "zod";

type Params = { params: Promise<{ id: string }> };

const UpdateUserSchema = z.object({
  role: z.enum(["PLAYER", "CAPTAIN", "STAFF", "ADMIN"]).optional(),
  isActive: z.boolean().optional(),
});

export async function PATCH(req: Request, { params }: Params) {
  try {
    const { id } = await params;
    const session = await getSession();

    if (!session.userId) {
      return NextResponse.json({ ok: false, error: "No autenticado" }, { status: 401 });
    }

    const currentUser = await prisma.user.findUnique({
      where: { id: session.userId },
      select: { role: true },
    });

    if (currentUser?.role !== "ADMIN") {
      return NextResponse.json({ ok: false, error: "No autorizado" }, { status: 403 });
    }

    const body = await req.json().catch(() => null);
    const parsed = UpdateUserSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ ok: false, error: "Datos inválidos" }, { status: 400 });
    }

    const user = await prisma.user.update({
      where: { id },
      data: {
        ...(parsed.data.role && { role: parsed.data.role }),
        ...(parsed.data.isActive !== undefined && { isActive: parsed.data.isActive }),
      },
      select: {
        id: true,
        email: true,
        role: true,
        isActive: true,
      },
    });

    return NextResponse.json({ ok: true, user });
  } catch (error) {
    console.error("PATCH /api/admin/users/[id] error:", error);
    return NextResponse.json({ ok: false, error: "Error interno del servidor" }, { status: 500 });
  }
}