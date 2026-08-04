import { Type, type Static } from "@sinclair/typebox";


export const createProjectSchema = Type.Object({
  name: Type.String({ minLength: 2 }),
  description: Type.Optional(Type.String()),
  githubRepoUrl: Type.Optional(
    Type.Union([Type.String({ format: "uri" }), Type.Literal("")])
  ),
});

export const getProjectParamsSchema = Type.Object({
  id: Type.String(),
});

export const createProjectParamsSchema = Type.Object({
  workspaceId: Type.String(),
});

export type CreateProjectInput = Static<typeof createProjectSchema>;

