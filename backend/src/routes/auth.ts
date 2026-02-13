import { Router } from "express";
import { validateUser } from "@/handlers/auth";

export const authRouter = Router();

authRouter.post("/login", validateUser);
