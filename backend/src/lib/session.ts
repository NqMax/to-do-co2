import { signJwt } from "@/lib/jwt";
import type { Response } from "express";

export async function createSession(
  res: Response,
  payload: Record<string, any>,
) {
  const jwt = await signJwt(payload);

  res.cookie("token", jwt, {
    httpOnly: true,
    secure: true,
    sameSite: process.env.NODE_ENV === "production" ? "lax" : "none",
  });
}
