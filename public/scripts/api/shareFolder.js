export const shareFolder = async (id, expires) => {
  const res = await fetch(`/my-files/share/${id}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ expires }),
  });

  const result = await res.json();

  return result;
};
