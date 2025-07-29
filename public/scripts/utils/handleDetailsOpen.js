export const handleDetailsOpen = () => {
  const detailsModal = document.querySelector("#details-item-dialog");

  const modalHeading = document.querySelector(".modal-heading-details");

  const nameDetail = document.querySelector(".detail-name");
  const typeDetail = document.querySelector(".detail-type");
  const sizeDetail = document.querySelector(".detail-size");
  const createdDetail = document.querySelector(".detail-created");
  const downloadBtn = document.querySelector(".download-btn");

  const selectedItem = document.querySelector(".selected");
  const isFolder = selectedItem.dataset.type === "folder";

  detailsModal.style.height = isFolder ? "300px" : "375px";
  modalHeading.textContent = isFolder ? "Folder Details" : "File Details";
  downloadBtn.classList.toggle("hide", isFolder);

  const itemName = selectedItem.querySelector(".item-name").textContent;
  const itemType =
    selectedItem.querySelector(".file-extension")?.textContent.toUpperCase() +
    " File";
  const itemCreated = selectedItem.querySelector(".created-at");
  const itemSize = selectedItem.querySelector(".item-size");

  nameDetail.textContent = itemName;
  createdDetail.textContent = itemCreated.textContent;
  sizeDetail.textContent = itemSize.textContent;

  typeDetail.textContent = isFolder ? "Folder" : itemType;
};
