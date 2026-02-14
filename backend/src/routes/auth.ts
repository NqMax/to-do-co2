import { Router } from "express";
import { validateUser, validateSession, endSession } from "@/handlers/auth";
import { jwt } from "@/middleware/jwt";

export const authRouter = Router();

authRouter.get("/me", jwt, validateSession);
authRouter.post("/logout", endSession);
authRouter.post("/login", validateUser);
