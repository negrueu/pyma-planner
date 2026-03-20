import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

// Placeholder users — replace emails and passwords before go-live
const users = [
  {
    id: "1",
    name: "Paul Pădurariu",
    email: "paul@placeholder.com",
    passwordHash: bcrypt.hashSync("changeme1", 10),
  },
  {
    id: "2",
    name: "Elena Pădurariu",
    email: "elena@placeholder.com",
    passwordHash: bcrypt.hashSync("changeme2", 10),
  },
  {
    id: "3",
    name: "Mădălina Dianu",
    email: "madalina@placeholder.com",
    passwordHash: bcrypt.hashSync("changeme3", 10),
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
