export const handleDetailsOpen = (item) => {
  const detailsModal = document.querySelector("#details-item-dialog");

  const modalHeading = document.querySelector(".modal-heading-details");

  const nameDetail = document.querySelector(".detail-name");
  const typeDetail = document.querySelector(".detail-type");
  const sizeDetail = document.querySelector(".detail-size");
  const createdDetail = document.querySelector(".detail-created");
  const downloadBtn = document.querySelector(".download-btn");

  console.log("test", item);
  const isFolder = item.dataset.type === "folder";

  detailsModal.style.height = isFolder ? "300px" : "375px";
  modalHeading.textContent = isFolder ? "Folder Details" : "File Details";
  downloadBtn.classList.toggle("hide", isFolder);

  const itemName = item.querySelector(".item-name").textContent;
  const itemType =
    item.querySelector(".file-extension")?.textContent.toUpperCase() + " File";
  const itemCreated = item.querySelector(".created-at");
  const itemSize = item.querySelector(".item-size");

  nameDetail.textContent = itemName;
  createdDetail.textContent = itemCreated.textContent;
  sizeDetail.textContent = itemSize.textContent;

  typeDetail.textContent = isFolder ? "Folder" : itemType;
};
