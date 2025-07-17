import { getBreadcrumb } from "@/db/getBreadcrumb";
import { getFoldersAndFiles } from "@/db/getFoldersAndFiles";
import prisma from "@/db/prismaClient";
import express from "express";

export const fileRouter = express.Router();

fileRouter.get("/my-files", async (req, res, next) => {
  const userId = req.user?.id;
  if (!userId) {
    res.sendStatus(404).json({ error: "User not found" });
    return;
  }

  const { currentFolder, childFolders, files } = await getFoldersAndFiles(
    userId,
    null
  );

  res.render("index", {
    activePage: "my-files",
    ...{ currentFolder, folders: childFolders, files },
  });
});

fileRouter.get("/my-files/:folderId", async (req, res, next) => {
  const folderId = req.params.folderId;
  const userId = req.user?.id;
  if (!userId) {
    res.sendStatus(404).json({ error: "User not found" });
    return;
  }

  const { currentFolder, childFolders, files } = await getFoldersAndFiles(
    userId,
    Number(folderId)
  );

  const breadcrumbs = await getBreadcrumb(currentFolder?.id);

  res.render("index", {
    activePage: "my-files",
    ...{ currentFolder, folders: childFolders, files, breadcrumbs },
  });
});

fileRouter.post("/my-files/delete/:itemId", async (req, res, next) => {
  const itemId = Number(req.params.itemId);
  const type = req.body.type;

  try {
    if (type === "folder") {
      await prisma.folder.delete({ where: { id: itemId } });
    } else {
      await prisma.file.delete({ where: { id: itemId } });
    }

    res.status(201).json({ success: true, message: "Deleted item" });
  } catch (err) {
    res.status(500).json({ error: err });
  }
});
