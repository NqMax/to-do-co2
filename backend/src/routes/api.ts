import { Router } from "express";
import { userRouter } from "@/routes/user";
import { authRouter } from "@/routes/auth";
import { tasksRouter } from "@/routes/tasks";
import { jwt } from "@/middleware/jwt";

export const apiRouter = Router();

apiRouter.use("/users", userRouter);
apiRouter.use("/auth", authRouter);
apiRouter.use("/tasks", jwt, tasksRouter);
