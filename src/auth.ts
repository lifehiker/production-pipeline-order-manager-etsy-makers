import NextAuth from "next-auth";
import type { Provider } from "next-auth/providers";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { z } from "zod";

import { ensureDemoUserScaffold } from "@/lib/bootstrap";
import { getDb } from "@/lib/prisma";

const demoSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2).max(50),
});

const providers: Provider[] = [
  Credentials({
    id: "demo-login",
    name: "Demo workspace",
    credentials: {
      email: { label: "Email", type: "email" },
      name: { label: "Name", type: "text" },
    },
    async authorize(credentials) {
      const parsed = demoSchema.safeParse(credentials);
      if (!parsed.success) {
        return null;
      }

      const db = getDb();
      const user = await db.user.upsert({
        where: { email: parsed.data.email },
        update: { name: parsed.data.name },
        create: {
          email: parsed.data.email,
          name: parsed.data.name,
          subscriptionStatus: "TRIALING",
          trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        },
      });

      await ensureDemoUserScaffold(user.id);

      return {
        id: user.id,
        email: user.email,
        name: user.name,
        image: user.image,
      };
    },
  }),
];

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.unshift(
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  );
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(getDb()),
  providers,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user?.id) {
        token.sub = user.id;
      }

      if (token.email) {
        const db = getDb();
        const dbUser = await db.user.findUnique({
          where: { email: token.email },
        });

        if (dbUser) {
          token.sub = dbUser.id;
          token.picture = dbUser.image;
          token.name = dbUser.name;
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }

      return session;
    },
    async signIn({ user, account }) {
      if (account?.provider === "google" && user.email) {
        const db = getDb();
        const dbUser = await db.user.findUnique({ where: { email: user.email } });

        if (dbUser) {
          await ensureDemoUserScaffold(dbUser.id);
        }
      }

      return true;
    },
  },
});
