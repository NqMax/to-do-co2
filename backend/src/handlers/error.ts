import type { Request, Response, NextFunction } from "express";
import { constructError, errorCodes } from "@/lib/errors";

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  console.error(err);

  return res
    .status(500)
    .json(
      constructError(errorCodes.internalServerError, "Internal server error."),
    );
}
