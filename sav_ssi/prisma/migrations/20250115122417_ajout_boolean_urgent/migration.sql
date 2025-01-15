/*
  Warnings:

  - You are about to drop the column `Urgent` on the `intervention` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `intervention` DROP COLUMN `Urgent`,
    ADD COLUMN `urgent` BOOLEAN NULL DEFAULT false;
