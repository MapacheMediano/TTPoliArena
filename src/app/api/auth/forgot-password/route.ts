import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendPasswordResetEmail } from "@/lib/email";
import crypto from "crypto";
import { z } from "zod";

const Schema = z.object({
  email: z.string().email(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    const parsed = Schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ ok: false, error: "Correo inválido" }, { status: 400 });
    }

    const email = parsed.data.email.toLowerCase().trim();

    const user = await prisma.user.findUnique({ where: { email } });

    // Por seguridad siempre respondemos OK aunque el usuario no exista
    if (user) {
      const token = crypto.randomBytes(32).toString("hex");
      const expiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hora
      console.log('Usuario encontrado, enviando email a:', email);
      console.log('RESEND_API_KEY existe:', !!process.env.RESEND_API_KEY);

      await prisma.user.update({
        where: { id: user.id },
        data: {
          resetToken: token,
          resetTokenExpiry: expiry,
        },
      });

      await sendPasswordResetEmail(email, token);
      console.log('Email enviado correctamente');
    }

    return NextResponse.json({
      ok: true,
      message: "Si el correo existe, recibirás instrucciones para restablecer tu contraseña",
    });
  } catch (error) {
    console.error("POST /api/auth/forgot-password error:", error);
    return NextResponse.json(
      { ok: false, error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}