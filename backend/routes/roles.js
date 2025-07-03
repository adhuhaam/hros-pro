const express = require('express');
const { PrismaClient } = require('../generated/prisma');
const router = express.Router();
const prisma = new PrismaClient();

// Get all roles with their permissions
router.get('/', async (req, res) => {
    try {
        const roles = await prisma.role.findMany({
            include: {
                permissions: {
                    include: {
                        permission: true
                    }
                },
                userRoles: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                fullName: true,
                                email: true
                            }
                        }
                    }
                }
            }
        });

        const rolesWithPermissions = roles.map(role => ({
            ...role,
            permissions: role.permissions.map(rp => rp.permission),
            userCount: role.userRoles.length,
            users: role.userRoles.map(ur => ur.user)
        }));

        res.json(rolesWithPermissions);
    } catch (error) {
        console.error('Error fetching roles:', error);
        res.status(500).json({ error: 'Failed to fetch roles' });
    }
});

// Get role by ID
router.get('/:id', async (req, res) => {
    try {
        const role = await prisma.role.findUnique({
            where: { id: parseInt(req.params.id) },
            include: {
                permissions: {
                    include: {
                        permission: true
                    }
                },
                userRoles: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                fullName: true,
                                email: true
                            }
                        }
                    }
                }
            }
        });

        if (!role) {
            return res.status(404).json({ error: 'Role not found' });
        }

        const roleWithPermissions = {
            ...role,
            permissions: role.permissions.map(rp => rp.permission),
            userCount: role.userRoles.length,
            users: role.userRoles.map(ur => ur.user)
        };

        res.json(roleWithPermissions);
    } catch (error) {
        console.error('Error fetching role:', error);
        res.status(500).json({ error: 'Failed to fetch role' });
    }
});

// Create new role
router.post('/', async (req, res) => {
    try {
        const { name, description, permissions } = req.body;

        // Check if role already exists
        const existingRole = await prisma.role.findUnique({
            where: { name }
        });

        if (existingRole) {
            return res.status(400).json({ error: 'Role with this name already exists' });
        }

        const role = await prisma.$transaction(async (tx) => {
            const newRole = await tx.role.create({
                data: {
                    name,
                    description
                }
            });

            // Assign permissions if provided
            if (permissions && permissions.length > 0) {
                const permissionIds = await tx.permission.findMany({
                    where: { name: { in: permissions } }
                });

                await tx.rolePermission.createMany({
                    data: permissionIds.map(permission => ({
                        roleId: newRole.id,
                        permissionId: permission.id
                    }))
                });
            }

            return newRole;
        });

        res.status(201).json({ message: 'Role created successfully', roleId: role.id });
    } catch (error) {
        console.error('Error creating role:', error);
        res.status(500).json({ error: 'Failed to create role' });
    }
});

// Update role
router.put('/:id', async (req, res) => {
    try {
        const { name, description, permissions } = req.body;
        const roleId = parseInt(req.params.id);

        const updateData = {
            description
        };

        if (name) {
            // Check if name is already taken by another role
            const existingRole = await prisma.role.findFirst({
                where: {
                    name,
                    id: { not: roleId }
                }
            });

            if (existingRole) {
                return res.status(400).json({ error: 'Role name already taken' });
            }
            updateData.name = name;
        }

        const role = await prisma.$transaction(async (tx) => {
            // Update role
            const updatedRole = await tx.role.update({
                where: { id: roleId },
                data: updateData
            });

            // Update permissions if provided
            if (permissions) {
                // Remove existing permissions
                await tx.rolePermission.deleteMany({
                    where: { roleId }
                });

                // Add new permissions
                if (permissions.length > 0) {
                    const permissionIds = await tx.permission.findMany({
                        where: { name: { in: permissions } }
                    });

                    await tx.rolePermission.createMany({
                        data: permissionIds.map(permission => ({
                            roleId,
                            permissionId: permission.id
                        }))
                    });
                }
            }

            return updatedRole;
        });

        res.json({ message: 'Role updated successfully' });
    } catch (error) {
        console.error('Error updating role:', error);
        res.status(500).json({ error: 'Failed to update role' });
    }
});

