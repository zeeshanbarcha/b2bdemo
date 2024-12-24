import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';
import bcrypt from 'bcrypt';

export async function POST(request: NextRequest) {
    try {
        const userData = await request.json();

        const user: any = await prisma.user.findUnique({
            where: {
                email: userData.email,
            }
        })

        if (!bcrypt.compareSync(userData.password, user.password)) {
            return NextResponse.json({ message: "Password is incorrect", status: 404 });
        }
        return NextResponse.json({ result: user, message: "Login successfull", status: 201 });
    } catch (error) {
        console.error('Error while login user:', error);
        return new Response(JSON.stringify({ error: 'Error while login user' }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            }
        });
    }
}