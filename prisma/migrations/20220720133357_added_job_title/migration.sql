/*
  Warnings:

  - You are about to drop the `Category` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Product` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_categoryId_fkey";

-- DropTable
DROP TABLE "Category";

-- DropTable
DROP TABLE "Product";

-- CreateTable
CREATE TABLE "Log" (
    "id" SERIAL NOT NULL,
    "size" INTEGER NOT NULL DEFAULT 0,
    "rowSize" INTEGER NOT NULL DEFAULT 0,
    "dbName" TEXT NOT NULL,
    "sqlFeatures" TEXT[],
    "sqlLanguages" TEXT[],
    "applicapleRoles" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Log_pkey" PRIMARY KEY ("id")
);
