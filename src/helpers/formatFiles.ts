import { format } from "date-fns";
import { formatHumanFileSize } from "./formatHumanFileSize";
import { File } from "@prisma/client";

export const formatFiles = (files: File[]) => {
  const formattedFiles = files.map((file) => ({
    ...file,
    createdAt: format(new Date(), "MMM d, yyyy"),
    size: formatHumanFileSize(Number(file.size)),
  }));

  return formattedFiles;
};
