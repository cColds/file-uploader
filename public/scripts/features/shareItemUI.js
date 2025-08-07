import { shareFolder } from "../api/shareFolder.js";
import { setDurationButtonsDisabled } from "../utils/setDurationButtonsDisabled.js";

export const setupShareItemFeature = () => {
  const shareItemModalBtn = document.querySelector("#share-item-modal-btn");
  const shareItemModal = document.querySelector("#share-item-dialog");

  const shareItemForm = document.querySelector("#share-form");
  const shareItemCloseModalBtn = document.querySelector(
    "#close-share-modal-btn"
  );
  const shareItemCancelModalBtn = document.querySelector(
    "#share-item-cancel-btn"
  );
  const shareItemCopyLinkBtn = document.querySelector(".copy-link-btn");
  const shareLinkInput = document.querySelector("#share-link-field");
  const generateLinkBtn = document.querySelector(".generate-link-btn");
  const copyLinkBtn = document.querySelector(".copy-link-btn");

  shareItemForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const expires = document.querySelector(
      "input[name=duration]:checked"
    ).value;

    const url = window.location.href;
    const folderId = url.split("/").at(-1);

    if (isNaN(parseInt(folderId))) {
      // unless u wanna share root folder
      console.log("havent supported sharing root folders");
      return;
    }

    const res = await shareFolder(folderId, expires);
    if (!res.success) {
      console.error("Failed to generate folder link");
      return;
    }

    setDurationButtonsDisabled(true);
    shareLinkInput.value = res.token; // todo: include the url localhost:3000/share/token (maybe thru prisma)
    shareLinkInput.classList.remove("hidden");

    generateLinkBtn.classList.add("hidden");
    copyLinkBtn.classList.remove("hidden");
  });

  shareItemCopyLinkBtn.addEventListener("click", (e) => {
    navigator.clipboard.writeText(shareLinkInput.value);
    shareItemCopyLinkBtn.textContent = "Copied!";

    setTimeout(() => {
      shareItemCopyLinkBtn.textContent = "Copy Link";
    }, 2000);
  });

  shareItemModalBtn.addEventListener("click", () => {
    shareLinkInput.classList.add("hidden");
    shareLinkInput.value = "";
    generateLinkBtn.classList.remove("hidden");
    copyLinkBtn.classList.add("hidden");
    setDurationButtonsDisabled(false);

    shareItemModal.showModal();
  });

  shareItemCloseModalBtn.addEventListener("click", () => {
    shareItemModal.close();
  });

  shareItemCancelModalBtn.addEventListener("click", () => {
    shareItemModal.close();
  });
};
