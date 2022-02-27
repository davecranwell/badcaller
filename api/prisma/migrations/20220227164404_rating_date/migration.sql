/*
  Warnings:

  - Added the required column `createdDate` to the `Rating` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Rating" ADD COLUMN     "createdDate" TIMESTAMP(3) NOT NULL;
