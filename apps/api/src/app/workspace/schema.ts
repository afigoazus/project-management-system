import { z } from "zod";

export const createWorkspaceSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  slug: z.string().min(2).optional(),
});

export const getWorkspaceByIdSchema = z.object({
  id: z.string(),
});

export const addWorkspaceMemberSchema = z.object({
  email: z.string().email(),
  role: z.enum(["ADMIN", "MEMBER"]).default("MEMBER"),
});

export type CreateWorkspaceInput = z.infer<typeof createWorkspaceSchema>;
export type AddWorkspaceMemberInput = z.infer<typeof addWorkspaceMemberSchema>;
