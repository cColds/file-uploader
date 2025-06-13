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

    // const flattened = z.flattenError(result.error);
    // todo: switch to zod/v4 to flatten errors, easier to access fields
    // todo: fix all field errors not all shown at once

    // e.g., username taken (passportjs validation) error
    // and password must be 8 chars long (client side zod) error
    // client side takes priority so it only shows that first
    // probably dont render error yet just store it then render it in
    // the login or signup route

    // or create single source of truth with zod instead of passportjs
  };
};
