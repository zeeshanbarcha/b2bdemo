import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";
import { cookies } from "next/headers";
import { generateToken } from "@/auth";
import { setCors } from "../../../lib/cors";


export async function OPTIONS() {
  const response = NextResponse.json({}, { status: 200 });
  setCors(response);
  return response;
}

export async function POST(request: NextRequest) {
  try {
    const userData = await request.json();
    const existingUser = await prisma.user.findUnique({
      where: { email: userData.email }
    });

    if (existingUser) {
      return NextResponse.json({ message: "Email already taken", status: 401 });
    }

    const user = await prisma.user.create({
      data: {
        name: userData.name,
        email: userData.email,
        password: bcrypt.hashSync(userData.password, 12),
        role: "USER"
      }
    });

    const { password, ...userWithoutPassword } = user;

    // Generate JWT token
    const token = await generateToken(userWithoutPassword);

    // Set cookie
    cookies().set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 // 24 hours
    });

    return NextResponse.json({
      result: userWithoutPassword,
      message: "Register successful",
      status: 201
    });
  } catch (error) {
    console.error("Error while registering user:", error);
    const response = NextResponse.json(
      { error: "Error while registering user" },
      { status: 500 }
    );

    setCors(response);
    return response;
  }
}
