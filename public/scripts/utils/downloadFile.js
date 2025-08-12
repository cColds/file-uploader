export const downloadFile = async () => {
  const selectedFile = document.querySelector(".selected").dataset;
  const fileId = selectedFile.id;
  const isShared = selectedFile.shared === "true";
  const token = selectedFile.token;

  const endpoint = isShared
    ? `/share/${token}/${fileId}/download`
    : `/my-files/file/${fileId}`;
  const res = await fetch(endpoint);
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
