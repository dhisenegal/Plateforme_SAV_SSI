-- DropForeignKey
ALTER TABLE `installation` DROP FOREIGN KEY `Installation_idClient_fkey`;

-- DropForeignKey
ALTER TABLE `installation` DROP FOREIGN KEY `Installation_idSite_fkey`;

-- DropForeignKey
ALTER TABLE `installation` DROP FOREIGN KEY `Installation_idSysteme_fkey`;

-- DropForeignKey
ALTER TABLE `installationequipement` DROP FOREIGN KEY `InstallationEquipement_idEquipement_fkey`;

-- DropForeignKey
ALTER TABLE `installationequipement` DROP FOREIGN KEY `InstallationEquipement_idInstallation_fkey`;

-- AddForeignKey
ALTER TABLE `Installation` ADD CONSTRAINT `Installation_idClient_fkey` FOREIGN KEY (`idClient`) REFERENCES `Client`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Installation` ADD CONSTRAINT `Installation_idSysteme_fkey` FOREIGN KEY (`idSysteme`) REFERENCES `Systeme`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Installation` ADD CONSTRAINT `Installation_idSite_fkey` FOREIGN KEY (`idSite`) REFERENCES `Site`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InstallationEquipement` ADD CONSTRAINT `InstallationEquipement_idEquipement_fkey` FOREIGN KEY (`idEquipement`) REFERENCES `Equipement`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InstallationEquipement` ADD CONSTRAINT `InstallationEquipement_idInstallation_fkey` FOREIGN KEY (`idInstallation`) REFERENCES `Installation`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
