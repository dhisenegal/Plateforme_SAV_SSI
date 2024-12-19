-- DropForeignKey
ALTER TABLE `contact` DROP FOREIGN KEY `Contact_idClient_fkey`;

-- DropForeignKey
ALTER TABLE `contact` DROP FOREIGN KEY `Contact_idUtilisateur_fkey`;

-- DropForeignKey
ALTER TABLE `contactsite` DROP FOREIGN KEY `ContactSite_idContact_fkey`;

-- DropForeignKey
ALTER TABLE `contactsite` DROP FOREIGN KEY `ContactSite_idSite_fkey`;

-- AddForeignKey
ALTER TABLE `Contact` ADD CONSTRAINT `Contact_idClient_fkey` FOREIGN KEY (`idClient`) REFERENCES `Client`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Contact` ADD CONSTRAINT `Contact_idUtilisateur_fkey` FOREIGN KEY (`idUtilisateur`) REFERENCES `Utilisateur`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ContactSite` ADD CONSTRAINT `ContactSite_idSite_fkey` FOREIGN KEY (`idSite`) REFERENCES `Site`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ContactSite` ADD CONSTRAINT `ContactSite_idContact_fkey` FOREIGN KEY (`idContact`) REFERENCES `Contact`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
