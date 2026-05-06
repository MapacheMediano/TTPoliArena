import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function GET() {
  try {
    const session = await getSession();
    if (!session.userId) {
      return NextResponse.json({ ok: false, error: "No autenticado" }, { status: 401 });
    }

    const currentUser = await prisma.user.findUnique({
      where: { id: session.userId },
      select: { role: true },
    });

    const notifications: {
      id: string;
      type: string;
      message: string;
      link: string;
      createdAt: string;
    }[] = [];

    // 1 — Resultados aprobados/rechazados recientemente (últimos 7 días)
    const recentMatches = await prisma.match.findMany({
      where: {
        reportedBy: session.userId,
        updatedAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
        validatedBy: { not: null },
      },
      include: {
        tournament: { select: { id: true, title: true } },
      },
      take: 10,
      orderBy: { updatedAt: "desc" },
    });

    recentMatches.forEach(m => {
      const approved = m.status === "FINISHED";
      notifications.push({
        id: `result-${m.id}`,
        type: approved ? "RESULT_APPROVED" : "RESULT_REJECTED",
        message: approved
          ? `✅ Tu resultado en "${m.tournament.title}" fue aprobado`
          : `❌ Tu resultado en "${m.tournament.title}" fue rechazado — repórtalo de nuevo`,
        link: approved
          ? `/tournaments/${m.tournamentId}/brackets`
          : `/matches/${m.id}/report`,
        createdAt: m.updatedAt.toISOString(),
      });
    });

    // 2 — Nuevos torneos abiertos en los que no está inscrito
    const openTournaments = await prisma.tournament.findMany({
      where: {
        status: "OPEN",
        registrations: {
          none: { userId: session.userId },
        },
        createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      },
      take: 3,
      orderBy: { createdAt: "desc" },
    });

    openTournaments.forEach(t => {
      notifications.push({
        id: `tournament-${t.id}`,
        type: "NEW_TOURNAMENT",
        message: `🏆 Nuevo torneo disponible: "${t.title}"`,
        link: `/tournaments/${t.id}`,
        createdAt: t.createdAt.toISOString(),
      });
    });

    // 3 — Para ADMIN/STAFF: resultados pendientes de validar
    if (["ADMIN", "STAFF"].includes(currentUser?.role ?? "")) {
      const pendingCount = await prisma.match.count({
        where: { status: "REPORTED" },
      });

      if (pendingCount > 0) {
        notifications.push({
          id: "pending-validations",
          type: "PENDING_VALIDATIONS",
          message: `⚠️ Hay ${pendingCount} resultado${pendingCount > 1 ? 's' : ''} pendiente${pendingCount > 1 ? 's' : ''} de validar`,
          link: "/matches/validate",
          createdAt: new Date().toISOString(),
        });
      }
    }

    // Ordena por más reciente
    notifications.sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return NextResponse.json({ ok: true, notifications });
  } catch (error) {
    console.error("GET /api/notifications error:", error);
    return NextResponse.json(
      { ok: false, error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}