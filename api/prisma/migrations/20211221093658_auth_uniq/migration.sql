/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `Auth` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `Auth` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `Auth` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Auth" ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "password" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Auth_email_unique_constraint" ON "Auth"("email");
