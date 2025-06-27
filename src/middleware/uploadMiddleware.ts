import multer from "multer";
import { Request, Response, NextFunction } from "express";
import { uploadFileToCloudinary } from "@/config/cloudinaryConfig";

export function uploadFile(fieldName: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    const upload = multer({
      storage: multer.diskStorage({
        destination: (req, file, cb) => {
          cb(null, "uploads/");
        },
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + "-" + Math.round(Math.random() * 1e9);
          const ext = file.originalname.substring(
            file.originalname.lastIndexOf(".")
          );
          cb(null, file.fieldname + "-" + uniqueSuffix + ext);
        },
      }),
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB
        files: 1,
      },
      fileFilter: (req, file, cb) => {
        const allowedTypes = [
          "image/jpeg",
          "image/png",
          "application/pdf",
          "text/plain",
        ];
        if (allowedTypes.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(new Error("Invalid file type"));
        }
      },
    }).single(fieldName);

    upload(req, res, (err: any) => {
      if (err) {
        if (err instanceof multer.MulterError) {
          console.log("error msg", err.message);
          if (err.code === "LIMIT_FILE_SIZE") {
            return res.status(400).json({ error: "File too large (max 10MB)" });
          }
          return res.status(400).json({ error: err.message });
        } else if (err) {
          return res.status(400).json({ error: err.message });
        }
      }
      try {
        if (!req.file) throw new Error();

        uploadFileToCloudinary(req.file);
      } catch (err) {
        return res.json({ error: "Failed to upload file to cloudinary" });
      }

      next();
    });
  };
}
