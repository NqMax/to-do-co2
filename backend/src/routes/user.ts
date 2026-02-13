import { Router } from "express";
import { getUser, createUser } from "@/handlers/users";

export const userRouter = Router();

userRouter.get("/:userId", getUser);
userRouter.post("/", createUser);
