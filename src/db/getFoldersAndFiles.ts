import prisma from "./prismaClient";
import { File } from "@prisma/client";

export const getFoldersAndFiles = async (
  userId: number,
  parentFolderId: number | null
) => {
  const currentFolder = parentFolderId
    ? await prisma.folder.findUnique({
        where: { id: parentFolderId },
        select: { id: true, name: true },
      })
    : null;

  // pretty sure dont even need user id cause folderids are unique

  const childFolders = await prisma.folder.findMany({
    where: { userId, parentId: parentFolderId },
    select: { id: true, name: true, files: true, size: true, createdAt: true },
  });

  let files: File[] = [];

  if (parentFolderId) {
    files = await prisma.file.findMany({
      where: {
        folderId: parentFolderId,
      },
      select: {
        id: true,
        name: true,
        size: true,
        createdAt: true,
        url: true,
        folderId: true,
      },
    });
  }

  console.log({ currentFolder, childFolders, files });

  return { currentFolder, childFolders, files };
};
