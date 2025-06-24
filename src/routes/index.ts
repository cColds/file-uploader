import prisma from "@/db/prismaClient";
import express from "express";
import { uploadFile } from "@/middleware/uploadMiddleware";

export const indexRouter = express.Router();

indexRouter.get(
  "/",
  (req, res, next) => {
    if (!req.user) return res.redirect("/log-in");

    next();
  },
  async (req, res) => {
    const { user } = req;
    console.log("test", user?.id);

    const userData = await prisma.user.findUnique({
      where: { id: req?.user?.id },
      include: { folders: { where: { userId: req?.user?.id } } },
    });
    console.log("user: ", userData);

    res.render("index", { activePage: "home" });
  }
);

indexRouter.post("/new-file", uploadFile("file"), (req, res, next) => {
  const file = req.file;
  if (!file) {
    res.status(400).json({ error: "File is required" });
    return;
  }

  res.json({ success: true, message: "File uploaded" });
});
