import { deleteItems } from "../api/deleteItems.js";

export const deleteItemHandler = async (e) => {
  e.preventDefault();

  const itemsSelected = document.querySelectorAll("tbody .selected");

  const folderIds = [];
  const fileIds = [];
  itemsSelected.forEach((item) => {
    const id = item.dataset.folderId || item.dataset.fileId;
    const type = item.dataset.folderId ? "folder" : "file";

    type === "folder" ? folderIds.push(id) : fileIds.push(id);
  });

  const result = await deleteItems({
    folderIds,
    fileIds,
  });

  if (result.success) {
    window.location.reload();
  }
};
