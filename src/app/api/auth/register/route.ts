import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { isIpnStudentEmail } from "@/lib/validation";

const RegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Mínimo 8 caracteres"),
  name: z.string().min(2).max(80).optional(),
});

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = RegisterSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Datos inválidos", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const email = parsed.data.email.trim().toLowerCase();

  if (!isIpnStudentEmail(email)) {
    return NextResponse.json(
      { ok: false, error: "Solo se permite correo @alumno.ipn.mx" },
      { status: 400 }
    );
  }

  const exists = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });

  if (exists) {
    return NextResponse.json(
      { ok: false, error: "Este correo ya está registrado" },
      { status: 409 }
    );
  }

  const hash = await bcrypt.hash(parsed.data.password, 12);

  const user = await prisma.user.create({
    data: {
      email,
      password: hash,
      name: parsed.data.name?.trim(),
    },
    select: { id: true, email: true, name: true, role: true, createdAt: true },
  });

  return NextResponse.json({ ok: true, user }, { status: 201 });
}