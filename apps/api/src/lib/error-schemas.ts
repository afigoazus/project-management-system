import { Type } from "@sinclair/typebox";

export const ErrorResponseSchema = Type.Object(
  {
    statusCode: Type.Number({ example: 400 }),
    error: Type.String({ example: "Bad Request" }),
    message: Type.String({ example: "Error message detail" }),
  },
  { description: "Standard Error Response" }
);

export const ValidationErrorResponseSchema = Type.Object(
  {
    statusCode: Type.Number({ example: 400 }),
    error: Type.String({ example: "Bad Request" }),
    message: Type.String({ example: "Validation failed" }),
    validation: Type.Optional(Type.Any()),
  },
  { description: "Validation Error Response" }
);

export const commonErrorResponses = {
  400: ValidationErrorResponseSchema,
  401: ErrorResponseSchema,
  403: ErrorResponseSchema,
  404: ErrorResponseSchema,
  500: ErrorResponseSchema,
};
