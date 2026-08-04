import { Type, type Static } from "@sinclair/typebox";

export const TaskStatusEnum = Type.Enum({
  BACKLOG: "BACKLOG",
  TODO: "TODO",
  IN_PROGRESS: "IN_PROGRESS",
  REVIEW: "REVIEW",
  DEPLOY: "DEPLOY",
  DONE: "DONE",
});

export const TaskPriorityEnum = Type.Enum({
  LOW: "LOW",
  MEDIUM: "MEDIUM",
  HIGH: "HIGH",
  URGENT: "URGENT",
});

export const createTaskSchema = Type.Object({
  title: Type.String({ minLength: 1 }),
  description: Type.Optional(Type.String()),
  status: Type.Optional(TaskStatusEnum),
  priority: Type.Optional(TaskPriorityEnum),
  dueDate: Type.Optional(Type.String({ format: "date-time" })),
  assigneeId: Type.Optional(Type.String()),
});

export const updateTaskSchema = Type.Object({
  title: Type.Optional(Type.String({ minLength: 1 })),
  description: Type.Optional(Type.Union([Type.String(), Type.Null()])),
  status: Type.Optional(TaskStatusEnum),
  priority: Type.Optional(TaskPriorityEnum),
  dueDate: Type.Optional(Type.Union([Type.String({ format: "date-time" }), Type.Null()])),
  assigneeId: Type.Optional(Type.Union([Type.String(), Type.Null()])),
});

export const reorderTaskSchema = Type.Object({
  status: TaskStatusEnum,
  position: Type.Number(),
});

export const getProjectTasksParamsSchema = Type.Object({
  projectId: Type.String(),
});

export const taskParamsSchema = Type.Object({
  id: Type.String(),
});

export type CreateTaskInput = Static<typeof createTaskSchema>;
export type UpdateTaskInput = Static<typeof updateTaskSchema>;
export type ReorderTaskInput = Static<typeof reorderTaskSchema>;
