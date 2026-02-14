import { scrypt, randomBytes } from "node:crypto";
import { db } from "@/db/db";
import { usersTable } from "@/db/schema";
import { createUserDto, type CreateUserDto } from "@/types/user";
import type { Request, Response, NextFunction } from "express";
import { createSession } from "@/lib/session";

export function createUser(
  req: Request<{}, {}, CreateUserDto>,
  res: Response,
  next: NextFunction,
) {
  const user = req.body;
  createUserDto.parse(user);

  const salt = randomBytes(16).toString("hex");
  scrypt(user.password, salt, 64, async (err, derivedKey) => {
    if (err) return next(err);

    try {
      const [userResult] = await db
        .insert(usersTable)
        .values({
          ...user,
          password: derivedKey.toString("hex"),
          salt,
        })
        .returning({
          id: usersTable.id,
          email: usersTable.email,
          department: usersTable.department,
          role: usersTable.role,
          createdAt: usersTable.createdAt,
        });

      await createSession(res, {
        id: userResult.id,
        department: userResult.department,
        role: userResult.role,
      });

      return res.status(201).json(userResult);
    } catch (err) {
      return next(err);
    }
  });
}
