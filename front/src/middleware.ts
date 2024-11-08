import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export default withAuth(
  async function middleware(req) {
    const token = await getToken({ req });
    
    const publicRoutes = [
      '/login',
      '/register',
      '/',
      '/about',
      '/mail-verification',
      '/mot-de-passe-oublier',
      '/nouveau-mot-de-passe',
    ];

    const authRoutes = [
      '/login',
      '/register',
      '/mail-verification',
      '/mot-de-passe-oublier',
      '/nouveau-mot-de-passe',
    ];

    const adminRoutes = [
      '/admin-dashboard',
      '/admin-users',
      '/admin-configs/countries',
      '/admin-configs/suppliers',
      '/admin-transactions',
    ]; 

    // Rediriger les utilisateurs connecté vers leur tableau de bord
    if (authRoutes.includes(req.nextUrl.pathname)) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    // Permettre l'accès aux routes publiques
    if (publicRoutes.includes(req.nextUrl.pathname)) {
      return NextResponse.next();
    }

    // Rediriger vers la page de connexion si le token n'est pas présent
    if (!token) {
      return NextResponse.redirect(new URL('/login', req.url));
    }

    // Rediriger les utilisateurs non-admins essayant d'accéder aux routes admin
    if (!req.nextUrl.pathname.includes('/verify') && token.is_verified == 0) {
      return NextResponse.redirect(new URL('/verify', req.url));
    }

    // Rediriger les utilisateurs deja vérifiés vers leur tableau de bord
    if (req.nextUrl.pathname.includes('/verify') && token.is_verified == 1) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    // Rediriger les utilisateurs non-admins essayant d'accéder aux routes admin
    if (adminRoutes.includes(req.nextUrl.pathname) && token.role !== 'admin') {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    // Autoriser l'accès aux autres routes
    return NextResponse.next();
  },
  {
    pages: {
      signIn: '/login',
    },
  }
);

export const config = {
  matcher: [
    '/((?!about|login|register|home|mail-verification|mot-de-passe-oublier|nouveau-mot-de-passe|$).*)',
    // '/((?!about|home|$).*)',
  ],
};
