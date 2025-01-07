-- CreateTable
CREATE TABLE `Utilisateur` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `login` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `nom` VARCHAR(191) NOT NULL,
    `prenom` VARCHAR(191) NOT NULL,
    `numero` VARCHAR(191) NOT NULL,
    `etatCompte` VARCHAR(191) NOT NULL DEFAULT 'actif',
    `email` VARCHAR(191) NOT NULL,
    `idRole` INTEGER NOT NULL,

    UNIQUE INDEX `Utilisateur_login_key`(`login`),
    UNIQUE INDEX `Utilisateur_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Role` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nom` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Session` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `token` VARCHAR(191) NOT NULL,
    `expires` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `VerificationToken` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `token` VARCHAR(191) NOT NULL,
    `expires` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Client` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nom` VARCHAR(191) NOT NULL,
    `secteurDactivite` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Site` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nom` VARCHAR(191) NOT NULL,
    `idClient` INTEGER NOT NULL,
    `adresse` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Contact` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `idClient` INTEGER NOT NULL,
    `idUtilisateur` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ContactSite` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `estManager` BOOLEAN NOT NULL,
    `idSite` INTEGER NOT NULL,
    `idContact` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Systeme` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nom` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Equipement` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nom` VARCHAR(191) NOT NULL,
    `idMarqueSsi` INTEGER NOT NULL,
    `idModeleSsi` INTEGER NOT NULL,
    `idSysteme` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MarqueSsi` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nom` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ModeleSsi` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nom` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Installation` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `dateInstallation` DATETIME(3) NOT NULL,
    `dateMaintenance` DATETIME(3) NULL,
    `observations` VARCHAR(191) NULL,
    `idClient` INTEGER NOT NULL,
    `idSysteme` INTEGER NOT NULL,
    `idSite` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `InstallationEquipement` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `statut` VARCHAR(191) NOT NULL,
    `dateInstallation` DATETIME(3) NOT NULL,
    `dateMaintenance` DATETIME(3) NULL,
    `idEquipement` INTEGER NOT NULL,
    `idInstallation` INTEGER NOT NULL,
    `quantite` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Contrat` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nom` VARCHAR(191) NOT NULL,
    `dateDebut` DATETIME(3) NOT NULL,
    `dateFin` DATETIME(3) NOT NULL,
    `periodicite` VARCHAR(191) NOT NULL,
    `typeContrat` VARCHAR(191) NOT NULL,
    `pieceMainDoeuvre` BOOLEAN NOT NULL DEFAULT false,
    `idSite` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Garantie` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `dateDebutGarantie` DATETIME(3) NOT NULL,
    `dateFinGarantie` DATETIME(3) NOT NULL,
    `idInstallationEq` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Maintenance` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `numero` VARCHAR(191) NOT NULL,
    `dateMaintenance` DATETIME(3) NULL,
    `description` VARCHAR(191) NOT NULL,
    `statut` ENUM('EN_COURS', 'SUSPENDU', 'TERMINE', 'NON_PLANIFIE', 'PLANIFIE') NOT NULL DEFAULT 'NON_PLANIFIE',
    `typeMaintenance` VARCHAR(191) NOT NULL,
    `datePlanifiee` DATETIME(3) NULL,
    `idTechnicien` INTEGER NOT NULL,
    `idSite` INTEGER NOT NULL,
    `idInstallation` INTEGER NOT NULL,
    `idContact` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ActionMaintenance` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `libeleAction` VARCHAR(191) NOT NULL,
    `idSysteme` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MaintenanceAction` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `statut` BOOLEAN NOT NULL,
    `observation` VARCHAR(191) NOT NULL,
    `idMaintenance` INTEGER NOT NULL,
    `idAction` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Intervention` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `statut` ENUM('EN_COURS', 'SUSPENDU', 'TERMINE', 'NON_PLANIFIE', 'PLANIFIE') NOT NULL DEFAULT 'NON_PLANIFIE',
    `typePanneDeclare` VARCHAR(191) NOT NULL,
    `dateDeclaration` DATETIME(3) NOT NULL,
    `idClient` INTEGER NULL,
    `idSite` INTEGER NULL,
    `idSysteme` INTEGER NULL,
    `diagnostics` VARCHAR(191) NULL,
    `travauxRealises` VARCHAR(191) NULL,
    `pieceFournies` VARCHAR(191) NULL,
    `datePlanifiee` DATETIME(3) NULL,
    `dateIntervention` DATETIME(3) NULL,
    `dureeHeure` INTEGER NULL,
    `numero` INTEGER NULL,
    `ficheInt` VARCHAR(191) NULL,
    `idTechnicien` INTEGER NULL,
    `prenomContact` VARCHAR(191) NULL,
    `telephoneContact` VARCHAR(191) NULL,
    `adresse` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Utilisateur` ADD CONSTRAINT `Utilisateur_idRole_fkey` FOREIGN KEY (`idRole`) REFERENCES `Role`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Session` ADD CONSTRAINT `Session_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `Utilisateur`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Site` ADD CONSTRAINT `Site_idClient_fkey` FOREIGN KEY (`idClient`) REFERENCES `Client`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Contact` ADD CONSTRAINT `Contact_idClient_fkey` FOREIGN KEY (`idClient`) REFERENCES `Client`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Contact` ADD CONSTRAINT `Contact_idUtilisateur_fkey` FOREIGN KEY (`idUtilisateur`) REFERENCES `Utilisateur`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ContactSite` ADD CONSTRAINT `ContactSite_idSite_fkey` FOREIGN KEY (`idSite`) REFERENCES `Site`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ContactSite` ADD CONSTRAINT `ContactSite_idContact_fkey` FOREIGN KEY (`idContact`) REFERENCES `Contact`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Equipement` ADD CONSTRAINT `Equipement_idMarqueSsi_fkey` FOREIGN KEY (`idMarqueSsi`) REFERENCES `MarqueSsi`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Equipement` ADD CONSTRAINT `Equipement_idModeleSsi_fkey` FOREIGN KEY (`idModeleSsi`) REFERENCES `ModeleSsi`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Equipement` ADD CONSTRAINT `Equipement_idSysteme_fkey` FOREIGN KEY (`idSysteme`) REFERENCES `Systeme`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

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

-- AddForeignKey
ALTER TABLE `Contrat` ADD CONSTRAINT `Contrat_idSite_fkey` FOREIGN KEY (`idSite`) REFERENCES `Site`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Garantie` ADD CONSTRAINT `Garantie_idInstallationEq_fkey` FOREIGN KEY (`idInstallationEq`) REFERENCES `InstallationEquipement`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Maintenance` ADD CONSTRAINT `Maintenance_idSite_fkey` FOREIGN KEY (`idSite`) REFERENCES `Site`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Maintenance` ADD CONSTRAINT `Maintenance_idContact_fkey` FOREIGN KEY (`idContact`) REFERENCES `Contact`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Maintenance` ADD CONSTRAINT `Maintenance_idInstallation_fkey` FOREIGN KEY (`idInstallation`) REFERENCES `Installation`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Maintenance` ADD CONSTRAINT `Maintenance_idTechnicien_fkey` FOREIGN KEY (`idTechnicien`) REFERENCES `Utilisateur`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ActionMaintenance` ADD CONSTRAINT `ActionMaintenance_idSysteme_fkey` FOREIGN KEY (`idSysteme`) REFERENCES `Systeme`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MaintenanceAction` ADD CONSTRAINT `MaintenanceAction_idMaintenance_fkey` FOREIGN KEY (`idMaintenance`) REFERENCES `Maintenance`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MaintenanceAction` ADD CONSTRAINT `MaintenanceAction_idAction_fkey` FOREIGN KEY (`idAction`) REFERENCES `ActionMaintenance`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Intervention` ADD CONSTRAINT `Intervention_idSysteme_fkey` FOREIGN KEY (`idSysteme`) REFERENCES `Systeme`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Intervention` ADD CONSTRAINT `Intervention_idClient_fkey` FOREIGN KEY (`idClient`) REFERENCES `Client`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Intervention` ADD CONSTRAINT `Intervention_idSite_fkey` FOREIGN KEY (`idSite`) REFERENCES `Site`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Intervention` ADD CONSTRAINT `Intervention_idTechnicien_fkey` FOREIGN KEY (`idTechnicien`) REFERENCES `Utilisateur`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
