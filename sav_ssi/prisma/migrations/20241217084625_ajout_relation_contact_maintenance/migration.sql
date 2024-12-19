/*
  Warnings:

  - Added the required column `idContact` to the `Maintenance` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `maintenance` ADD COLUMN `idContact` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Maintenance` ADD CONSTRAINT `Maintenance_idContact_fkey` FOREIGN KEY (`idContact`) REFERENCES `Contact`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
