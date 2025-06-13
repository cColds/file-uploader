import { z } from "zod";

export const loginSchema = z.object({
  username: z
    .string()
    .min(3, "Invalid username or password")
    .max(16, "Invalid username or password")
    .regex(/^[a-zA-Z0-9_-]+$/, "Invalid username or password"),
  password: z.string(),
});
