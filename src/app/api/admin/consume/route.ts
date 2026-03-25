import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function POST(request: Request) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { referralId } = await request.json();

  if (!referralId) return NextResponse.json({ error: "Falta ID del referido" }, { status: 400 });

  const updated = await prisma.referral.update({
    where: { id: referralId },
    data: { hasConsumedService: true }
  });

  return NextResponse.json({ success: true, referral: updated });
}
