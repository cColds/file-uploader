import prisma from "@/db/prismaClient";
import express from "express";
import bcrypt from "bcryptjs";
import { signUpSchema } from "@/schemas/signUpSchema";
import { validateBody } from "@/middleware/validateBody";

export const signUpRouter = express.Router();

signUpRouter.get("/", (req, res) =>
  res.render("sign-up", { body: req.body, errors: {} })
);

signUpRouter.post(
  "/",
  validateBody(signUpSchema, "sign-up"),
  async (req, res, next) => {
    try {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);

      const isUniqueUsername = await prisma.user.findUnique({
        where: { username: req.body.username },
      });
      if (isUniqueUsername) {
        res.render("sign-up", {
          errors: {
            username: "Username already exists",
          },
          body: req.body,
        });
        return;
      }

      const user = await prisma.user.create({
        data: {
          username: req.body.username,
          password: hashedPassword,
          folders: {
            create: {
              name: req.body.username,
              size: 0,
            },
          },
        },
      });

      req.login(user, (err) => {
        if (err) return res.status(500).send("Login error");
        res.redirect("/");
      });
    } catch (err) {
      res.render("sign-up", {
        errors: {
          username: "Something went wrong",
        },
        body: req.body,
      });
    }
  }
);
