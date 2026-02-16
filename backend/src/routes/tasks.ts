import { Router } from "express";
import { createTask, deleteTask, getTasks, updateTask } from "@/handlers/tasks";
import {
  approveTaskRevision,
  getTaskRevisions,
  rejectTaskRevision,
} from "@/handlers/revisions";

export const tasksRouter = Router();

tasksRouter.get("/", getTasks);
tasksRouter.post("/", createTask);
tasksRouter.put("/:id", updateTask);
tasksRouter.delete("/:id", deleteTask);

tasksRouter.get("/revisions", getTaskRevisions);
tasksRouter.post("/revisions/:id/approve", approveTaskRevision);
tasksRouter.post("/revisions/:id/reject", rejectTaskRevision);
