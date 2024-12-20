/*
  Warnings:

  - You are about to drop the column `idSite` on the `maintenance` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `maintenance` DROP FOREIGN KEY `Maintenance_idSite_fkey`;

-- AlterTable
ALTER TABLE `maintenance` DROP COLUMN `idSite`;
