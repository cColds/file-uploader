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
    const selectedItem = document.querySelector("tbody .selected");
    const type = selectedItem.dataset.type;
    const itemName = selectedItem.querySelector(
      type === "folder" ? ".item-name" : ".file-name"
    ).textContent;

    renameItemField.value = itemName;
  });

  renameItemForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const item = document.querySelector("tbody .selected");

    const id = item.dataset.id;
    const type = item.dataset.type;
    const updatedName = renameItemField.value;
    const result = await renameItem({ id, type, updatedName });

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
