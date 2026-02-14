import { Router } from "express";
import { createUser } from "@/handlers/users";

export const userRouter = Router();

userRouter.post("/", createUser);
