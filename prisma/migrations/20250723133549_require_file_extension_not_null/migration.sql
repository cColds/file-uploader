/*
  Warnings:

  - Made the column `extension` on table `File` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "File" ALTER COLUMN "extension" SET NOT NULL;
