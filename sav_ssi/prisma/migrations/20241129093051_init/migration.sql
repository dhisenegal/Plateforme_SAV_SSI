-- DropIndex
DROP INDEX `Account_userId_fkey` ON `account`;

-- DropIndex
DROP INDEX `ActionMaintenance_idSysteme_fkey` ON `actionmaintenance`;

-- DropIndex
DROP INDEX `Contact_idClient_fkey` ON `contact`;

-- DropIndex
DROP INDEX `Contact_idUtilisateur_fkey` ON `contact`;

-- DropIndex
DROP INDEX `ContactSite_idContact_fkey` ON `contactsite`;

-- DropIndex
DROP INDEX `ContactSite_idSite_fkey` ON `contactsite`;

-- DropIndex
DROP INDEX `Contrat_idInstallationEq_fkey` ON `contrat`;

-- DropIndex
DROP INDEX `DemandeIntervention_idClient_fkey` ON `demandeintervention`;

-- DropIndex
DROP INDEX `DemandeIntervention_idContact_fkey` ON `demandeintervention`;

-- DropIndex
DROP INDEX `DemandeIntervention_idInstallation_fkey` ON `demandeintervention`;

-- DropIndex
DROP INDEX `DemandeIntervention_idSite_fkey` ON `demandeintervention`;

-- DropIndex
DROP INDEX `Equipement_idMarqueSsi_fkey` ON `equipement`;

-- DropIndex
DROP INDEX `Equipement_idModeleSsi_fkey` ON `equipement`;

-- DropIndex
DROP INDEX `Equipement_idSysteme_fkey` ON `equipement`;

-- DropIndex
DROP INDEX `Garantie_idInstallationEq_fkey` ON `garantie`;

-- DropIndex
DROP INDEX `Installation_idClient_fkey` ON `installation`;

-- DropIndex
DROP INDEX `Installation_idSite_fkey` ON `installation`;

-- DropIndex
DROP INDEX `Installation_idSysteme_fkey` ON `installation`;

-- DropIndex
DROP INDEX `InstallationEquipement_idEquipement_fkey` ON `installationequipement`;

-- DropIndex
DROP INDEX `InstallationEquipement_idInstallation_fkey` ON `installationequipement`;

-- DropIndex
DROP INDEX `Intervention_idContact_fkey` ON `intervention`;

-- DropIndex
DROP INDEX `Intervention_idDemandeIntervention_fkey` ON `intervention`;

-- DropIndex
DROP INDEX `Intervention_idTechnicien_fkey` ON `intervention`;

-- DropIndex
DROP INDEX `Maintenance_idInstallation_fkey` ON `maintenance`;

-- DropIndex
DROP INDEX `Maintenance_idTechnicien_fkey` ON `maintenance`;

-- DropIndex
DROP INDEX `MaintenanceAction_idAction_fkey` ON `maintenanceaction`;

-- DropIndex
DROP INDEX `MaintenanceAction_idMaintenance_fkey` ON `maintenanceaction`;

-- DropIndex
DROP INDEX `Session_userId_fkey` ON `session`;

-- DropIndex
DROP INDEX `Site_idClient_fkey` ON `site`;

-- DropIndex
DROP INDEX `Utilisateur_idRole_fkey` ON `utilisateur`;

