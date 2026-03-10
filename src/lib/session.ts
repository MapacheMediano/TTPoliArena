import { getIronSession, type IronSessionOptions } from "iron-session";
import { cookies } from "next/headers";

export type SessionData = {
  userId?: string;
role?: "PLAYER" | "CAPTAIN" | "STAFF" | "ADMIN";
};

export const sessionOptions: IronSessionOptions = {
  password: process.env.SESSION_PASSWORD as string,
  cookieName: "poliarena_session",
  cookieOptions: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  },
};

export async function getSession() {
  const cookieStore = await cookies(); // ✅ Next 16: cookies() es async
  return getIronSession<SessionData>(cookieStore, sessionOptions);
}
