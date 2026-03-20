import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login",
  },
});

export const config = {
  matcher: [
    /*
     * Protejează toate rutele EXCEPTÂND:
     * - /login
     * - /api/auth (NextAuth endpoints)
     * - /api/health (health check pentru Coolify)
     * - /_next (static files)
     * - /favicon.ico
     */
    "/((?!login|api/auth|api/health|_next|favicon.ico).*)",
  ],
};
