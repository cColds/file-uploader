import multer from "multer";
import { Request, Response, NextFunction } from "express";
import path from "path";
import fs from "node:fs";

const TEMP_DIR =
  process.env.UPLOAD_DIR || process.env.KOYEB
    ? "/tmp/uploads"
    : path.resolve(process.cwd(), "tmp", "uploads");

export function uploadFile(fieldName: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    const upload = multer({
      storage: multer.diskStorage({
        destination: (req, file, cb) => {
          // Ensure the directory exists
          try {
            fs.mkdirSync(TEMP_DIR, { recursive: true });
          } catch (err) {
            console.log(err);
          }
          cb(null, TEMP_DIR);
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
        const blockedTypes = [
          "application/x-msdownload", // .exe
          "application/x-sh", // shell scripts
          "application/x-php", // PHP files
          "application/x-msdos-program",
        ];

        if (blockedTypes.includes(file.mimetype)) {
          cb(new Error("This file type is not allowed"));
        } else {
          cb(null, true);
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

      next();
    });
  };
}

// todo: either manually create upload folder so no error thrown in prod
// or use memoryStorage
