import { deleteItemHandler } from "./utils/deleteItemHandler.js";

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
      const checkbox = row.querySelector("input[type='checkbox']");
      const clickedCheckbox = e.target.matches("input[type='checkbox']");
      // if directly clicked on checkbox, no need to update checkbox with js
      if (!clickedCheckbox) {
        checkbox.checked = !checkbox.checked;
      }

      row.classList.toggle("selected", checkbox.checked);

      const selectedRows = tableBody.querySelectorAll("tr.selected");
      const hasSelectedRow = selectedRows.length > 0;
      const allSelected = selectedRows.length === rows.length;

      tableHeaderCheckbox.checked = allSelected;

      tableCommandbarWrapper.classList.toggle("active", hasSelectedRow);
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
});
