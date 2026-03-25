import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import prisma from "@/lib/prisma";
import { encrypt } from "@/lib/auth";
import { cookies } from "next/headers";

function generateReferralCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export async function POST(request: Request) {
  try {
    const { name, email, password, phone } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Faltan campos obligatorios" }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: "El correo ya está registrado" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    // All new registrations are CUSTOMERs
    const role = "CUSTOMER";
    
    // Only generate referral code for CUSTOMERs
    let referralCode = null;
    if (role === "CUSTOMER") {
      let isUnique = false;
      while (!isUnique) {
        referralCode = generateReferralCode();
        const existing = await prisma.user.findUnique({ where: { referralCode } });
        if (!existing) isUnique = true;
      }
    }

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phone,
        role,
        referralCode
      }
    });

    const sessionData = { id: user.id, email: user.email, role: user.role };
    const session = await encrypt(sessionData);

    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 1 day
    (await cookies()).set("session", session, { expires, httpOnly: true });

    return NextResponse.json({ success: true, user: { id: user.id, name: user.name, role: user.role } }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error al registrar usuario" }, { status: 500 });
  }
}
