/*
  Warnings:

  - You are about to alter the column `price` on the `transaction_details` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.

*/
-- AlterTable
ALTER TABLE "transaction_details" ALTER COLUMN "price" SET DATA TYPE INTEGER;
