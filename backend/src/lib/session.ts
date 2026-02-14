import { signJwt } from "@/lib/jwt";
import type { Response, CookieOptions } from "express";

const cookieOptions: CookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "none",
};

export async function deleteSession(res: Response) {
  res.clearCookie("token", cookieOptions).send();
}

export async function createSession(
  res: Response,
  payload: Record<string, any>,
) {
  const jwt = await signJwt(payload);

  res.cookie("token", jwt, cookieOptions);
}
