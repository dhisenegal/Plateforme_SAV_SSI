/*
  Warnings:

  - Added the required column `idContact` to the `Maintenance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `idSite` to the `Maintenance` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `maintenance` ADD COLUMN `idContact` INTEGER NOT NULL,
    ADD COLUMN `idSite` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Maintenance` ADD CONSTRAINT `Maintenance_idSite_fkey` FOREIGN KEY (`idSite`) REFERENCES `Site`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Maintenance` ADD CONSTRAINT `Maintenance_idContact_fkey` FOREIGN KEY (`idContact`) REFERENCES `Contact`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
