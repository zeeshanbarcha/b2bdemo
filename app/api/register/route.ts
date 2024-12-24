import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';
import bcrypt from 'bcrypt';

export async function POST(request: NextRequest) {
    try {
        const userData = await request.json();

        const findUser = await prisma.user.findUnique({
            where: {
                email: userData.email
            }
        })

        if (findUser) {
            return NextResponse.json({ message: "Email already taken", status: 401 })
        }
        const user = await prisma.user.create({
            data: {
                name: userData.name,
                email: userData.email,
                password: bcrypt.hashSync(userData.password, 12),
                role: 'USER'
            }
        })

        return NextResponse.json({ result: user, message: "Register successfull", status: 201 });
    } catch (error) {
        console.error('Error while registering user:', error);
        return new Response(JSON.stringify({ error: 'Error while registering user' }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            }
        });
    }
}