const { PrismaClient } = require('../generated/prisma');

const prisma = new PrismaClient();

async function seedPermissions() {
    try {
        console.log('🌱 Seeding permissions...');

        const defaultPermissions = [
            // User Management
            { name: 'create_users', description: 'Create new users', resource: 'users', action: 'create' },
            { name: 'read_users', description: 'View user information', resource: 'users', action: 'read' },
            { name: 'update_users', description: 'Update user information', resource: 'users', action: 'update' },
            { name: 'delete_users', description: 'Delete users', resource: 'users', action: 'delete' },
            { name: 'manage_users', description: 'Full user management', resource: 'users', action: 'manage' },

            // Role Management
            { name: 'create_roles', description: 'Create new roles', resource: 'roles', action: 'create' },
            { name: 'read_roles', description: 'View role information', resource: 'roles', action: 'read' },
            { name: 'update_roles', description: 'Update role information', resource: 'roles', action: 'update' },
            { name: 'delete_roles', description: 'Delete roles', resource: 'roles', action: 'delete' },
            { name: 'manage_roles', description: 'Full role management', resource: 'roles', action: 'manage' },

            // Employee Management
            { name: 'create_employees', description: 'Create new employees', resource: 'employees', action: 'create' },
            { name: 'read_employees', description: 'View employee information', resource: 'employees', action: 'read' },
            { name: 'update_employees', description: 'Update employee information', resource: 'employees', action: 'update' },
            { name: 'delete_employees', description: 'Delete employees', resource: 'employees', action: 'delete' },
            { name: 'manage_employees', description: 'Full employee management', resource: 'employees', action: 'manage' },

            // Payroll Management
            { name: 'create_payroll', description: 'Create payroll records', resource: 'payroll', action: 'create' },
            { name: 'read_payroll', description: 'View payroll information', resource: 'payroll', action: 'read' },
            { name: 'update_payroll', description: 'Update payroll records', resource: 'payroll', action: 'update' },
            { name: 'delete_payroll', description: 'Delete payroll records', resource: 'payroll', action: 'delete' },
            { name: 'manage_payroll', description: 'Full payroll management', resource: 'payroll', action: 'manage' },

            // Recruitment Management
            { name: 'create_recruitment', description: 'Create job postings', resource: 'recruitment', action: 'create' },
            { name: 'read_recruitment', description: 'View recruitment information', resource: 'recruitment', action: 'read' },
            { name: 'update_recruitment', description: 'Update job postings', resource: 'recruitment', action: 'update' },
            { name: 'delete_recruitment', description: 'Delete job postings', resource: 'recruitment', action: 'delete' },
            { name: 'manage_recruitment', description: 'Full recruitment management', resource: 'recruitment', action: 'manage' },

            // Attendance Management
            { name: 'create_attendance', description: 'Create attendance records', resource: 'attendance', action: 'create' },
            { name: 'read_attendance', description: 'View attendance information', resource: 'attendance', action: 'read' },
            { name: 'update_attendance', description: 'Update attendance records', resource: 'attendance', action: 'update' },
            { name: 'delete_attendance', description: 'Delete attendance records', resource: 'attendance', action: 'delete' },
            { name: 'manage_attendance', description: 'Full attendance management', resource: 'attendance', action: 'manage' },

            // Leave Management
            { name: 'create_leaves', description: 'Create leave requests', resource: 'leaves', action: 'create' },
            { name: 'read_leaves', description: 'View leave information', resource: 'leaves', action: 'read' },
            { name: 'update_leaves', description: 'Update leave requests', resource: 'leaves', action: 'update' },
            { name: 'delete_leaves', description: 'Delete leave requests', resource: 'leaves', action: 'delete' },
            { name: 'manage_leaves', description: 'Full leave management', resource: 'leaves', action: 'manage' },

            // System Settings
            { name: 'read_settings', description: 'View system settings', resource: 'settings', action: 'read' },
            { name: 'update_settings', description: 'Update system settings', resource: 'settings', action: 'update' },
            { name: 'manage_settings', description: 'Full system settings management', resource: 'settings', action: 'manage' }
        ];

        for (const permission of defaultPermissions) {
            await prisma.permission.upsert({
                where: { name: permission.name },
                update: permission,
                create: permission
            });
        }

        console.log('✅ Permissions seeded successfully!');
    } catch (error) {
        console.error('❌ Error seeding permissions:', error);
    } finally {
        await prisma.$disconnect();
    }
}

seedPermissions(); 