import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";
import { cookies } from "next/headers";
import { generateToken } from "@/auth";

export async function POST(request: NextRequest) {
  try {
    const userData = await request.json();
    const user = await prisma.user.findUnique({
      where: { email: userData.email }
    });

    if (!user || !bcrypt.compareSync(userData.password, user.password)) {
      return NextResponse.json({
        message: "Invalid credentials",
        status: 401
      });
    }

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
      user: userWithoutPassword,
      message: "Login successful",
      status: 201
    });
  } catch (error) {
    console.error("Error while login user:", error);
    return NextResponse.json(
      { error: "Error while logging in user" },
      { status: 500 }
    );
  }
}
