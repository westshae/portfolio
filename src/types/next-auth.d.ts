import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    profileId?: number;
    user: DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    profileId?: number;
  }
}

export {};
