import { and, asc, desc, eq, ilike, or, count, type SQL } from "drizzle-orm";
import type { Request, Response } from "express";
import { db } from "@/db/db";
import { departmentsTable, tasksRevisionTable, tasksTable } from "@/db/schema";
import { constructError, errorCodes } from "@/lib/errors";
import {
  createTaskDto,
  getTasksQueryDto,
  taskIdParamDto,
  updateTaskDto,
  type CreateTaskDto,
  type GetTasksQueryDto,
  type TaskIdParamDto,
  type UpdateTaskDto,
} from "@/types/task";

const supervisorRole = "supervisor";

function isSupervisor(req: Pick<Request, "auth">) {
  return req.auth.role === supervisorRole;
}

function isCompletionPayload(payload: unknown) {
  if (!payload || typeof payload !== "object") {
    return false;
  }

  return (payload as { status?: unknown }).status === "completed";
}

async function getTaskForDepartmentAccess(taskId: number, departmentId: number) {
  const [task] = await db
    .select({ id: tasksTable.id })
    .from(tasksTable)
    .where(and(eq(tasksTable.id, taskId), eq(tasksTable.department, departmentId)));

  return task;
}

async function getPendingTaskRevisionConflicts(taskId: number) {
  const pendingRevisions = await db
    .select({
      action: tasksRevisionTable.action,
      payload: tasksRevisionTable.payload,
    })
    .from(tasksRevisionTable)
    .where(
      and(
        eq(tasksRevisionTable.taskId, taskId),
        eq(tasksRevisionTable.status, "pending"),
      ),
    );

  return {
    hasPendingDelete: pendingRevisions.some(
      (revision) => revision.action === "delete",
    ),
    hasPendingCompletion: pendingRevisions.some(
      (revision) =>
        revision.action === "complete" ||
        (revision.action === "update" && isCompletionPayload(revision.payload)),
    ),
  };
}

