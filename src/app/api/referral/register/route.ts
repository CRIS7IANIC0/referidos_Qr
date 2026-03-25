import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { name, email, referralCode } = await request.json();

    if (!name || !email || !referralCode) {
      return NextResponse.json({ error: "Faltan datos obligatorios" }, { status: 400 });
    }

    // Encuentra al titular (referrer) usando el código
    const referrer = await prisma.user.findUnique({
      where: { referralCode },
      include: { referrals: true }
    });

    if (!referrer) {
      return NextResponse.json({ error: "Código de referido inválido" }, { status: 404 });
    }

    if (referrer.role !== "CUSTOMER") {
      return NextResponse.json({ error: "Código de referido no válido" }, { status: 400 });
    }

    if (referrer.referrals.length >= 4) {
      return NextResponse.json({ error: "Este código ya alcanzó el límite máximo de referidos permitidos" }, { status: 400 });
    }

    // Verificar si el correo ya está registrado como referido
    const existingReferral = await prisma.referral.findUnique({
      where: { referredEmail: email }
    });

    if (existingReferral) {
      return NextResponse.json({ error: "Este correo ya ha sido registrado como referido anteriormente" }, { status: 400 });
    }

    // Crear el referido
    const referral = await prisma.referral.create({
      data: {
        referredName: name,
        referredEmail: email,
        referrerId: referrer.id
      }
    });

    return NextResponse.json({ success: true, referral });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error al registrar el referido" }, { status: 500 });
  }
}
