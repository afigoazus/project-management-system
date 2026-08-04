import { initializeApp } from "./app";
import { env } from "./config/env";

try {
  const app = await initializeApp();
  await app.listen({
    port: env.PORT,
    host: "0.0.0.0",
  });
} catch (err) {
  console.error(err);
  process.exit(1);
}
