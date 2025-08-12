import { getBreadcrumbShared } from "@/db/getBreadcrumb";
import { getFoldersAndFiles } from "@/db/getFoldersAndFiles";
import { isWithinSharedSubtree } from "@/services/isWithinSharedSubtree";
import prisma from "@/db/prismaClient";
import express from "express";

export const shareRouter = express.Router();

shareRouter.get("/:token", async (req, res) => {
  const sharedFolder = await prisma.folderShare.findUnique({
    where: { shareToken: req.params.token },
  });

  const expires = sharedFolder?.expires;
  if (sharedFolder == null || expires == null) {
    res.redirect("/");
    return;
  }

  if (new Date(expires) < new Date()) {
    res.redirect("/");
    return;
  }

  // in case folder owner, need to know user id
  const folder = await prisma.folder.findFirst({
    where: { shares: { some: { shareToken: sharedFolder.shareToken } } },
    select: { id: true, name: true, userId: true },
  });

  if (!folder) {
    res.redirect("/");
    return;
  }

  const { currentFolder, childFolders, files } = await getFoldersAndFiles(
    folder.userId,
    sharedFolder.folderId
  );

  const breadcrumbs = [{ id: folder.id, name: folder.name }];

  res.render("index", {
    activePage: "my-files",
    ...{
      currentFolder,
      folders: childFolders,
      files,
      breadcrumbs,
      shared: true,
      token: req.params.token,
    },
  });
});

shareRouter.get("/:token/:folderId", async (req, res, next) => {
  const sharedFolder = await prisma.folderShare.findUnique({
    where: { shareToken: req.params.token },
  });

  const expires = sharedFolder?.expires;
  const hasExpired = expires == null ? false : new Date(expires) < new Date();

  if (sharedFolder == null || hasExpired) {
    res.redirect("/");
    return;
  }

  // in case folder owner, need to know user id
  const folder = await prisma.folder.findFirst({
    where: { shares: { some: { shareToken: sharedFolder.shareToken } } },
    select: { id: true, name: true, userId: true },
  });

  const currFolderId = Number(req.params.folderId);
  const withinSubtree = await isWithinSharedSubtree(
    currFolderId,
    sharedFolder.folderId
  );

  if (!folder || !withinSubtree) {
    res.redirect("/");
    return;
  }

  const { currentFolder, childFolders, files } = await getFoldersAndFiles(
    folder.userId,
    Number(req.params.folderId)
  );

  const breadcrumbs = await getBreadcrumbShared(
    sharedFolder.folderId,
    currentFolder?.id
  );

  res.render("index", {
    activePage: "my-files",
    ...{
      currentFolder,
      folders: childFolders,
      files,
      breadcrumbs,
      shared: true,
      token: req.params.token,
    },
  });
});
