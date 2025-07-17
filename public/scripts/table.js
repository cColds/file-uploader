import { deleteItem } from "./api/deleteItem.js";

document.addEventListener("DOMContentLoaded", () => {
  const tableHeaderCheckbox = document.getElementById("table-header-checkbox");
  const tableCommandbarWrapper = document.querySelector(
    ".table-commandbar-wrapper"
  );

  tableHeaderCheckbox.addEventListener("click", (e) => {
    const selectAll = e.target.checked;

    document.querySelectorAll("tbody tr").forEach((row) => {
      const checkbox = row.querySelector("input[type='checkbox']");
      checkbox.checked = selectAll;
      row.classList.toggle("selected", selectAll);
    });

    tableCommandbarWrapper.classList.toggle("active", selectAll);
  });

  const tableBody = document.querySelector("tbody");

  const rows = tableBody.querySelectorAll("tr");
  rows.forEach((row) => {
    row.addEventListener("click", (e) => {
      row.classList.toggle("selected");

      const selectedRows = tableBody.querySelectorAll("tr.selected");
      const hasSelectedRow = selectedRows.length > 0;

      tableCommandbarWrapper.classList.toggle("active", hasSelectedRow);

      if (e.target.matches('input[type="checkbox"]')) return;
      const checkbox = row.querySelector("input[type='checkbox']");
      checkbox.checked = !checkbox.checked;
    });
  });

  const deleteItemModalBtn = document.querySelector("#delete-item-modal-btn");
  const deleteItemModal = document.querySelector("#delete-item-dialog");

  const deleteItemForm = document.querySelector("#delete-form");
  const deleteItemCloseModalBtn = document.querySelector(
    "#close-delete-modal-btn"
  );
  const deleteItemCancelModalBtn = document.querySelector(
    "#delete-item-cancel-btn"
  );

  deleteItemForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const itemsSelected = document.querySelectorAll("tbody .selected");

    if (itemsSelected.length === 1) {
      const itemToDelete = itemsSelected[0];
      const id = itemToDelete.dataset.folderId || itemToDelete.dataset.fileId;
      const type = itemToDelete.dataset.folderId ? "folder" : "file";

      const result = await deleteItem(id, type);

      if (result.success) {
        window.location.reload();

        return;
      }
    } else {
      // todo: add delete multiple folders/files
      // store folder ids and file ids in separate arrays maybe
    }
  });

  deleteItemModalBtn.addEventListener("click", (e) => {
    deleteItemModal.showModal();
  });

  deleteItemCloseModalBtn.addEventListener("click", () => {
    deleteItemModal.close();
  });

  deleteItemCancelModalBtn.addEventListener("click", () => {
    deleteItemModal.close();
  });
});
