-- CreateIndex
CREATE INDEX `InstallationEquipement_idEquipement_idInstallation_idx` ON `InstallationEquipement`(`idEquipement`, `idInstallation`);

-- CreateIndex
CREATE INDEX `InstallationEquipement_statut_idx` ON `InstallationEquipement`(`statut`);

-- CreateIndex
CREATE INDEX `InstallationExtincteur_idInstallationEquipement_DateDerniere_idx` ON `InstallationExtincteur`(`idInstallationEquipement`, `DateDerniereVerification`);

-- CreateIndex
CREATE INDEX `Intervention_idTechnicien_statut_datePlanifiee_idx` ON `Intervention`(`idTechnicien`, `statut`, `datePlanifiee`);

-- CreateIndex
CREATE INDEX `Intervention_idClient_dateDeclaration_idx` ON `Intervention`(`idClient`, `dateDeclaration`);

-- CreateIndex
CREATE INDEX `Intervention_idSysteme_statut_idx` ON `Intervention`(`idSysteme`, `statut`);

-- CreateIndex
CREATE INDEX `Intervention_urgent_statut_idx` ON `Intervention`(`urgent`, `statut`);

-- CreateIndex
CREATE INDEX `Maintenance_idTechnicien_statut_datePlanifiee_idx` ON `Maintenance`(`idTechnicien`, `statut`, `datePlanifiee`);

-- CreateIndex
CREATE INDEX `Maintenance_idInstallation_dateMaintenance_idx` ON `Maintenance`(`idInstallation`, `dateMaintenance`);
