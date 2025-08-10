import prisma from "./prismaClient";
import { File } from "@prisma/client";
import { format } from "date-fns";
import { formatHumanFileSize } from "./formatHumanFileSize";

export const getFoldersAndFiles = async (
  userId: number,
  parentFolderId: number | null
) => {
  const currentFolder = parentFolderId
    ? await prisma.folder.findUnique({
        where: { userId, id: parentFolderId },
        select: { id: true, name: true },
      })
    : null;

  const childFolders = await prisma.folder.findMany({
    where: { userId, parentId: parentFolderId },
    select: {
      id: true,
      name: true,
      files: true,
      size: true,
      createdAt: true,
      subfolders: true,
    },
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
        updatedAt: true,
        url: true,
        folderId: true,
        extension: true,
      },
    });
  }

  const formattedFiles = files.map((file) => ({
    ...file,
    createdAt: format(new Date(), "MMM d, yyyy"),
    size: formatHumanFileSize(Number(file.size)),
  }));

  const childFoldersFormatted = childFolders.map((folder) => ({
    ...folder,
    createdAt: format(new Date(), "MMM d, yyyy"),
  }));

  return {
    currentFolder,
    childFolders: childFoldersFormatted,
    files: formattedFiles,
  };
};
