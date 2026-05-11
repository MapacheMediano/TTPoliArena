import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { z } from "zod";

type Params = { params: Promise<{ id: string }> };

const InviteSchema = z.object({
  action: z.enum(["ACCEPT", "REJECT"]),
});

export async function POST(req: Request, { params }: Params) {
  try {
    const { id } = await params;
    const session = await getSession();

    if (!session.userId) {
      return NextResponse.json({ ok: false, error: "No autenticado" }, { status: 401 });
    }

    const body = await req.json().catch(() => null);
    const parsed = InviteSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ ok: false, error: "Acción inválida" }, { status: 400 });
    }

    const invitation = await prisma.teamMember.findUnique({
      where: { teamId_userId: { teamId: id, userId: session.userId } },
      include: { team: { select: { name: true } } },
    });

    if (!invitation) {
      return NextResponse.json({ ok: false, error: "Invitación no encontrada" }, { status: 404 });
    }

    if (invitation.status !== "PENDING") {
      return NextResponse.json({ ok: false, error: "Esta invitación ya fue procesada" }, { status: 400 });
    }

    if (parsed.data.action === "ACCEPT") {
      await prisma.teamMember.update({
        where: { teamId_userId: { teamId: id, userId: session.userId } },
        data: { status: "ACCEPTED" },
      });
      return NextResponse.json({ ok: true, message: `Te uniste al equipo ${invitation.team.name}` });
    } else {
      await prisma.teamMember.delete({
        where: { teamId_userId: { teamId: id, userId: session.userId } },
      });
      return NextResponse.json({ ok: true, message: "Invitación rechazada" });
    }
  } catch (error) {
    console.error("POST /api/teams/[id]/invite error:", error);
    return NextResponse.json({ ok: false, error: "Error interno del servidor" }, { status: 500 });
  }
}