import { Router } from "express";
import { userRouter } from "@/routes/user";
import { authRouter } from "@/routes/auth";

export const apiRouter = Router();

apiRouter.use("/users", userRouter);
apiRouter.use("/auth", authRouter);
