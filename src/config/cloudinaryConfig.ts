import { v2 as cloudinary, UploadApiOptions } from "cloudinary";

// cloudinary api and cloud name is inferred from .env
cloudinary.config({
  secure: true,
});

export const uploadFileToCloudinary = async (file: Express.Multer.File) => {
  const options: UploadApiOptions = {
    use_filename: true,
    unique_filename: false,
    overwrite: true,
    folder: "file-uploader",
    resource_type: "raw",
  };

  try {
    const result = await cloudinary.uploader.upload(file.path, options);
    return result;
  } catch (error) {
    console.error(error);
  }
};

export const getCloudinaryFile = async (publicId: string) => {
  try {
    const res = await cloudinary.api.resource(publicId, {
      resource_type: "raw",
      type: "upload",
    });

    return res;
  } catch (err) {
    console.error(err);
    return null;
  }
};

export const parseCloudinaryUrl = (url: string) => {
  // example url
  // url: 'https://res.cloudinary.com/dr2ufkyd4/raw/upload/
  // v1755352919/file-uploader/file-1755352917582-163320317.png'
  // should return the publicId & ext name (at the end), resource_type and type (upload)
  const { pathname } = new URL(url);

  // ['dr2ufkyd4', 'raw', 'upload', 'v1755352919', 'file-uploader', 'file-1755352917582-163320317.png']
  // cloud name, resource_type, type, v id, folder, filename
  const parts = pathname.replace(/^\/+/, "").split("/");
  const resource_type = parts[1];
  const type = parts[2];

  // assuming type is raw, it includes file ext automatically
  const public_id = parts.slice(4).join("/");

  return { resource_type, type, public_id };
};

export const deleteFilesCloudinary = async (publicIds: string[]) => {
  try {
    const res = await cloudinary.api.delete_resources(publicIds, {
      resource_type: "raw",
      type: "upload",
      invalidate: true,
    });

    return res;
  } catch (err) {
    console.error("Try Catch Error:", err);
  }
};
