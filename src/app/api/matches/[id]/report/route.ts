import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { z } from "zod";

type Params = { params: Promise<{ id: string }> };

const ReportSchema = z.object({
  scoreA: z.number().int().min(0),
  scoreB: z.number().int().min(0),
  evidenceUrl: z.string().url().optional(),
  comentario: z.string().optional(),
});

export async function POST(req: Request, { params }: Params) {
  try {
    const { id } = await params;
    const session = await getSession();

    if (!session.userId) {
      return NextResponse.json({ ok: false, error: "No autenticado" }, { status: 401 });
    }

    const match = await prisma.match.findUnique({
      where: { id },
      include: {
        teamA: { include: { captain: true } },
        teamB: { include: { captain: true } },
      },
    });

    if (!match) {
      return NextResponse.json({ ok: false, error: "Partida no encontrada" }, { status: 404 });
    }

    if (match.status !== "PENDING") {
      return NextResponse.json(
        { ok: false, error: "Esta partida ya tiene un resultado reportado" },
        { status: 400 }
      );
    }

    // Verifica que el usuario es capitán de uno de los equipos
    const isCaptainA = match.teamA?.captainId === session.userId;
    const isCaptainB = match.teamB?.captainId === session.userId;

    if (!isCaptainA && !isCaptainB) {
      return NextResponse.json(
        { ok: false, error: "Solo el capitán de un equipo participante puede reportar el resultado" },
        { status: 403 }
      );
    }

    const body = await req.json().catch(() => null);
    const parsed = ReportSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: "Datos inválidos", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { scoreA, scoreB, evidenceUrl, comentario } = parsed.data;

    if (scoreA === scoreB) {
      return NextResponse.json(
        { ok: false, error: "No puede haber empate, debe haber un ganador" },
        { status: 400 }
      );
    }

    const winnerId = scoreA > scoreB ? match.teamAId : match.teamBId;

    const updated = await prisma.match.update({
        where: { id },
        data: {
            scoreA,
            scoreB,
            winner: winnerId ? { connect: { id: winnerId } } : undefined,
            evidenceUrl: evidenceUrl ?? null,
            reporter: { connect: { id: session.userId } },
            status: "REPORTED",
            playedAt: new Date(),
        },
        });

    return NextResponse.json({ ok: true, match: updated });
  } catch (error) {
    console.error("POST /api/matches/[id]/report error:", error);
    return NextResponse.json({ ok: false, error: "Error interno del servidor" }, { status: 500 });
  }
}