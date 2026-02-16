import { Router } from "express";
import { createTask, getTasks, updateTask, deleteTask } from "@/handlers/tasks";

export const tasksRouter = Router();

tasksRouter.get("/", getTasks);
tasksRouter.post("/", createTask);
tasksRouter.put("/:id", updateTask);
tasksRouter.delete("/:id", deleteTask);
