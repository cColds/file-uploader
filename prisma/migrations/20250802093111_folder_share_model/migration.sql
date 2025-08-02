-- CreateTable
CREATE TABLE "FolderShare" (
    "id" SERIAL NOT NULL,
    "folderId" INTEGER NOT NULL,
    "shareToken" TEXT NOT NULL,
    "expires" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "canEdit" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "FolderShare_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FolderShare_shareToken_key" ON "FolderShare"("shareToken");

-- AddForeignKey
ALTER TABLE "FolderShare" ADD CONSTRAINT "FolderShare_folderId_fkey" FOREIGN KEY ("folderId") REFERENCES "Folder"("id") ON DELETE CASCADE ON UPDATE CASCADE;
