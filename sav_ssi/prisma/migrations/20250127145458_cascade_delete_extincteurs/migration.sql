-- DropForeignKey
ALTER TABLE `extincteur` DROP FOREIGN KEY `Extincteur_idEquipement_fkey`;

-- AddForeignKey
ALTER TABLE `Extincteur` ADD CONSTRAINT `Extincteur_idEquipement_fkey` FOREIGN KEY (`idEquipement`) REFERENCES `Equipement`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
