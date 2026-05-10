import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const tournaments = await prisma.tournament.findMany({
      where: { status: { in: ["OPEN", "IN_PROGRESS"] } },
      orderBy: { createdAt: "desc" },
      take: 6,
      include: {
        _count: { select: { registrations: true } },
      },
    });

    return NextResponse.json({ ok: true, tournaments });
  } catch (error) {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}