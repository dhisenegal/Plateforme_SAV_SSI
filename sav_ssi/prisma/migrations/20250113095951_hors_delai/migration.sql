/*
  Warnings:

  - You are about to drop the column `delai` on the `intervention` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `intervention` DROP COLUMN `delai`,
    ADD COLUMN `horsDelai` BOOLEAN NOT NULL DEFAULT false;
