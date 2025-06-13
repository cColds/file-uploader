import { NextFunction, RequestHandler } from "express";
import { z } from "zod";
import { Request, Response } from "express";

export const validateBody = (schema: z.ZodSchema): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const { fieldErrors } = result.error.flatten();
      const errors: Record<string, string> = {};
      for (const [field, msgs] of Object.entries(fieldErrors)) {
        if (msgs && msgs.length) errors[field] = msgs[0]!;
      }
      console.log("errors", errors);
      res.render("log-in", { errors });
      return;
    }
    req.body = result.data;
    next();

    // const flattened = z.flattenError(result.error);
    // todo: switch to zod/v4 to flatten errors, easier to access fields
  };
};
