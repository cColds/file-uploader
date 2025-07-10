export const createFolder = async (folderName, folderId) => {
  try {
    const endpoint =
      folderId == null ? "/new-folder" : `/new-folder?folderId=${folderId}`;

    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ folderName }),
    });
    const result = await res.json();

    return { ok: res.ok, result };
  } catch (err) {
    console.log("Something went wrong", err);
  }
};
