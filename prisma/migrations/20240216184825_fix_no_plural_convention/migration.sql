/*
  Warnings:

  - You are about to drop the `FxRates` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "FxRates";

-- CreateTable
CREATE TABLE "FxRate" (
    "id" SERIAL NOT NULL,
    "sourceCurrency" TEXT NOT NULL,
    "targetCurrency" TEXT NOT NULL,
    "exchangeRate" DOUBLE PRECISION NOT NULL,
    "validFrom" TIMESTAMP(3) NOT NULL,
    "validTo" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FxRate_pkey" PRIMARY KEY ("id")
);
