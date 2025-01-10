-- AlterTable
ALTER TABLE `intervention` ADD COLUMN `commentaire` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `maintenance` MODIFY `typeMaintenance` VARCHAR(191) NULL;
