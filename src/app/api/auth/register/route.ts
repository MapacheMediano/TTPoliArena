import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { sendVerificationEmail } from "@/lib/email";

const RegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    const parsed = RegisterSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: "Datos inválidos", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const email = parsed.data.email.trim().toLowerCase();

    // Validación de correo institucional
    if (!email.endsWith("@alumno.ipn.mx")) {
      return NextResponse.json(
        { ok: false, error: "Solo se permiten correos institucionales @alumno.ipn.mx" },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (existingUser) {
      return NextResponse.json(
        { ok: false, error: "El correo ya está registrado" },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(parsed.data.password, 10);

    // Token de verificación
    const verifyToken = crypto.randomBytes(32).toString("hex");
    const verifyTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: "PLAYER",
        isActive: true,
        verifyToken,
        verifyTokenExpiry,
      },
      select: {
        id: true,
        email: true,
        role: true,
      },
    });

    // Envía email de verificación
    try {
      await sendVerificationEmail(email, verifyToken);
    } catch (emailError) {
      console.error("Error enviando email de verificación:", emailError);
      // No bloqueamos el registro si el email falla
    }

    const session = await getSession();
    session.userId = user.id;
    session.role = user.role;
    await session.save();

    return NextResponse.json(
      {
        ok: true,
        user,
        message: "Cuenta creada. Revisa tu correo para verificar tu cuenta.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/auth/register error:", error);
    return NextResponse.json(
      { ok: false, error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}