import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function POST(request: Request) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { userId } = await request.json();

  if (!userId) return NextResponse.json({ error: "Falta ID del usuario" }, { status: 400 });

  const updated = await prisma.user.update({
    where: { id: userId },
    data: { 
      rewardClaimed: true,
      referralCode: null // Esto desactiva el QR
    }
  });

  return NextResponse.json({ success: true, user: updated });
}
