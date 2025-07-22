export const renameItem = async ({ folderId, fileId, updatedName }) => {
  const res = await fetch(`/my-files/rename/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ folderId, fileId, updatedName }),
  });

  const result = await res.json();

  return result;
};