-- AddForeignKey
ALTER TABLE `Utilisateur` ADD CONSTRAINT `Utilisateur_idRole_fkey` FOREIGN KEY (`idRole`) REFERENCES `Role`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Account` ADD CONSTRAINT `Account_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `Utilisateur`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Session` ADD CONSTRAINT `Session_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `Utilisateur`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Site` ADD CONSTRAINT `Site_idClient_fkey` FOREIGN KEY (`idClient`) REFERENCES `Client`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Contact` ADD CONSTRAINT `Contact_idClient_fkey` FOREIGN KEY (`idClient`) REFERENCES `Client`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Contact` ADD CONSTRAINT `Contact_idUtilisateur_fkey` FOREIGN KEY (`idUtilisateur`) REFERENCES `Utilisateur`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ContactSite` ADD CONSTRAINT `ContactSite_idSite_fkey` FOREIGN KEY (`idSite`) REFERENCES `Site`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ContactSite` ADD CONSTRAINT `ContactSite_idContact_fkey` FOREIGN KEY (`idContact`) REFERENCES `Contact`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Equipement` ADD CONSTRAINT `Equipement_idMarqueSsi_fkey` FOREIGN KEY (`idMarqueSsi`) REFERENCES `MarqueSsi`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Equipement` ADD CONSTRAINT `Equipement_idModeleSsi_fkey` FOREIGN KEY (`idModeleSsi`) REFERENCES `ModeleSsi`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Equipement` ADD CONSTRAINT `Equipement_idSysteme_fkey` FOREIGN KEY (`idSysteme`) REFERENCES `Systeme`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Installation` ADD CONSTRAINT `Installation_idClient_fkey` FOREIGN KEY (`idClient`) REFERENCES `Client`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Installation` ADD CONSTRAINT `Installation_idSysteme_fkey` FOREIGN KEY (`idSysteme`) REFERENCES `Systeme`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Installation` ADD CONSTRAINT `Installation_idSite_fkey` FOREIGN KEY (`idSite`) REFERENCES `Site`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InstallationEquipement` ADD CONSTRAINT `InstallationEquipement_idEquipement_fkey` FOREIGN KEY (`idEquipement`) REFERENCES `Equipement`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InstallationEquipement` ADD CONSTRAINT `InstallationEquipement_idInstallation_fkey` FOREIGN KEY (`idInstallation`) REFERENCES `Installation`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Contrat` ADD CONSTRAINT `Contrat_idInstallationEq_fkey` FOREIGN KEY (`idInstallationEq`) REFERENCES `InstallationEquipement`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Garantie` ADD CONSTRAINT `Garantie_idInstallationEq_fkey` FOREIGN KEY (`idInstallationEq`) REFERENCES `InstallationEquipement`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Maintenance` ADD CONSTRAINT `Maintenance_idInstallation_fkey` FOREIGN KEY (`idInstallation`) REFERENCES `Installation`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Maintenance` ADD CONSTRAINT `Maintenance_idTechnicien_fkey` FOREIGN KEY (`idTechnicien`) REFERENCES `Utilisateur`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ActionMaintenance` ADD CONSTRAINT `ActionMaintenance_idSysteme_fkey` FOREIGN KEY (`idSysteme`) REFERENCES `Systeme`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MaintenanceAction` ADD CONSTRAINT `MaintenanceAction_idMaintenance_fkey` FOREIGN KEY (`idMaintenance`) REFERENCES `Maintenance`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MaintenanceAction` ADD CONSTRAINT `MaintenanceAction_idAction_fkey` FOREIGN KEY (`idAction`) REFERENCES `ActionMaintenance`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DemandeIntervention` ADD CONSTRAINT `DemandeIntervention_idInstallation_fkey` FOREIGN KEY (`idInstallation`) REFERENCES `Installation`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DemandeIntervention` ADD CONSTRAINT `DemandeIntervention_idClient_fkey` FOREIGN KEY (`idClient`) REFERENCES `Client`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DemandeIntervention` ADD CONSTRAINT `DemandeIntervention_idSite_fkey` FOREIGN KEY (`idSite`) REFERENCES `Site`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DemandeIntervention` ADD CONSTRAINT `DemandeIntervention_idContact_fkey` FOREIGN KEY (`idContact`) REFERENCES `Contact`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Intervention` ADD CONSTRAINT `Intervention_idTechnicien_fkey` FOREIGN KEY (`idTechnicien`) REFERENCES `Utilisateur`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Intervention` ADD CONSTRAINT `Intervention_idContact_fkey` FOREIGN KEY (`idContact`) REFERENCES `Contact`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Intervention` ADD CONSTRAINT `Intervention_idDemandeIntervention_fkey` FOREIGN KEY (`idDemandeIntervention`) REFERENCES `DemandeIntervention`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
