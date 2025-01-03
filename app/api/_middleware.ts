import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
    const response = NextResponse.next();
    response.headers.set('Access-Control-Allow-Origin', 'https://your-app.vercel.app');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return response;
}
