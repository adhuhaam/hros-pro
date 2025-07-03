/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `Agent` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[employeeId]` on the table `Employee` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `jobId` to the `Candidate` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Agent` ALTER COLUMN `updatedAt` DROP DEFAULT;

-- AlterTable
ALTER TABLE `Candidate` ADD COLUMN `jobId` INTEGER NOT NULL,
    ALTER COLUMN `updatedAt` DROP DEFAULT;

-- AlterTable
ALTER TABLE `Employee` ALTER COLUMN `employeeId` DROP DEFAULT;

-- AlterTable
ALTER TABLE `Permission` ALTER COLUMN `updatedAt` DROP DEFAULT;

-- AlterTable
ALTER TABLE `Recruitment` ADD COLUMN `agentId` INTEGER NULL;

-- AlterTable
ALTER TABLE `Role` ALTER COLUMN `updatedAt` DROP DEFAULT;

-- AlterTable
ALTER TABLE `User` ALTER COLUMN `fullName` DROP DEFAULT;

-- CreateTable
CREATE TABLE `SystemSettings` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `key` VARCHAR(191) NOT NULL,
    `value` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `category` VARCHAR(191) NOT NULL DEFAULT 'general',
    `isEditable` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `SystemSettings_key_key`(`key`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Agent_userId_key` ON `Agent`(`userId`);

-- CreateIndex
CREATE UNIQUE INDEX `Employee_employeeId_key` ON `Employee`(`employeeId`);

-- AddForeignKey
ALTER TABLE `Candidate` ADD CONSTRAINT `Candidate_jobId_fkey` FOREIGN KEY (`jobId`) REFERENCES `Recruitment`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Recruitment` ADD CONSTRAINT `Recruitment_agentId_fkey` FOREIGN KEY (`agentId`) REFERENCES `Agent`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
