import { Router } from "express";
import {
	approveTaskRevision,
	createTask,
	deleteTask,
	getPendingTaskRevisions,
	getTasks,
	rejectTaskRevision,
	updateTask,
} from "@/handlers/tasks";

export const tasksRouter = Router();

tasksRouter.get("/", getTasks);
tasksRouter.get("/revisions/pending", getPendingTaskRevisions);
tasksRouter.post("/revisions/:id/approve", approveTaskRevision);
tasksRouter.post("/revisions/:id/reject", rejectTaskRevision);
tasksRouter.post("/", createTask);
tasksRouter.put("/:id", updateTask);
tasksRouter.delete("/:id", deleteTask);
