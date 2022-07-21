/*
  Warnings:

  - You are about to drop the column `sqlLanguages` on the `Log` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Log" DROP COLUMN "sqlLanguages",
ADD COLUMN     "sqlSizing" TEXT;
