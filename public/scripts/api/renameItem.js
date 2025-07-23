export const renameItem = async ({ id, type, updatedName }) => {
  const res = await fetch(`/my-files/rename/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id, type, updatedName }),
  });

  const result = await res.json();

  return result;
};
