import { getBreadcrumb } from "@/db/getBreadcrumb";
import { getFoldersAndFiles } from "@/db/getFoldersAndFiles";
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
    },
  });
});

shareRouter.get("/:token/:folderId", async (req, res, next) => {
  const sharedFolder = await prisma.folderShare.findUnique({
    where: { shareToken: req.params.token },
  });

  const expires = sharedFolder?.expires;
  console.log("test 1 ", sharedFolder, expires);
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

  console.log("test", folder);

  if (!folder) {
    res.redirect("/");
    return;
  }

  const { currentFolder, childFolders, files } = await getFoldersAndFiles(
    folder.userId,
    sharedFolder.folderId
  );

  const breadcrumbs = await getBreadcrumb(currentFolder?.id);
  // todo: in shared routes, child folders are incorrectly mapped
  // http://localhost:3000/my-files/5 instead of /share/token/folderId
  // either have a separate ejs with correct folders
  // or do if checks and update folder correctly if shared route
  // note: root shared is just /share/token, child route is /share/token/folderId

  res.render("index", {
    activePage: "my-files",
    ...{
      currentFolder,
      folders: childFolders,
      files,
      breadcrumbs,
      shared: true,
    },
  });
});
