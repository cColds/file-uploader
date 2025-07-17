const tableCommandbarWrapper = document.querySelector(
  ".table-commandbar-wrapper"
);

export const syncHeaderCheckboxAndCommandBar = () => {
  const selectedRows = document.querySelectorAll("tbody tr.selected");
  const allRows = document.querySelectorAll("tbody tr");
  const allSelected = selectedRows.length === allRows.length;
  const hasSelected = selectedRows.length > 0;

  const tableHeaderCheckbox = document.getElementById("table-header-checkbox");
  tableHeaderCheckbox.checked = allSelected;
  tableCommandbarWrapper.classList.toggle("active", hasSelected);
};

export const handleSelectRow = (e, row) => {
  const checkbox = row.querySelector("input[type='checkbox']");
  const clickedCheckbox = e.target.matches("input[type='checkbox']");
  if (!clickedCheckbox) {
    checkbox.checked = !checkbox.checked;
  }

  row.classList.toggle("selected", checkbox.checked);

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

  tableCommandbarWrapper.classList.toggle("active", selectAll);
};
