/*
  Warnings:

  - You are about to drop the column `quantite` on the `installationequipement` table. All the data in the column will be lost.
  - You are about to alter the column `statut` on the `installationequipement` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(2))`.

*/
-- AlterTable
ALTER TABLE `installationequipement` DROP COLUMN `quantite`,
    ADD COLUMN `Commentaires` VARCHAR(191) NULL,
    ADD COLUMN `Emplacement` VARCHAR(191) NULL,
    ADD COLUMN `HorsService` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `Numero` VARCHAR(191) NULL,
    MODIFY `statut` ENUM('A_REPARER', 'A_CHANGER', 'OK') NOT NULL DEFAULT 'OK';

-- CreateTable
CREATE TABLE `Extincteur` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `idEquipement` INTEGER NOT NULL,
    `typePression` ENUM('PP', 'PA') NOT NULL,
    `modeVerification` ENUM('V5', 'V10') NOT NULL,
    `chargeReference` VARCHAR(191) NOT NULL,
    `tare` VARCHAR(191) NOT NULL,
    `sparklet` BOOLEAN NOT NULL DEFAULT false,
    `chargeReferenceSparklet` VARCHAR(191) NOT NULL,
    `poidsMax` VARCHAR(191) NOT NULL,
    `poidsMin` VARCHAR(191) NOT NULL,
    `idTypeExtincteur` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TypeExtincteur` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nom` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `InstallationExtincteur` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `idInstallationEquipement` INTEGER NOT NULL,
    `DateFabrication` DATETIME(3) NOT NULL,
    `DatePremierChargement` DATETIME(3) NOT NULL,
    `DateDerniereVerification` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CommentaireMaintenance` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `idMaintenance` INTEGER NOT NULL,
    `idUtilisateur` INTEGER NOT NULL,
    `commentaire` VARCHAR(191) NOT NULL,
    `dateCommentaire` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MaintenanceActionExtincteur` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `idMaintenance` INTEGER NOT NULL,
    `idActionMaintenanceExtincteur` INTEGER NOT NULL,
    `idInstallationExtincteur` INTEGER NOT NULL,
    `statut` BOOLEAN NOT NULL,
    `observation` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ActionMaintenanceExtincteur` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `libeleAction` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Extincteur` ADD CONSTRAINT `Extincteur_idTypeExtincteur_fkey` FOREIGN KEY (`idTypeExtincteur`) REFERENCES `TypeExtincteur`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Extincteur` ADD CONSTRAINT `Extincteur_idEquipement_fkey` FOREIGN KEY (`idEquipement`) REFERENCES `Equipement`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InstallationExtincteur` ADD CONSTRAINT `InstallationExtincteur_idInstallationEquipement_fkey` FOREIGN KEY (`idInstallationEquipement`) REFERENCES `InstallationEquipement`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CommentaireMaintenance` ADD CONSTRAINT `CommentaireMaintenance_idUtilisateur_fkey` FOREIGN KEY (`idUtilisateur`) REFERENCES `Utilisateur`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CommentaireMaintenance` ADD CONSTRAINT `CommentaireMaintenance_idMaintenance_fkey` FOREIGN KEY (`idMaintenance`) REFERENCES `Maintenance`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MaintenanceActionExtincteur` ADD CONSTRAINT `MaintenanceActionExtincteur_idInstallationExtincteur_fkey` FOREIGN KEY (`idInstallationExtincteur`) REFERENCES `InstallationExtincteur`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MaintenanceActionExtincteur` ADD CONSTRAINT `MaintenanceActionExtincteur_idMaintenance_fkey` FOREIGN KEY (`idMaintenance`) REFERENCES `Maintenance`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MaintenanceActionExtincteur` ADD CONSTRAINT `MaintenanceActionExtincteur_idActionMaintenanceExtincteur_fkey` FOREIGN KEY (`idActionMaintenanceExtincteur`) REFERENCES `ActionMaintenanceExtincteur`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
