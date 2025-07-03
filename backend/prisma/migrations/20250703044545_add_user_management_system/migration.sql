-- CreateTable
CREATE TABLE `Role` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    UNIQUE INDEX `Role_name_key` (`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Permission` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `resource` VARCHAR(191) NOT NULL,
    `action` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    UNIQUE INDEX `Permission_name_key` (`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RolePermission` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `roleId` INTEGER NOT NULL,
    `permissionId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    UNIQUE INDEX `RolePermission_roleId_permissionId_key` (`roleId`, `permissionId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserRole` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `roleId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    UNIQUE INDEX `UserRole_userId_roleId_key` (`userId`, `roleId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Agent` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NULL,
    `agentId` VARCHAR(191) NOT NULL,
    `fullName` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NULL,
    `company` VARCHAR(191) NULL,
    `commission` DOUBLE NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'active',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    UNIQUE INDEX `Agent_agentId_key` (`agentId`),
    UNIQUE INDEX `Agent_email_key` (`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Candidate` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `agentId` INTEGER NOT NULL,
    `fullName` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NULL,
    `resume` VARCHAR(191) NULL,
    `position` VARCHAR(191) NOT NULL,
    `experience` INTEGER NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'pending',
    `notes` VARCHAR(191) NULL,
    `appliedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Add new columns to User table with default values
ALTER TABLE `User`
ADD COLUMN `fullName` VARCHAR(191) NOT NULL DEFAULT 'Unknown User';

ALTER TABLE `User` ADD COLUMN `phone` VARCHAR(191) NULL;

ALTER TABLE `User`
ADD COLUMN `isActive` BOOLEAN NOT NULL DEFAULT true;

ALTER TABLE `User` ADD COLUMN `lastLogin` DATETIME(3) NULL;

-- Add new columns to Employee table with default values
ALTER TABLE `Employee`
ADD COLUMN `employeeId` VARCHAR(191) NOT NULL DEFAULT 'EMP000';

ALTER TABLE `Employee` ADD COLUMN `salary` DOUBLE NULL;

ALTER TABLE `Employee`
ADD COLUMN `status` VARCHAR(191) NOT NULL DEFAULT 'active';

-- Update existing User records to have proper fullName
UPDATE `User`
SET
    `fullName` = 'Super Admin'
WHERE
    `email` = 'admin@hrms.com'
    AND `fullName` = 'Unknown User';

-- Update existing Employee records to have proper employeeId
UPDATE `Employee`
SET
    `employeeId` = CONCAT('EMP', LPAD(id, 3, '0'))
WHERE
    `employeeId` = 'EMP000';

-- Create default roles
INSERT INTO
    `Role` (`name`, `description`)
VALUES (
        'superadmin',
        'Full system access and user management'
    ),
    (
        'admin',
        'Administrative access to all modules'
    ),
    (
        'hr',
        'Human resources management access'
    ),
    (
        'manager',
        'Department management access'
    ),
    (
        'employee',
        'Basic employee access'
    ),
    (
        'agent',
        'Recruitment agent access'
    );

-- Create default permissions
INSERT INTO
    `Permission` (
        `name`,
        `description`,
        `resource`,
        `action`
    )
VALUES
    -- User Management
    (
        'user.create',
        'Create new users',
        'users',
        'create'
    ),
    (
        'user.read',
        'View users',
        'users',
        'read'
    ),
    (
        'user.update',
        'Update users',
        'users',
        'update'
    ),
    (
        'user.delete',
        'Delete users',
        'users',
        'delete'
    ),
    -- Role Management
    (
        'role.create',
        'Create new roles',
        'roles',
        'create'
    ),
    (
        'role.read',
        'View roles',
        'roles',
        'read'
    ),
    (
        'role.update',
        'Update roles',
        'roles',
        'update'
    ),
    (
        'role.delete',
        'Delete roles',
        'roles',
        'delete'
    ),
    -- Employee Management
    (
        'employee.create',
        'Create new employees',
        'employees',
        'create'
    ),
    (
        'employee.read',
        'View employees',
        'employees',
        'read'
    ),
    (
        'employee.update',
        'Update employees',
        'employees',
        'update'
    ),
    (
        'employee.delete',
        'Delete employees',
        'employees',
        'delete'
    ),
    -- Payroll Management
    (
        'payroll.create',
        'Create payroll records',
        'payroll',
        'create'
    ),
    (
        'payroll.read',
        'View payroll',
        'payroll',
        'read'
    ),
    (
        'payroll.update',
        'Update payroll',
        'payroll',
        'update'
    ),
    (
        'payroll.delete',
        'Delete payroll',
        'payroll',
        'delete'
    ),
    -- Leave Management
    (
        'leave.create',
        'Create leave requests',
        'leaves',
        'create'
    ),
    (
        'leave.read',
        'View leave requests',
        'leaves',
        'read'
    ),
    (
        'leave.update',
        'Update leave requests',
        'leaves',
        'update'
    ),
    (
        'leave.delete',
        'Delete leave requests',
        'leaves',
        'delete'
    ),
    -- Recruitment Management
    (
        'recruitment.create',
        'Create job postings',
        'recruitment',
        'create'
    ),
    (
        'recruitment.read',
        'View job postings',
        'recruitment',
        'read'
    ),
    (
        'recruitment.update',
        'Update job postings',
        'recruitment',
        'update'
    ),
    (
        'recruitment.delete',
        'Delete job postings',
        'recruitment',
        'delete'
    ),
    -- Candidate Management
    (
        'candidate.create',
        'Create candidates',
        'candidates',
        'create'
    ),
    (
        'candidate.read',
        'View candidates',
        'candidates',
        'read'
    ),
    (
        'candidate.update',
        'Update candidates',
        'candidates',
        'update'
    ),
    (
        'candidate.delete',
        'Delete candidates',
        'candidates',
        'delete'
    );

-- Assign all permissions to superadmin role
INSERT INTO
    `RolePermission` (`roleId`, `permissionId`)
SELECT (
        SELECT id
        FROM `Role`
        WHERE
            name = 'superadmin'
    ) as roleId, id as permissionId
FROM `Permission`;

-- Assign basic permissions to admin role
INSERT INTO
    `RolePermission` (`roleId`, `permissionId`)
SELECT (
        SELECT id
        FROM `Role`
        WHERE
            name = 'admin'
    ) as roleId, id as permissionId
FROM `Permission`
WHERE
    resource IN (
        'employees',
        'payroll',
        'leaves',
        'recruitment',
        'candidates'
    );

-- Assign HR permissions
INSERT INTO
    `RolePermission` (`roleId`, `permissionId`)
SELECT (
        SELECT id
        FROM `Role`
        WHERE
            name = 'hr'
    ) as roleId, id as permissionId
FROM `Permission`
WHERE
    resource IN (
        'employees',
        'leaves',
        'recruitment',
        'candidates'
    );

-- Assign employee permissions
INSERT INTO
    `RolePermission` (`roleId`, `permissionId`)
SELECT (
        SELECT id
        FROM `Role`
        WHERE
            name = 'employee'
    ) as roleId, id as permissionId
FROM `Permission`
WHERE
    resource IN ('leaves')
    AND action IN ('create', 'read');

-- Assign agent permissions
INSERT INTO
    `RolePermission` (`roleId`, `permissionId`)
SELECT (
        SELECT id
        FROM `Role`
        WHERE
            name = 'agent'
    ) as roleId, id as permissionId
FROM `Permission`
WHERE
    resource IN ('candidates')
    AND action IN ('create', 'read', 'update');

-- Assign superadmin role to existing admin user (only if user exists and not already assigned)
INSERT INTO
    `UserRole` (`userId`, `roleId`)
SELECT u.id as userId, r.id as roleId
FROM `User` u, `Role` r
WHERE
    u.email = 'admin@hrms.com'
    AND r.name = 'superadmin'
    AND u.id IS NOT NULL
    AND r.id IS NOT NULL
    AND NOT EXISTS (
        SELECT 1
        FROM `UserRole` ur
        WHERE
            ur.userId = u.id
            AND ur.roleId = r.id
    );

-- Drop the old role column from User table
ALTER TABLE `User` DROP COLUMN `role`;

-- AddForeignKey
ALTER TABLE `RolePermission`
ADD CONSTRAINT `RolePermission_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `Role` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RolePermission`
ADD CONSTRAINT `RolePermission_permissionId_fkey` FOREIGN KEY (`permissionId`) REFERENCES `Permission` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserRole`
ADD CONSTRAINT `UserRole_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserRole`
ADD CONSTRAINT `UserRole_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `Role` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Agent`
ADD CONSTRAINT `Agent_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Candidate`
ADD CONSTRAINT `Candidate_agentId_fkey` FOREIGN KEY (`agentId`) REFERENCES `Agent` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;