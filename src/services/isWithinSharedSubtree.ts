import prisma from "@/db/prismaClient";

export async function isWithinSharedSubtree(
  targetFolderId: number,
  sharedFolderId: number
) {
  let curr: null | number = targetFolderId;

  if (targetFolderId === sharedFolderId) return true;

  while (curr != null) {
    if (curr === sharedFolderId) return true;

    // loop through each folder and set curr to parent folder id
    // until u reach shared folder id
    type ParentFolderSelection = null | { parentId: number | null };

    const parent: ParentFolderSelection = await prisma.folder.findUnique({
      where: { id: curr },
      select: { parentId: true },
    });

    curr = parent?.parentId ?? null;
  }

  return false;
}
