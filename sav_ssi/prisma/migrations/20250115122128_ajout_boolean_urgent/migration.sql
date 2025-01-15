-- AlterTable
ALTER TABLE `intervention` ADD COLUMN `Urgent` BOOLEAN NULL DEFAULT false,
    ADD COLUMN `sousGarantie` BOOLEAN NULL DEFAULT true;
