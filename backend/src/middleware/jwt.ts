import type { NextFunction, Request, Response } from "express";
import { verifyJwt } from "@/lib/jwt";
import type { JwtPayload } from "@/types/auth";
import { constructError, errorCodes } from "@/lib/errors";

export async function jwt(req: Request, res: Response, next: NextFunction) {
  const token = await req.cookies.token;

  if (!token) {
    return res
      .status(401)
      .json(constructError(errorCodes.unauthorized, "Unauthorized"));
  }

  try {
    const payload = await verifyJwt(token);
    req.auth = payload as JwtPayload;
  } catch (err) {
    return res
      .status(401)
      .json(constructError(errorCodes.unauthorized, "Unauthorized"));
  }

  next();
}
