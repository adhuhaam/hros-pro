-- Migration: Convert Employee firstName/lastName to fullName
ALTER TABLE `Employee`
ADD COLUMN `fullName` VARCHAR(191) NOT NULL DEFAULT '';

-- Populate fullName from firstName and lastName
UPDATE `Employee`
SET
    `fullName` = CONCAT(`firstName`, ' ', `lastName`);

-- Make fullName required (remove default if needed)
ALTER TABLE `Employee`
MODIFY COLUMN `fullName` VARCHAR(191) NOT NULL;

-- Drop old columns
ALTER TABLE `Employee` DROP COLUMN `firstName`;

ALTER TABLE `Employee` DROP COLUMN `lastName`;