import { v2 as cloudinary } from "cloudinary";

// cloudinary api and cloud name is inferred from .env
cloudinary.config({
  secure: true,
});

console.log(cloudinary.config());

export const uploadFileToCloudinary = async (file: Express.Multer.File) => {
  const options = {
    use_filename: true,
    unique_filename: false,
    overwrite: true,
    folder: "file-uploader",
  };

  try {
    const result = await cloudinary.uploader.upload(file.path, options);
    return result;
  } catch (error) {
    console.error(error);
  }
};
