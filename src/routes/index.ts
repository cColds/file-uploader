import prisma from "@/db/prismaClient";
import express from "express";
import { uploadFile } from "@/middleware/uploadMiddleware";
import { validateFolder } from "@/middleware/validateFolder";
import { uploadFileToCloudinary } from "@/config/cloudinaryConfig";

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

indexRouter.post("/new-file", uploadFile("file"), async (req, res, next) => {
  const file = req.file;
  if (!file) {
    res.status(400).json({ error: "File is required" });
    return;
  }

  try {
    const user = await prisma.user.findUnique({
      where: { username: req.user?.username },
      include: { folders: true },
    });

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const cloudinaryFile = await uploadFileToCloudinary(file);

    if (!cloudinaryFile) {
      res.status(502).json({ error: "Failed to upload file to Cloudinary" });
      return;
    }

    const folderId = req.query.folderId ? Number(req.query.folderId) : null;
    const rootFolderId = user?.folders[0].id;
    const filenameWithoutExtension =
      file.originalname.substring(0, file.originalname.lastIndexOf(".")) ||
      file.originalname;
    await prisma.file.create({
      data: {
        name: filenameWithoutExtension,
        size: file.size,
        folderId: folderId || rootFolderId,
        url: cloudinaryFile.secure_url,
        extension: cloudinaryFile.format,
      },
    });

    res.status(201).json({ success: true, message: "File uploaded" });
  } catch (err) {
    console.log("err", err);
    res.status(500).json({ error: "Something went wrong" });
  }
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

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const folderId = req.query.folderId ? Number(req.query.folderId) : null;
    const rootFolderId = user?.folders[0].id;

    await prisma.folder.create({
      data: {
        name: folderName,
        size: 0,
        userId: user.id,
        parentId: folderId || rootFolderId,
      },
    });

    res.status(201).json({ success: true, message: "Folder created" });
  } catch (err) {
    res.status(500).json({ error: err });
  }
});
