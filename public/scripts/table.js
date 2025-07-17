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
});
