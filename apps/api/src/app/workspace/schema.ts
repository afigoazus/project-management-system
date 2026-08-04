import { Type, type Static } from "@sinclair/typebox";


export const createWorkspaceSchema = Type.Object({
  name: Type.String({ minLength: 2 }),
  slug: Type.Optional(Type.String({ minLength: 2 })),
});

export const getWorkspaceByIdSchema = Type.Object({
  id: Type.String(),
});

export const addWorkspaceMemberSchema = Type.Object({
  email: Type.String({ format: "email" }),
  role: Type.Enum({ ADMIN: "ADMIN", MEMBER: "MEMBER" }, { default: "MEMBER" }),
});

export type CreateWorkspaceInput = Static<typeof createWorkspaceSchema>;
export type AddWorkspaceMemberInput = Static<typeof addWorkspaceMemberSchema>;

