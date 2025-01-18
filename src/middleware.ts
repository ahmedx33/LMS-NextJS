import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify, SignJWT } from 'jose';

const JWT_ACCESS_SECRET = new TextEncoder().encode(process.env.JWT_ACCESS_SECRET);
const JWT_REFRESH_SECRET = new TextEncoder().encode(process.env.JWT_REFRESH_SECRET);

export async function middleware(req: NextRequest) {
    const accessToken = req.cookies.get('accessToken')?.value;
    const refreshToken = req.cookies.get('refreshToken')?.value;

    if (req.nextUrl.pathname.startsWith('/api/login') || req.nextUrl.pathname.startsWith('/api/refresh-token')) {
        return NextResponse.next();
    }

    if (!accessToken) {
        return NextResponse.redirect(new URL('/sign-in', req.url));
    }

    try {
        await jwtVerify(accessToken, JWT_ACCESS_SECRET);
        return NextResponse.next();
    } catch {
        if (refreshToken) {
            try {
                const { payload } = await jwtVerify(refreshToken, JWT_REFRESH_SECRET);

                const newAccessToken = await new SignJWT({ userId: payload.userId })
                    .setProtectedHeader({ alg: 'HS256' })
                    .setExpirationTime(process.env.JWT_ACCESS_EXPIRATION_TIME || '1h')
                    .sign(JWT_ACCESS_SECRET);

                const response = NextResponse.next();
                response.cookies.set('accessToken', newAccessToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    maxAge: 60 * 60, // 1 hour
                    path: '/',
                });

                return response;
            } catch {
                return NextResponse.redirect(new URL('/sign-in', req.url));
            }
        } else {
            return NextResponse.redirect(new URL('/sign-in', req.url));
        }
    }
}

export const config = {
    matcher: ['/'],
};
