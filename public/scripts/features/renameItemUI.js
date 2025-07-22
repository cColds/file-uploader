import { renameItem } from "../api/renameItem.js";

export const setupRenameItemFeature = () => {
  const renameItemModalBtn = document.querySelector("#rename-item-modal-btn");
  const renameItemModal = document.querySelector("#rename-item-dialog");

  const renameItemForm = document.querySelector("#rename-form");
  const renameItemField = document.querySelector("#rename-field");
  const renameItemCloseModalBtn = document.querySelector(
    "#close-rename-modal-btn"
  );
  const renameItemCancelModalBtn = document.querySelector(
    "#rename-item-cancel-btn"
  );

  renameItemModalBtn.addEventListener("click", () => {
    renameItemModal.showModal();
    const selectedItem = document.querySelector("tbody .selected .item-name");
    renameItemField.value = selectedItem.textContent;
  });

  renameItemForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const item = document.querySelector("tbody .selected");

    const id = item.dataset.folderId || item.dataset.fileId;
    const type = item.dataset.folderId ? "folderId" : "fileId";
    const updatedName = renameItemField.value;
    const result = await renameItem({ [type]: id, updatedName });

    if (result.success) {
      location.reload();
    }
  });

  renameItemCloseModalBtn.addEventListener("click", () => {
    renameItemModal.close();
  });

  renameItemCancelModalBtn.addEventListener("click", () => {
    renameItemModal.close();
  });
};
