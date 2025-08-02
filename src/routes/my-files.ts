import { getBreadcrumb } from "@/db/getBreadcrumb";
import { getFoldersAndFiles } from "@/db/getFoldersAndFiles";
import prisma from "@/db/prismaClient";
import express from "express";

export const fileRouter = express.Router();

fileRouter.get("/", async (req, res, next) => {
  const userId = req.user?.id;
  if (!userId) {
    throw new Error("User not authenticated");
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

fileRouter.get("/:folderId", async (req, res, next) => {
  const folderId = req.params.folderId;
  const userId = req.user?.id;
  if (!userId) {
    throw new Error("User not authenticated");
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

fileRouter.post("/delete", async (req, res, next) => {
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

fileRouter.post("/rename", async (req, res, next) => {
  const id = Number(req.body.id);
  const updatedName = req.body.updatedName;
  const type = req.body.type;
  try {
    if (type === "folder") {
      await prisma.folder.update({
        where: { id },
        data: { name: updatedName },
      });
    } else {
      await prisma.file.update({ where: { id }, data: { name: updatedName } });
    }

    res.status(201).json({ success: true, message: "Updated item name" });
  } catch (err) {
    res.status(400).json({ message: err });
  }
});

fileRouter.get("/file/:id", async (req, res, next) => {
  const id = Number(req.params.id);
  try {
    const file = await prisma.file.findUnique({ where: { id } });

    if (file) {
      res.status(201).json({
        success: true,
        message: `File ${file.name} retrieved!`,
        file: { ...file, size: Number(file.size) },
      });
    } else {
      res.status(400).json({ message: "Failed to fetch file" });
    }
  } catch (err) {
    console.error(err);
  }
});
