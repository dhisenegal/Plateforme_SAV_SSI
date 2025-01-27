-- CreateTable
CREATE TABLE `CommentaireMaintenance` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `idMaintenance` INTEGER NOT NULL,
    `idUtilisateur` INTEGER NOT NULL,
    `commentaire` VARCHAR(191) NOT NULL,
    `dateCommentaire` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `CommentaireMaintenance` ADD CONSTRAINT `CommentaireMaintenance_idUtilisateur_fkey` FOREIGN KEY (`idUtilisateur`) REFERENCES `Utilisateur`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CommentaireMaintenance` ADD CONSTRAINT `CommentaireMaintenance_idMaintenance_fkey` FOREIGN KEY (`idMaintenance`) REFERENCES `Maintenance`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
