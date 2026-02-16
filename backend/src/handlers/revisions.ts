import { and, asc, count, desc, eq, type SQL } from "drizzle-orm";
import type { Request, Response } from "express";
import { db } from "@/db/db";
import { tasksRevisionTable, tasksTable } from "@/db/schema";
import { constructError, errorCodes } from "@/lib/errors";
import {
  createTaskDto,
  getTaskRevisionsQueryDto,
  taskRevisionIdParamDto,
  updateTaskDto,
  type GetTaskRevisionsQueryDto,
  type TaskRevisionIdParamDto,
} from "@/types/task";

const supervisorRole = "supervisor";

function isSupervisor(req: Pick<Request, "auth">) {
  return req.auth.role === supervisorRole;
}

function forbidNonSupervisor(res: Response) {
  return res
    .status(403)
    .json(
      constructError(errorCodes.invalidRole, "Only supervisors can perform this action."),
    );
}

export async function getTaskRevisions(
  req: Request<{}, {}, {}, GetTaskRevisionsQueryDto>,
  res: Response,
) {
  const queryParams = req.query;
  const { page, pageSize, action, status, sortOrder } =
    getTaskRevisionsQueryDto.parse(queryParams);
  const offset = (page - 1) * pageSize;

  const filters: SQL<unknown>[] = [];

  if (isSupervisor(req)) {
    filters.push(eq(tasksRevisionTable.departmentId, req.auth.departmentId));
  } else {
    filters.push(eq(tasksRevisionTable.requestedBy, req.auth.id));
  }

  if (action) {
    filters.push(eq(tasksRevisionTable.action, action));
  }

  if (status) {
    filters.push(eq(tasksRevisionTable.status, status));
  }

  const whereClause = filters.length ? and(...filters) : undefined;
  const primaryOrder =
    sortOrder === "asc"
      ? asc(tasksRevisionTable.createdAt)
      : desc(tasksRevisionTable.createdAt);

  const [countRow] = await db
    .select({ totalItems: count() })
    .from(tasksRevisionTable)
    .where(whereClause);

  const revisions = await db
    .select({
      id: tasksRevisionTable.id,
      taskId: tasksRevisionTable.taskId,
      payload: tasksRevisionTable.payload,
      action: tasksRevisionTable.action,
      requestedBy: tasksRevisionTable.requestedBy,
      status: tasksRevisionTable.status,
      createdAt: tasksRevisionTable.createdAt,
    })
    .from(tasksRevisionTable)
    .where(whereClause)
    .orderBy(primaryOrder, desc(tasksRevisionTable.id))
    .limit(pageSize)
    .offset(offset);

  const totalItems = countRow?.totalItems ?? 0;
  const totalPages = Math.ceil(totalItems / pageSize);

  return res.json({
    data: revisions,
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
        action: action ?? null,
        status: status ?? null,
      },
      sort: { order: sortOrder },
      search: null,
    },
  });
}

export async function approveTaskRevision(
  req: Request<TaskRevisionIdParamDto>,
  res: Response,
) {
  if (!isSupervisor(req)) {
    return forbidNonSupervisor(res);
  }

  const params = req.params;
  taskRevisionIdParamDto.parse(params);

  const [revision] = await db
    .select({
      id: tasksRevisionTable.id,
      taskId: tasksRevisionTable.taskId,
      departmentId: tasksRevisionTable.departmentId,
      payload: tasksRevisionTable.payload,
      action: tasksRevisionTable.action,
      requestedBy: tasksRevisionTable.requestedBy,
      status: tasksRevisionTable.status,
    })
    .from(tasksRevisionTable)
    .where(
      and(
        eq(tasksRevisionTable.id, params.id),
        eq(tasksRevisionTable.departmentId, req.auth.departmentId),
        eq(tasksRevisionTable.status, "pending"),
      ),
    );

  if (!revision) {
    return res
      .status(404)
      .json(
        constructError(errorCodes.taskNotFound, "Pending revision request not found."),
      );
  }

  if (
    (revision.action === "update" ||
      revision.action === "delete" ||
      revision.action === "complete") &&
    revision.taskId
  ) {
    const [existingTask] = await db
      .select({ id: tasksTable.id })
      .from(tasksTable)
      .where(
        and(
          eq(tasksTable.id, revision.taskId),
          eq(tasksTable.department, revision.departmentId),
        ),
      );

    if (!existingTask) {
      if (revision.action === "update" || revision.action === "complete") {
        await db
          .delete(tasksRevisionTable)
          .where(eq(tasksRevisionTable.id, revision.id));

        return res.status(404).json(
          constructError(
            errorCodes.taskNotFound,
            "Task not found. Stale request was removed.",
          ),
        );
      }

      return res
        .status(404)
        .json(constructError(errorCodes.taskNotFound, "Task not found."));
    }
  }

  let task: { id: number } | undefined;

  await db.transaction(async (tx) => {
    if (revision.action === "create") {
      const payload = createTaskDto.parse(revision.payload);

      [task] = await tx
        .insert(tasksTable)
        .values({
          ...payload,
          department: revision.departmentId,
          createdBy: revision.requestedBy,
        })
        .returning({ id: tasksTable.id });
    }

    if (revision.action === "update") {
      const payload = updateTaskDto.parse(revision.payload);

      [task] = await tx
        .update(tasksTable)
        .set({
          ...payload,
          updatedAt: new Date(),
        })
        .where(
          and(
            eq(tasksTable.id, revision.taskId!),
            eq(tasksTable.department, revision.departmentId),
          ),
        )
        .returning({ id: tasksTable.id });
    }

    if (revision.action === "complete") {
      [task] = await tx
        .update(tasksTable)
        .set({
          status: "completed",
          updatedAt: new Date(),
        })
        .where(
          and(
            eq(tasksTable.id, revision.taskId!),
            eq(tasksTable.department, revision.departmentId),
          ),
        )
        .returning({ id: tasksTable.id });
    }

    if (revision.action === "delete") {
      [task] = await tx
        .delete(tasksTable)
        .where(
          and(
            eq(tasksTable.id, revision.taskId!),
            eq(tasksTable.department, revision.departmentId),
          ),
        )
        .returning({ id: tasksTable.id });
    }

    await tx
      .update(tasksRevisionTable)
      .set({
        status: "approved",
      })
      .where(eq(tasksRevisionTable.id, revision.id));
  });

  return res.json({
    id: revision.id,
    status: "approved",
    action: revision.action,
    taskId: task?.id ?? revision.taskId,
  });
}

export async function rejectTaskRevision(
  req: Request<TaskRevisionIdParamDto>,
  res: Response,
) {
  if (!isSupervisor(req)) {
    return forbidNonSupervisor(res);
  }

  const params = req.params;
  taskRevisionIdParamDto.parse(params);

  const [revision] = await db
    .update(tasksRevisionTable)
    .set({ status: "rejected" })
    .where(
      and(
        eq(tasksRevisionTable.id, params.id),
        eq(tasksRevisionTable.departmentId, req.auth.departmentId),
        eq(tasksRevisionTable.status, "pending"),
      ),
    )
    .returning({ id: tasksRevisionTable.id, status: tasksRevisionTable.status });

  if (!revision) {
    return res
      .status(404)
      .json(
        constructError(errorCodes.taskNotFound, "Pending revision request not found."),
      );
  }

  return res.json(revision);
}