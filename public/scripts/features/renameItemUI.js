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
  const renameErrorText = document.querySelector(
    "#folder-rename-error-message"
  );

  renameItemModalBtn?.addEventListener("click", () => {
    renameItemModal.showModal();
    const selectedItem = document.querySelector("tbody .selected");
    const type = selectedItem.dataset.type;
    const itemName = selectedItem.querySelector(
      type === "folder" ? ".item-name" : ".file-name"
    ).textContent;

    renameItemField.value = itemName;
    renameErrorText.classList.add("hidden");
  });

  renameItemForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const item = document.querySelector("tbody .selected");

    const id = item.dataset.id;
    const type = item.dataset.type;
    const updatedName = renameItemField.value;
    const result = await renameItem({ id, type, updatedName });

    if (result.success) {
      renameItemModal.close();
      renameErrorText.classList.add("hidden");
      renameItemForm.reset();
      location.reload();
    } else {
      renameErrorText.classList.remove("hidden");
      renameErrorText.textContent = result.error;
    }
  });

  renameItemCloseModalBtn.addEventListener("click", () => {
    renameItemModal.close();
  });

  renameItemCancelModalBtn.addEventListener("click", () => {
    renameItemModal.close();
  });
};
