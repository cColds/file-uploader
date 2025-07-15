document.addEventListener("DOMContentLoaded", () => {
  // table header checkbox should select all folders/files

  const tableHeaderCheckbox = document.getElementById("table-header-checkbox");

  tableHeaderCheckbox.addEventListener("click", (e) => {
    const selectAll = e.target.checked;

    document.querySelectorAll("tbody tr").forEach((row) => {
      const checkbox = row.querySelector("input[type='checkbox']");
      checkbox.checked = selectAll;
      row.classList.toggle("selected", selectAll);
    });
  });

  const tableBody = document.querySelector("tbody");

  tableBody.querySelectorAll("tr").forEach((row) => {
    row.addEventListener("click", (e) => {
      row.classList.toggle("selected");
      if (e.target.matches('input[type="checkbox"]')) return;
      const checkbox = row.querySelector("input[type='checkbox']");

      checkbox.checked = !checkbox.checked;
    });
  });

  // loop through files/folders rows and select checkbox on click
  // display command bar with crud options
});
