import { setupDeleteItemFeature } from "./features/deleteItemUI.js";
import { setupRenameItemFeature } from "./features/renameItemUI.js";
import {
  handleSelectAllRows,
  handleSelectRow,
} from "./utils/selectionHandler.js";

document.addEventListener("DOMContentLoaded", () => {
  const tableHeaderCheckbox = document.getElementById("table-header-checkbox");

  tableHeaderCheckbox.addEventListener("click", handleSelectAllRows);

  const tableBody = document.querySelector("tbody");

  const rows = tableBody.querySelectorAll("tr");
  rows.forEach((row) => {
    row.addEventListener("click", (e) => handleSelectRow(e, row));
  });

  setupDeleteItemFeature();
  setupRenameItemFeature();
});
