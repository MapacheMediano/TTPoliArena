import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = LoginSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Datos inválidos", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const email = parsed.data.email.trim().toLowerCase();

  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, email: true, name: true, password: true, role: true, isActive: true },
  });

  if (!user || !user.isActive) {
    return NextResponse.json({ ok: false, error: "Credenciales inválidas" }, { status: 401 });
  }

  const ok = await bcrypt.compare(parsed.data.password, user.password);
  if (!ok) {
    return NextResponse.json({ ok: false, error: "Credenciales inválidas" }, { status: 401 });
  }

  const session = await getSession();
  session.userId = user.id;
  session.role = user.role;
  await session.save();

  return NextResponse.json({
    ok: true,
    user: { id: user.id, email: user.email, name: user.name, role: user.role },
  });
}
