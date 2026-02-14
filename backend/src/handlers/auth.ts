import { scrypt } from "node:crypto";
import { eq } from "drizzle-orm";
import { db } from "@/db/db";
import { usersTable } from "@/db/schema";
import { createSession, deleteSession } from "@/lib/session";
import { constructError, errorCodes } from "@/lib/errors";
import { loginDto, type LoginDto } from "@/types/auth";
import type { Request, Response, NextFunction } from "express";

export async function endSession(_: Request, res: Response) {
  return deleteSession(res);
}

export async function validateSession(req: Request, res: Response) {
  const auth = req.auth;

  const [userResult] = await db
    .select({
      id: usersTable.id,
      email: usersTable.email,
      department: usersTable.department,
      role: usersTable.role,
      createdAt: usersTable.createdAt,
    })
    .from(usersTable)
    .where(eq(usersTable.id, auth.id));

  res.json(userResult);
}

export async function validateUser(
  req: Request<{}, {}, LoginDto>,
  res: Response,
  next: NextFunction,
) {
  const user = req.body;
  loginDto.parse(user);

  const [userResult] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, user.email));

  if (!userResult) {
    return res
      .status(401)
      .json(
        constructError(
          errorCodes.invalidCredentials,
          "Invalid email or password.",
        ),
      );
  }

  scrypt(user.password, userResult.salt, 64, async (err, derivedKey) => {
    if (err) return next(err);

    try {
      const derivedKeyString = derivedKey.toString("hex");

      if (derivedKeyString !== userResult.password) {
        return res
          .status(401)
          .json(
            constructError(
              errorCodes.invalidCredentials,
              "Invalid email or password.",
            ),
          );
      }

      await createSession(res, {
        id: userResult.id,
        department: userResult.department,
        role: userResult.role,
      });

      const { password, salt, ...userWithoutPassword } = userResult;

      return res.json({ ...userWithoutPassword });
    } catch (err) {
      return next(err);
    }
  });
}
