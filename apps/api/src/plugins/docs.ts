import fp from "fastify-plugin";
import fastifySwagger from "@fastify/swagger";
import scalarApiReference from "@scalar/fastify-api-reference";

export default fp(async (fastify) => {
  await fastify.register(fastifySwagger, {
    openapi: {
      info: {
        title: "Developer Workspace API",
        description: "API Documentation for Developer Workspace Project Management",
        version: "1.0.0",
        contact: {
          name: "Developer Team",
        },
      },
      servers: [
        {
          url: "http://localhost:4000",
          description: "Development Server",
        },
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
            description: "Enter your Bearer Token for authorization",
          },
        },
      },
      security: [
        {
          bearerAuth: [],
        },
      ],
    },
  });

  await fastify.register(scalarApiReference, {
    routePrefix: "/docs",
    configuration: {
      theme: "purple",
      spec: {
        content: () => fastify.swagger(),
      },
    },
  });
});
