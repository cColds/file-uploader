import { NextFunction, RequestHandler } from "express";
import { z } from "zod";
import { Request, Response } from "express";

type ViewType = "sign-up" | "log-in";

export const validateBody = (
  schema: z.ZodSchema,
  view: ViewType
): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const { fieldErrors } = result.error.flatten();
      const errors: Record<string, string> = {};
      for (const [field, msgs] of Object.entries(fieldErrors)) {
        if (msgs && msgs.length) errors[field] = msgs[0]!;
      }
      res.render(view, { errors, body: req.body });
      return;
    }
    req.body = result.data;
    next();
  };
};
