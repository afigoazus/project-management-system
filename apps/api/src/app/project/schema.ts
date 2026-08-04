import { z } from "zod";

export const createProjectSchema = z.object({
  name: z.string().min(2, "Project name must be at least 2 characters"),
  description: z.string().optional(),
  githubRepoUrl: z.string().url("Invalid GitHub URL").or(z.literal("")).optional(),
});

export const getProjectParamsSchema = z.object({
  id: z.string(),
});

export const createProjectParamsSchema = z.object({
  workspaceId: z.string(),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
