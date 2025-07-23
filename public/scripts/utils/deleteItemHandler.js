import { deleteItems } from "../api/deleteItems.js";

export const deleteItemHandler = async (e) => {
  e.preventDefault();

  const itemsSelected = document.querySelectorAll("tbody .selected");

  const folderIds = [];
  const fileIds = [];
  itemsSelected.forEach((item) => {
    const id = item.dataset.id;
    const type = item.dataset.type;

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
