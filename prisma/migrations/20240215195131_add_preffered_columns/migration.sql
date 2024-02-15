-- AlterTable
ALTER TABLE "User" ADD COLUMN     "prefferedCurrency" TEXT NOT NULL DEFAULT 'EUR',
ADD COLUMN     "prefferedPeriod" TEXT NOT NULL DEFAULT 'monthly';