export async function getTasks(
  req: Request<{}, {}, {}, GetTasksQueryDto>,
  res: Response,
) {
  const queryParams = req.query;
  const { page, pageSize, search, priority, status, sortOrder } =
    getTasksQueryDto.parse(queryParams);

  const offset = (page - 1) * pageSize;

  const filters: SQL<unknown>[] = [];

  if (search) {
    filters.push(
      or(
        ilike(tasksTable.title, `%${search}%`),
        ilike(tasksTable.description, `%${search}%`),
      )!,
    );
  }

  if (priority) {
    filters.push(eq(tasksTable.priority, priority));
  }

  if (status) {
    filters.push(eq(tasksTable.status, status));
  }

  const whereClause = filters.length ? and(...filters) : undefined;
  const primaryOrder = sortOrder
    ? sortOrder === "asc"
      ? asc(tasksTable.updatedAt)
      : desc(tasksTable.updatedAt)
    : desc(tasksTable.createdAt);

  const [countRow] = await db
    .select({ totalItems: count() })
    .from(tasksTable)
    .where(whereClause);

  const data = await db
    .select({
      id: tasksTable.id,
      title: tasksTable.title,
      description: tasksTable.description,
      status: tasksTable.status,
      department: departmentsTable.name,
      priority: tasksTable.priority,
      createdBy: tasksTable.createdBy,
      createdAt: tasksTable.createdAt,
      updatedAt: tasksTable.updatedAt,
    })
    .from(tasksTable)
    .innerJoin(departmentsTable, eq(tasksTable.department, departmentsTable.id))
    .where(whereClause)
    .orderBy(primaryOrder, desc(tasksTable.id))
    .limit(pageSize)
    .offset(offset);

  const totalItems = countRow?.totalItems ?? 0;
  const totalPages = Math.ceil(totalItems / pageSize);

  return res.json({
    data,
    meta: {
      pagination: {
        page,
        pageSize,
        totalItems,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
      filters: {
        priority: priority ?? null,
        status: status ?? null,
      },
      sort: { order: sortOrder },
      search: search ?? null,
    },
  });
}

export async function createTask(
  req: Request<{}, {}, CreateTaskDto>,
  res: Response,
) {
  const task = req.body;
  createTaskDto.parse(task);

  if (!isSupervisor(req)) {
    const [revision] = await db
      .insert(tasksRevisionTable)
      .values({
        departmentId: req.auth.departmentId,
        payload: task,
        action: "create",
        requestedBy: req.auth.id,
      })
      .returning({
        id: tasksRevisionTable.id,
        action: tasksRevisionTable.action,
        status: tasksRevisionTable.status,
        taskId: tasksRevisionTable.taskId,
        createdAt: tasksRevisionTable.createdAt,
      });

    return res.status(202).json(revision);
  }

  const [taskResult] = await db
    .insert(tasksTable)
    .values({
      ...task,
      department: req.auth.departmentId,
      createdBy: req.auth.id,
    })
    .returning({
      id: tasksTable.id,
      title: tasksTable.title,
      description: tasksTable.description,
      status: tasksTable.status,
      priority: tasksTable.priority,
      createdBy: tasksTable.createdBy,
      createdAt: tasksTable.createdAt,
      updatedAt: tasksTable.updatedAt,
    });

  return res.status(201).json(taskResult);
}

export async function updateTask(
  req: Request<TaskIdParamDto, {}, UpdateTaskDto>,
  res: Response,
) {
  const params = req.params;
  taskIdParamDto.parse(params);

  const taskUpdates = req.body;
  updateTaskDto.parse(taskUpdates);

  const task = await getTaskForDepartmentAccess(params.id, req.auth.departmentId);

  if (!task) {
    return res
      .status(404)
      .json(constructError(errorCodes.taskNotFound, "Task not found."));
  }

  if (!isSupervisor(req)) {
    const revisionAction =
      taskUpdates.status === "completed" ? "complete" : "update";

    if (taskUpdates.status === "completed") {
      const { hasPendingCompletion } = await getPendingTaskRevisionConflicts(
        params.id,
      );

      if (hasPendingCompletion) {
        return res.status(409).json(
          constructError(
            errorCodes.invalidInput,
            "Completion request has already been submitted for this task.",
          ),
        );
      }
    }

    const [revision] = await db
      .insert(tasksRevisionTable)
      .values({
        taskId: params.id,
        departmentId: req.auth.departmentId,
        payload: taskUpdates,
        action: revisionAction,
        requestedBy: req.auth.id,
      })
      .returning({
        id: tasksRevisionTable.id,
        action: tasksRevisionTable.action,
        status: tasksRevisionTable.status,
        taskId: tasksRevisionTable.taskId,
        createdAt: tasksRevisionTable.createdAt,
      });

    return res.status(202).json(revision);
  }

  const [updatedTask] = await db
    .update(tasksTable)
    .set({
      ...taskUpdates,
      updatedAt: new Date(),
    })
    .where(eq(tasksTable.id, params.id))
    .returning({
      id: tasksTable.id,
    });

  if (!updatedTask) {
    return res
      .status(404)
      .json(constructError(errorCodes.taskNotFound, "Task not found."));
  }

  const [taskDetails] = await db
    .select({
      id: tasksTable.id,
      title: tasksTable.title,
      description: tasksTable.description,
      status: tasksTable.status,
      priority: tasksTable.priority,
      department: departmentsTable.name,
      createdBy: tasksTable.createdBy,
      createdAt: tasksTable.createdAt,
      updatedAt: tasksTable.updatedAt,
    })
    .from(tasksTable)
    .innerJoin(departmentsTable, eq(tasksTable.department, departmentsTable.id))
    .where(eq(tasksTable.id, updatedTask.id));

  return res.json(taskDetails);
}

export async function deleteTask(req: Request<TaskIdParamDto>, res: Response) {
  const params = req.params;
  taskIdParamDto.parse(params);

  const task = await getTaskForDepartmentAccess(params.id, req.auth.departmentId);

  if (!task) {
    return res
      .status(404)
      .json(constructError(errorCodes.taskNotFound, "Task not found."));
  }

  if (!isSupervisor(req)) {
    const { hasPendingDelete } = await getPendingTaskRevisionConflicts(
      params.id,
    );

    if (hasPendingDelete) {
      return res.status(409).json(
        constructError(
          errorCodes.invalidInput,
          "Deletion request has already been submitted for this task.",
        ),
      );
    }

    const [revision] = await db
      .insert(tasksRevisionTable)
      .values({
        taskId: params.id,
        departmentId: req.auth.departmentId,
        payload: {},
        action: "delete",
        requestedBy: req.auth.id,
      })
      .returning({
        id: tasksRevisionTable.id,
        action: tasksRevisionTable.action,
        status: tasksRevisionTable.status,
        taskId: tasksRevisionTable.taskId,
        createdAt: tasksRevisionTable.createdAt,
      });

    return res.status(202).json(revision);
  }

  const [deletedTask] = await db
    .delete(tasksTable)
    .where(eq(tasksTable.id, params.id))
    .returning({ id: tasksTable.id });

  if (!deletedTask) {
    return res
      .status(404)
      .json(constructError(errorCodes.taskNotFound, "Task not found."));
  }

  return res.status(204).send();
}

