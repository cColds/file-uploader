export const deleteItem = async (id, type) => {
  const res = await fetch(`/my-files/delete/${id}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ type }),
  });

  const result = await res.json();

  console.log("result", result);
  return result;
};
