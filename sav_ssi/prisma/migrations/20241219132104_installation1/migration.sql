/*
  Warnings:

  - You are about to drop the column `idContact` on the `maintenance` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `maintenance` DROP FOREIGN KEY `Maintenance_idContact_fkey`;

-- AlterTable
ALTER TABLE `maintenance` DROP COLUMN `idContact`;
