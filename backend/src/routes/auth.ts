import { Router } from "express";
import { validateUser, validateSession } from "@/handlers/auth";
import { jwt } from "@/middleware/jwt";

export const authRouter = Router();

authRouter.get("/me", jwt, validateSession);
authRouter.post("/login", validateUser);
