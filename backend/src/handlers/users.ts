import { scrypt, randomBytes } from "node:crypto";
import { db } from "@/db/db";
import { departmentsTable, rolesTable, usersTable } from "@/db/schema";
import { createUserDto, type CreateUserDto } from "@/types/user";
import { constructError, errorCodes } from "@/lib/errors";
import type { Request, Response, NextFunction } from "express";
import { createSession } from "@/lib/session";
import { eq } from "drizzle-orm";

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
      const [departmentRow] = await db
        .select({ id: departmentsTable.id })
        .from(departmentsTable)
        .where(eq(departmentsTable.name, user.department));

      if (!departmentRow) {
        return res
          .status(400)
          .json(
            constructError(errorCodes.invalidDepartment, "Invalid department."),
          );
      }

      const [roleRow] = await db
        .select({ id: rolesTable.id })
        .from(rolesTable)
        .where(eq(rolesTable.name, user.role));

      if (!roleRow) {
        return res
          .status(400)
          .json(constructError(errorCodes.invalidRole, "Invalid role."));
      }

      const [userResult] = await db
        .insert(usersTable)
        .values({
          email: user.email,
          password: derivedKey.toString("hex"),
          salt,
          department: departmentRow.id,
          role: roleRow.id,
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
