import { createFolder } from "./api/createFolder.js";
import { uploadFile } from "./api/uploadFile.js";

document.addEventListener("DOMContentLoaded", () => {
  const newFolderModalBtn = document.querySelector("#new-folder");
  const folderDialog = document.querySelector("#folder-dialog");
  const closeFolderDialog = document.querySelector("#close-folder-modal-btn");
  const folderForm = document.querySelector("#folder-form");
  const folderInput = document.querySelector("#folder-input");
  const folderErrorMessage = document.querySelector("#folder-error-message");

  const getFolderIdFromUrl = () => {
    const url = new URL(window.location.href);
    const segments = url.pathname.split("/").filter(Boolean);

    const folderId = segments.pop();
    return !segments.includes("my-files") || isNaN(Number(folderId))
      ? null
      : folderId;
  };

  folderForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const folderId = getFolderIdFromUrl();
    const { ok, result } = await createFolder(folderInput.value, folderId);
    if (ok) {
      folderDialog.close();
      folderErrorMessage.classList.add("hidden");
      folderForm.reset();
      window.location.reload();
    } else {
      folderErrorMessage.classList.remove("hidden");
      folderErrorMessage.textContent = result.error;
    }
  });

  newFolderModalBtn?.addEventListener("click", () => {
    folderDialog.showModal();
    folderForm.reset();
    folderErrorMessage.classList.add("hidden");
  });

  closeFolderDialog.addEventListener("click", () => {
    folderDialog.close();
  });

  // File Modal

  const newFileModalBtn = document.querySelector("#new-file");
  const fileDialog = document.querySelector("#file-dialog");
  const closeFileDialog = document.querySelector("#close-file-modal-btn");
  const fileForm = document.querySelector("#file-form");
  const fileInput = document.querySelector("#file-input");
  const fileErrorMessage = document.querySelector("#file-error-message");

  fileForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const { ok, result } = await uploadFile(fileInput);
    if (ok) {
      fileDialog.close();
      fileErrorMessage.classList.add("hidden");
      fileForm.reset();
      window.location.reload();
    } else {
      fileErrorMessage.classList.remove("hidden");
      fileErrorMessage.textContent = result.error;
    }
  });

  newFileModalBtn?.addEventListener("click", (e) => {
    fileDialog.showModal();
    fileErrorMessage.classList.add("hidden");
    fileForm.reset();
  });
  closeFileDialog.addEventListener("click", (e) => {
    fileDialog.close();
  });
});
