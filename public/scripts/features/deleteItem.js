import { deleteItemHandler } from "../utils/deleteItemHandler.js";

export const setupDeleteItemFeature = () => {
  const deleteItemModalBtn = document.querySelector("#delete-item-modal-btn");
  const deleteItemModal = document.querySelector("#delete-item-dialog");

  const deleteItemForm = document.querySelector("#delete-form");
  const deleteItemCloseModalBtn = document.querySelector(
    "#close-delete-modal-btn"
  );
  const deleteItemCancelModalBtn = document.querySelector(
    "#delete-item-cancel-btn"
  );

  deleteItemForm.addEventListener("submit", deleteItemHandler);

  deleteItemModalBtn.addEventListener("click", (e) => {
    deleteItemModal.showModal();
  });

  deleteItemCloseModalBtn.addEventListener("click", () => {
    deleteItemModal.close();
  });

  deleteItemCancelModalBtn.addEventListener("click", () => {
    deleteItemModal.close();
  });
};
