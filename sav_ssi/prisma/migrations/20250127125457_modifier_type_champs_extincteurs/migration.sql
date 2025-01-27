/*
  Warnings:

  - You are about to alter the column `chargeReference` on the `extincteur` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `tare` on the `extincteur` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `chargeReferenceSparklet` on the `extincteur` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `poidsMax` on the `extincteur` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `poidsMin` on the `extincteur` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.

*/
-- AlterTable
ALTER TABLE `extincteur` MODIFY `chargeReference` INTEGER NULL,
    MODIFY `tare` INTEGER NULL,
    MODIFY `chargeReferenceSparklet` INTEGER NULL,
    MODIFY `poidsMax` INTEGER NULL,
    MODIFY `poidsMin` INTEGER NULL;
