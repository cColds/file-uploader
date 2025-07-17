export const deleteItems = async ({ folderIds = [], fileIds = [] }) => {
  const res = await fetch(`/my-files/delete/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ folderIds, fileIds }),
  });

  const result = await res.json();

  console.log("result", result);
  return result;
};
