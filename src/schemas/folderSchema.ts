import { z } from "zod";

export const folderSchema = z.object({
  folderName: z
    .string()
    .min(1, "Folder name cannot be empty")
    .max(24, "Folder name must be 1-24 characters")
    .refine(
      (val) => val === "" || /^[a-zA-Z0-9_-]+$/.test(val),
      "Folder must contain alphanumeric characters, underscores or dashes"
    ),
});
