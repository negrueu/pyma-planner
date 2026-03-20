import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

const users = [
  {
    id: "1",
    name: "Paul Pădurariu",
    email: "pymagroup@gmail.com",
    passwordHash: "$2b$12$lTmIeecRTyGZSxgAonCGCOc7fX11DZoS1PYnEdSsdPBaUm2x4Npc6",
  },
  {
    id: "2",
    name: "Elena Pădurariu",
    email: "elenapadurariu@gmail.com",
    passwordHash: "$2b$12$PWsJuUlK1BaTpOePOG8VmOXUomM.lKpddIYKfbukvBPKEpsctJ.SS",
  },
  {
    id: "3",
    name: "Marian Negru",
    email: "nm.negru@gmail.com",
    passwordHash: "$2b$12$kGVRlQwATi6qogDN3yWRGeJH63ahdFBO8PUgUPsCD38eT2a9g7xAW",
  },
];

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Parolă", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = users.find(
          (u) => u.email.toLowerCase() === credentials.email.toLowerCase()
        );
        if (!user) return null;

        const valid = await bcrypt.compare(
          credentials.password,
          user.passwordHash
        );
        if (!valid) return null;

        return { id: user.id, name: user.name, email: user.email };
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 zile
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { id?: string }).id = token.id as string;
      }
      return session;
    },
  },
};
