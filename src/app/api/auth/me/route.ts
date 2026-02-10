import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function GET() {
  const session = await getSession();

  if (!session.userId) {
    return NextResponse.json({ ok: true, user: null });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { id: true, email: true, name: true, role: true, isActive: true },
  });

  if (!user || !user.isActive) {
    session.destroy();
    return NextResponse.json({ ok: true, user: null });
  }

  return NextResponse.json({
    ok: true,
    user: { id: user.id, email: user.email, name: user.name, role: user.role },
  });
}
