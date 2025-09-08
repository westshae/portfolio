import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { db, schema } from "./db";
import { eq } from "drizzle-orm";

interface GoogleProfile {
  sub?: string;
  email?: string;
  name?: string;
  picture?: string;
}

interface JwtWithProfileId {
  profileId?: number;
  email?: string | null;
  name?: string | null;
  picture?: string | null;
}

interface SessionWithProfileId {
  user?: { name?: string | null; email?: string | null; image?: string | null };
  profileId?: number;
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ account, profile }) {
      if (account?.provider === "google" && profile) {
        const gp = profile as GoogleProfile;
        const email = gp.email ?? null;
        const adminEmail = process.env.ADMIN_EMAIL ?? "";
        if (!email) return false;
        return email.toLowerCase() === adminEmail.toLowerCase();
      }
      return false;
    },
    async jwt({ token, account, profile }) {
      if (account?.provider === "google" && profile) {
        const gp = profile as GoogleProfile;
        const email = gp.email ?? null;
        const name = gp.name ?? null;
        const image = gp.picture ?? null;
        const googleId = String(gp.sub ?? "");

        if (email) {
          const existing = await db
            .select()
            .from(schema.profiles)
            .where(eq(schema.profiles.email, email));

          let profileId: number;
          if (existing.length > 0) {
            profileId = existing[0].id;
            await db
              .update(schema.profiles)
              .set({ googleId, image, name, updatedAt: new Date() })
              .where(eq(schema.profiles.id, profileId));
          } else {
            const inserted = await db
              .insert(schema.profiles)
              .values({ email, name, image, googleId })
              .returning({ id: schema.profiles.id });
            profileId = inserted[0].id;
          }
          const t = token as unknown as JwtWithProfileId;
          t.profileId = profileId;
          t.email = email;
          t.name = name;
          t.picture = image;
          return t as unknown as typeof token;
        }
      }
      return token;
    },
    async session({ session, token }) {
      const t = token as unknown as JwtWithProfileId;
      const s = session as unknown as SessionWithProfileId;
      if (s.user && t.profileId) {
        s.profileId = t.profileId;
      }
      return s as unknown as typeof session;
    },
  },
  pages: {
    signIn: "/",
    error: "/",
  },
};
