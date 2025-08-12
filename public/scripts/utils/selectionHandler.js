const tableCommandbar = document.querySelector(".table-commandbar");
const shareBtn = document.querySelector("#share-item-modal-btn");
const detailsBtn = document.querySelector("#details-item-modal-btn");

export const syncHeaderCheckboxAndCommandBar = () => {
  const selectedRows = document.querySelectorAll("tbody tr.selected");
  const allRows = document.querySelectorAll("tbody tr");
  const allSelected = selectedRows.length === allRows.length;
  const hasSelected = selectedRows.length > 0;

  const tableHeaderCheckbox = document.getElementById("table-header-checkbox");
  tableHeaderCheckbox.checked = allSelected;
  tableCommandbar.classList.toggle("active", hasSelected);

  const renameModalBtn = document.querySelector("#rename-item-modal-btn");

  if (renameModalBtn)
    renameModalBtn.classList.toggle("hide", selectedRows.length > 1);
};

export const handleSelectRow = (e, row) => {
  if (e.target.tagName === "A") return;

  const fileSelectedAlready =
    (e.target.classList.contains("file-extension") ||
      e.target.classList.contains("file-name")) &&
    e.target.closest("tr").classList.contains("selected");

  if (fileSelectedAlready) return;

  const checkbox = row.querySelector("input[type='checkbox']");
  const clickedCheckbox = e.target.matches("input[type='checkbox']");
  if (!clickedCheckbox) {
    const selectedRows = document.querySelectorAll(".selected");
    selectedRows.forEach((row) => {
      const checkbox = row.querySelector(".table-checkbox");
      row.classList.toggle("selected", false);
      checkbox.checked = false;
    });
    checkbox.checked = true;
  }
  const isRootFolder = window.location.href.split("/").at(-1) === "my-files";

  row.classList.toggle("selected", checkbox.checked);

  const updatedSelectedRows = document.querySelectorAll(".selected");
  if (shareBtn) {
    shareBtn.classList.toggle(
      "hide",
      isRootFolder ? true : updatedSelectedRows.length
    );
  }
  detailsBtn.classList.toggle("hide", updatedSelectedRows.length > 1);

  syncHeaderCheckboxAndCommandBar();
};

export const handleSelectAllRows = (e) => {
  const selectAll = e.target.checked;
  const rows = document.querySelectorAll("tbody tr");
  rows.forEach((row) => {
    const checkbox = row.querySelector("input[type='checkbox']");
    checkbox.checked = selectAll;
    row.classList.toggle("selected", selectAll);
  });

  const isRootFolder = window.location.href.split("/").at(-1) === "my-files";

  tableCommandbar.classList.toggle("active", selectAll);
  detailsBtn.classList.toggle("hide", selectAll);

  if (shareBtn)
    shareBtn.classList.toggle("hide", isRootFolder ? true : selectAll);
};
