/*
  Warnings:

  - Added the required column `idInstallation` to the `Maintenance` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `maintenance` ADD COLUMN `idInstallation` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Maintenance` ADD CONSTRAINT `Maintenance_idInstallation_fkey` FOREIGN KEY (`idInstallation`) REFERENCES `Installation`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
