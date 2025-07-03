const { PrismaClient } = require('../generated/prisma');

const prisma = new PrismaClient();

async function seedRoles() {
    try {
        console.log('🌱 Seeding roles...');

        // Create default roles
        const roles = [
            {
                name: 'Super Admin',
                description: 'Full system access with all permissions',
                permissions: [
                    'manage_users', 'manage_roles', 'manage_employees', 'manage_payroll',
                    'manage_recruitment', 'manage_attendance', 'manage_leaves', 'manage_settings'
                ]
            },
            {
                name: 'HR Manager',
                description: 'HR operations management with limited system access',
                permissions: [
                    'read_users', 'update_users', 'read_roles', 'manage_employees',
                    'manage_payroll', 'manage_recruitment', 'manage_attendance',
                    'manage_leaves', 'read_settings', 'update_settings'
                ]
            },
            {
                name: 'Manager',
                description: 'Team management with employee oversight',
                permissions: [
                    'read_employees', 'update_employees', 'read_attendance',
                    'read_leaves', 'update_leaves', 'read_payroll'
                ]
            },
            {
                name: 'Employee',
                description: 'Basic employee access for personal information',
                permissions: [
                    'read_employees', 'read_attendance', 'create_leaves',
                    'read_leaves'
                ]
            }
        ];

        for (const roleData of roles) {
            // Create or update role
            const role = await prisma.role.upsert({
                where: { name: roleData.name },
                update: {
                    description: roleData.description
                },
                create: {
                    name: roleData.name,
                    description: roleData.description
                }
            });

            // Get permission IDs
            const permissions = await prisma.permission.findMany({
                where: { name: { in: roleData.permissions } }
            });

            // Remove existing role permissions
            await prisma.rolePermission.deleteMany({
                where: { roleId: role.id }
            });

            // Create new role permissions
            if (permissions.length > 0) {
                await prisma.rolePermission.createMany({
                    data: permissions.map(permission => ({
                        roleId: role.id,
                        permissionId: permission.id
                    }))
                });
            }

            console.log(`✅ Role "${role.name}" created/updated with ${permissions.length} permissions`);
        }

        console.log('✅ All roles seeded successfully!');
    } catch (error) {
        console.error('❌ Error seeding roles:', error);
    } finally {
        await prisma.$disconnect();
    }
}

seedRoles(); 