import { z } from "zod";

const schema = z.object({
  TURSO_DATABASE_URL: z.string().optional(),
  TURSO_AUTH_TOKEN: z.string().optional(),
});

export const env = schema.parse({
  TURSO_DATABASE_URL: process.env.TURSO_DATABASE_URL,
  TURSO_AUTH_TOKEN: process.env.TURSO_AUTH_TOKEN,
});
