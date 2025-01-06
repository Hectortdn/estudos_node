import { config } from "dotenv";
import { z } from "zod";

if (process.env.NODE_ENV === "test") {
  config({
    path: ".env.test",
  });
} else {
  config();
}

const envSchema = z.object({
  DATABASE_URL: z.string(),
  NODE_ENV: z.enum(["development", "production", "test"]),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error("", _env.error.format());
  throw new Error();
}

export const env = _env.data;
