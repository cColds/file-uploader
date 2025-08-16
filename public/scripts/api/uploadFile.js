const uploadFileXhr = (url, file, onProgress) =>
  new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.upload.addEventListener("progress", (e) => {
      if (e.lengthComputable && e.total > 0) {
        onProgress(e.loaded / e.total);
      }
    });
    xhr.addEventListener("load", () => {
      resolve({ status: xhr.status, body: xhr.responseText });
    });
    xhr.addEventListener("error", () => {
      reject(new Error("File upload failed"));
    });
    xhr.addEventListener("abort", () =>
      reject(new Error("File upload aborted"))
    );

    const formData = new FormData();
    formData.append("file", file);

    xhr.open("POST", url, true);
    xhr.send(formData);
  });

export const uploadFile = async (fileInput, onProgress) => {
  try {
    const currentUrl = window.location.href;

    const url = new URL(currentUrl);
    const segments = url.pathname.split("/");
    const folderId = segments.pop();

    const isRootFolder =
      !segments.includes("my-files") || isNaN(Number(folderId));

    const endpoint = isRootFolder
      ? "/new-file"
      : `/new-file?folderId=${folderId}`;

    const res = await uploadFileXhr(endpoint, fileInput.files[0], onProgress);

    return JSON.parse(res.body);
  } catch (err) {
    console.log("Something went wrong", err);
  }
};
