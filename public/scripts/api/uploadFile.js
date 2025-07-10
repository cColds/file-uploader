export const uploadFile = async (fileInput) => {
  try {
    const formData = new FormData();
    formData.append("file", fileInput.files[0]);

    const currentUrl = window.location.href;

    const url = new URL(currentUrl);
    const segments = url.pathname.split("/");
    const folderId = segments.pop();

    const isRootFolder =
      !segments.includes("my-files") || isNaN(Number(folderId));

    const endpoint = isRootFolder
      ? "/new-file"
      : `/new-file?folderId=${folderId}`;

    const res = await fetch(endpoint, {
      method: "POST",
      body: formData,
    });
    const result = await res.json();

    return { ok: res.ok, result };
  } catch (err) {
    console.log("Something went wrong", err);
  }
};
