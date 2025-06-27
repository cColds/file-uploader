const cloudinary = require("cloudinary").v2;

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
    console.log(result);
    return result.secure_url;
  } catch (error) {
    console.error(error);
  }
};
