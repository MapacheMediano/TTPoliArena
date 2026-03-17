import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";

export async function GET() {
  try {
    const session = await getSession();

    if (!session.userId) {
      return NextResponse.json(
        { ok: false, error: "No autorizado" },
        { status: 401 }
      );
    }

    return NextResponse.json({
      ok: true,
      message: "Usuario autenticado correctamente",
      userId: session.userId,
      role: session.role,
    });
  } catch (error) {
    console.error("Error en /api/me/tournaments:", error);

    return NextResponse.json(
      { ok: false, error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}