// Delete role
router.delete('/:id', async (req, res) => {
    try {
        const roleId = parseInt(req.params.id);

        // Check if role is assigned to any users
        const userCount = await prisma.userRole.count({
            where: { roleId }
        });

        if (userCount > 0) {
            return res.status(400).json({
                error: 'Cannot delete role that is assigned to users',
                userCount
            });
        }

        await prisma.$transaction(async (tx) => {
            // Delete role permissions first
            await tx.rolePermission.deleteMany({
                where: { roleId }
            });

            // Delete role
            await tx.role.delete({
                where: { id: roleId }
            });
        });

        res.json({ message: 'Role deleted successfully' });
    } catch (error) {
        console.error('Error deleting role:', error);
        res.status(500).json({ error: 'Failed to delete role' });
    }
});

// Get all permissions
router.get('/permissions/all', async (req, res) => {
    try {
        const permissions = await prisma.permission.findMany({
            orderBy: [
                { resource: 'asc' },
                { action: 'asc' }
            ]
        });

        // Group permissions by resource
        const groupedPermissions = permissions.reduce((acc, permission) => {
            if (!acc[permission.resource]) {
                acc[permission.resource] = [];
            }
            acc[permission.resource].push(permission);
            return acc;
        }, {});

        res.json({ permissions, groupedPermissions });
    } catch (error) {
        console.error('Error fetching permissions:', error);
        res.status(500).json({ error: 'Failed to fetch permissions' });
    }
});

// Create new permission
router.post('/permissions', async (req, res) => {
    try {
        const { name, description, resource, action } = req.body;

        // Check if permission already exists
        const existingPermission = await prisma.permission.findUnique({
            where: { name }
        });

        if (existingPermission) {
            return res.status(400).json({ error: 'Permission with this name already exists' });
        }

        const permission = await prisma.permission.create({
            data: {
                name,
                description,
                resource,
                action
            }
        });

        res.status(201).json({ message: 'Permission created successfully', permissionId: permission.id });
    } catch (error) {
        console.error('Error creating permission:', error);
        res.status(500).json({ error: 'Failed to create permission' });
    }
});

// Assign role to user
router.post('/:id/assign-user', async (req, res) => {
    try {
        const roleId = parseInt(req.params.id);
        const { userId } = req.body;

        // Check if role exists
        const role = await prisma.role.findUnique({
            where: { id: roleId }
        });

        if (!role) {
            return res.status(404).json({ error: 'Role not found' });
        }

        // Check if user exists
        const user = await prisma.user.findUnique({
            where: { id: parseInt(userId) }
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Check if role is already assigned to user
        const existingAssignment = await prisma.userRole.findUnique({
            where: {
                userId_roleId: {
                    userId: parseInt(userId),
                    roleId
                }
            }
        });

        if (existingAssignment) {
            return res.status(400).json({ error: 'Role is already assigned to this user' });
        }

        await prisma.userRole.create({
            data: {
                userId: parseInt(userId),
                roleId
            }
        });

        res.json({ message: 'Role assigned to user successfully' });
    } catch (error) {
        console.error('Error assigning role to user:', error);
        res.status(500).json({ error: 'Failed to assign role to user' });
    }
});

// Remove role from user
router.delete('/:id/remove-user', async (req, res) => {
    try {
        const roleId = parseInt(req.params.id);
        const { userId } = req.body;

        await prisma.userRole.deleteMany({
            where: {
                roleId,
                userId: parseInt(userId)
            }
        });

        res.json({ message: 'Role removed from user successfully' });
    } catch (error) {
        console.error('Error removing role from user:', error);
        res.status(500).json({ error: 'Failed to remove role from user' });
    }
});

module.exports = router; 