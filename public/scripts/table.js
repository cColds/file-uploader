import { setupDeleteItemFeature } from "./features/deleteItemUI.js";
import { setupRenameItemFeature } from "./features/renameItemUI.js";
import { setupDetailItemFeature } from "./features/detailItemUI.js";
import {
  handleSelectAllRows,
  handleSelectRow,
} from "./utils/selectionHandler.js";
import { handleDetailsOpen } from "./utils/handleDetailsOpen.js";
import { setupShareItemFeature } from "./features/shareItemUI.js";

document.addEventListener("DOMContentLoaded", () => {
  const tableHeaderCheckbox = document.getElementById("table-header-checkbox");

  tableHeaderCheckbox.addEventListener("click", handleSelectAllRows);

  const tableBody = document.querySelector("tbody");

  const rows = tableBody.querySelectorAll("tr");
  rows.forEach((row) => {
    row.addEventListener("click", (e) => handleSelectRow(e, row));
  });

  const itemNames = document.querySelectorAll(".item-name");
  const detailsModal = document.querySelector("#details-item-dialog");

  itemNames.forEach((item) => {
    item.addEventListener("click", (e) => {
      const item = e.target.closest("tr");

      if (item.dataset.type === "folder") return;

      handleDetailsOpen(item);
      detailsModal.showModal();
    });
  });

  setupDeleteItemFeature();
  setupRenameItemFeature();
  setupDetailItemFeature();
  setupShareItemFeature();
});
