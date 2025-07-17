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

fileRouter.post("/my-files/delete", async (req, res, next) => {
  const folderIds = req.body.folderIds.map((folderId: string) =>
    Number(folderId)
  );
  const fileIds = req.body.fileIds.map((fileId: string) => Number(fileId));

  const rootFolders = await prisma.folder.findMany({
    where: {
      id: { in: folderIds },
      parentId: null,
    },
    select: { id: true },
  });

  if (rootFolders.length > 0) {
    res.status(400).json({
      error: `Cannot delete root folders: ${rootFolders
        .map((f) => f.id)
        .join(", ")}`,
    });
    return;
  }

  try {
    if (folderIds.length) {
      await prisma.folder.deleteMany({
        where: { id: { in: folderIds }, parentId: { not: null } },
      });
    }
    if (fileIds.length) {
      await prisma.file.deleteMany({ where: { id: { in: fileIds } } });
    }

    res
      .status(201)
      .json({ success: true, message: "Deleted items successfully" });
  } catch (err) {
    res.status(500).json({ error: err });
  }
});
