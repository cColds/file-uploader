import { downloadFile } from "../utils/downloadFile.js";
import { handleDetailsOpen } from "../utils/handleDetailsOpen.js";

export const setupDetailItemFeature = () => {
  const detailsModalBtn = document.querySelector("#details-item-modal-btn");
  const detailsModal = document.querySelector("#details-item-dialog");

  const closeModalBtn = document.querySelector("#close-details-modal-btn");

  const downloadBtn = document.querySelector(".download-btn");

  detailsModalBtn.addEventListener("click", (e) => {
    detailsModal.showModal();
    handleDetailsOpen();
  });

  closeModalBtn.addEventListener("click", () => {
    detailsModal.close();
  });

  downloadBtn?.addEventListener("click", downloadFile);
};
