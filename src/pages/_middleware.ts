import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
    // Don't allow direct access to open-sesame
    if (req.nextUrl.pathname.indexOf('open-sesame') > -1) {
        return NextResponse.redirect('/');
    }

    const basicAuth = req.headers.get('authorization');

    if (basicAuth) {
        const auth = basicAuth.split(' ')[1];
        const [user, pwd] = Buffer.from(auth, 'base64').toString().split(':');

        if (user === 'test' && pwd === 'test') {
            return NextResponse.next();
        }
        if (user === 'admin' && pwd === 'admin') {
            return NextResponse.rewrite('/open-sesame');
        }
    }

    return new Response('Auth required', {
        status: 401,
        headers: {
            'WWW-Authenticate': 'Basic realm="Secure Area"',
        },
    });
}
