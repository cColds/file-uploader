import prisma from "./prismaClient";

export const getBreadcrumb = async (currentFolderId?: number) => {
  const breadcrumbs = [];

  while (currentFolderId) {
    // fetch parent id of current folder
    const parentFolder = await prisma.folder.findFirst({
      where: { id: currentFolderId },
    });

    if (!parentFolder) break;
    // set to parent id to start recursion
    breadcrumbs.unshift(parentFolder);

    // if parent id is null, theres no more parent
    if (!parentFolder.parentId) break;
    currentFolderId = parentFolder.parentId;
  }

  console.log("breadcrumbs", breadcrumbs);
  return breadcrumbs;
};
