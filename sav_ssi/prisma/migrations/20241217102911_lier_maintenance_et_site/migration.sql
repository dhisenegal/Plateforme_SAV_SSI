/*
  Warnings:

  - You are about to drop the column `idInstallation` on the `maintenance` table. All the data in the column will be lost.
  - Added the required column `idSite` to the `Maintenance` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `maintenance` DROP FOREIGN KEY `Maintenance_idInstallation_fkey`;

-- AlterTable
ALTER TABLE `maintenance` DROP COLUMN `idInstallation`,
    ADD COLUMN `idSite` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Maintenance` ADD CONSTRAINT `Maintenance_idSite_fkey` FOREIGN KEY (`idSite`) REFERENCES `Site`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
