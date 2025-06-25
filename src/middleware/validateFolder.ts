import { folderSchema } from "@/schemas/folderSchema";
import { NextFunction, Request, Response } from "express";

export const validateFolder = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const result = folderSchema.safeParse(req.body);
  console.log("result", result);
  if (result.success) {
    next();
  } else {
    const errorMessage = result.error.issues[0].message;
    res.status(400).json({ error: errorMessage });
  }
};
