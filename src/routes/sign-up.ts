import prisma from "@/db/prismaClient";
import express from "express";
import bcrypt from "bcryptjs";

export const signUpRouter = express.Router();

signUpRouter.get("/", (req, res) => res.render("sign-up"));

signUpRouter.post("/", async (req, res, next) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const user = await prisma.user.create({
      data: {
        username: req.body.username,
        password: hashedPassword,
      },
    });

    req.login(user, (err) => {
      if (err) return res.status(500).send("Login error");
      res.redirect("/");
    });
  } catch (err) {
    res.render("sign-up", {
      error: "Username already exists",
      username: req.body.username, // Repopulate field
    });
  }
});
