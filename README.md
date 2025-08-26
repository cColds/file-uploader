# File Uploader

A stripped down cloud storage file and folder storage app. Built with Express, TypeScript, Cloudinary, Multer, PassportJS, Prisma, Postgres, and EJS. 
 

## [Live Demo](https://unlikely-joey-file-uploader-c129d943.koyeb.app/) 

## Features
- **User Auth and session**: PassportJS and Bcrypt for auth; Prisma-backed session store
- **File Uploads**: Upload files (10 MB cap) to Cloudinary and store url and metadata in Postgres
- **Folder management**: Create, rename, delete, view details, and store folders/files in a specific folder
- **File Management**: View, delete, rename, or download file.
- **Folder Sharing**: Generate a unique tokenized link in Postgres to share folder (and its contents)
