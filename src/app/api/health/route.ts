import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const dbOk = await prisma.user
    .count()
    .then(() => true)
    .catch(() => false);

  return NextResponse.json({
    ok: true,
    dbOk,
    timestamp: new Date().toISOString(),
  });
}
