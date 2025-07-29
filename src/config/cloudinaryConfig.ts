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
