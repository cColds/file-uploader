import { z } from "zod";

export const signUpSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3-16 characters long")
    .max(16, "Username must be at least 3-16 characters long")
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      "Username should only consist of numbers, letters, dashes, and underscores"
    ),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .max(32, "Password must be less than 128 characters"),
});
