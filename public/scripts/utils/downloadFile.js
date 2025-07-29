export const downloadFile = async () => {
  const id = document.querySelector(".selected").dataset.id;
  const res = await fetch(`/my-files/file/${id}`, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  const result = await res.json();

  const fileRes = await fetch(result.file.url);
  const blob = await fileRes.blob();

  const a = document.createElement("a");
  a.href = window.URL.createObjectURL(blob);
  a.download = result.file.name;
  document.body.appendChild(a);
  a.click();
  a.remove();
};
