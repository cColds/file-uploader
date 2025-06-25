import prisma from "@/db/prismaClient";
import express from "express";
import { uploadFile } from "@/middleware/uploadMiddleware";
import { validateFolder } from "@/middleware/validateFolder";

export const indexRouter = express.Router();

indexRouter.get(
  "/",
  (req, res, next) => {
    if (!req.user) return res.redirect("/log-in");

    next();
  },
  async (req, res) => {
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

indexRouter.post("/new-folder", validateFolder, async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const folderName = req.body.folderName;

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        folders: true,
      },
    });

    if (user) {
      const rootFolderId = user?.folders[0].id;
      await prisma.folder.create({
        data: {
          name: folderName,
          size: 0,
          userId: user.id,
          parentId: rootFolderId,
        },
      });

      res.json({ success: true, message: "Folder created" });
    } else {
      res.json({ error: "User not found" });
    }
  } catch (err) {
    res.json({ error: err });
  }
});
