-- AlterTable
ALTER TABLE "Log" ALTER COLUMN "size" DROP NOT NULL,
ALTER COLUMN "rowSize" DROP NOT NULL,
ALTER COLUMN "dbName" DROP NOT NULL,
ALTER COLUMN "sqlFeatures" DROP NOT NULL,
ALTER COLUMN "sqlFeatures" SET DATA TYPE TEXT,
ALTER COLUMN "sqlLanguages" DROP NOT NULL,
ALTER COLUMN "sqlLanguages" SET DATA TYPE TEXT,
ALTER COLUMN "applicapleRoles" DROP NOT NULL;
