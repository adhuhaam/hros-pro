const express = require('express');
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('../generated/prisma');
const router = express.Router();
const prisma = new PrismaClient();

// Get all users with their roles
router.get('/', async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            include: {
                userRoles: {
                    include: {
                        role: true
                    }
                },
                employee: true,
                agent: true
            }
        });

        const usersWithRoles = users.map(user => ({
            ...user,
            roles: user.userRoles.map(ur => ur.role.name),
            userType: user.employee ? 'employee' : user.agent ? 'agent' : 'user'
        }));

        res.json(usersWithRoles);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

// Get user by ID
router.get('/:id', async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: parseInt(req.params.id) },
            include: {
                userRoles: {
                    include: {
                        role: true
                    }
                },
                employee: true,
                agent: true
            }
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const userWithRoles = {
            ...user,
            roles: user.userRoles.map(ur => ur.role.name),
            userType: user.employee ? 'employee' : user.agent ? 'agent' : 'user'
        };

        res.json(userWithRoles);
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ error: 'Failed to fetch user' });
    }
});

// Create new user
router.post('/', async (req, res) => {
    try {
        const { email, password, fullName, phone, roles, userType, ...userData } = req.body;

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return res.status(400).json({ error: 'User with this email already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user with roles
        const user = await prisma.$transaction(async (tx) => {
            const newUser = await tx.user.create({
                data: {
                    email,
                    password: hashedPassword,
                    fullName,
                    phone,
                    isActive: true
                }
            });

            // Assign roles if provided
            if (roles && roles.length > 0) {
                const roleIds = await tx.role.findMany({
                    where: { name: { in: roles } }
                });

                await tx.userRole.createMany({
                    data: roleIds.map(role => ({
                        userId: newUser.id,
                        roleId: role.id
                    }))
                });
            }

            // Create employee or agent record if specified
            if (userType === 'employee') {
                const employeeId = `EMP${String(newUser.id).padStart(3, '0')}`;
                await tx.employee.create({
                    data: {
                        userId: newUser.id,
                        employeeId,
                        fullName,
                        email,
                        phone,
                        ...userData
                    }
                });
            } else if (userType === 'agent') {
                const agentId = `AGT${String(newUser.id).padStart(3, '0')}`;
                await tx.agent.create({
                    data: {
                        userId: newUser.id,
                        agentId,
                        fullName,
                        email,
                        phone,
                        ...userData
                    }
                });
            }

            return newUser;
        });

        res.status(201).json({ message: 'User created successfully', userId: user.id });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Failed to create user' });
    }
});

// Update user
router.put('/:id', async (req, res) => {
    try {
        const { email, password, fullName, phone, roles, isActive, ...userData } = req.body;
        const userId = parseInt(req.params.id);

        const updateData = {
            fullName,
            phone,
            isActive
        };

        if (password) {
            updateData.password = await bcrypt.hash(password, 10);
        }

        if (email) {
            // Check if email is already taken by another user
            const existingUser = await prisma.user.findFirst({
                where: {
                    email,
                    id: { not: userId }
                }
            });

            if (existingUser) {
                return res.status(400).json({ error: 'Email already taken by another user' });
            }
            updateData.email = email;
        }

        const user = await prisma.$transaction(async (tx) => {
            // Update user
            const updatedUser = await tx.user.update({
                where: { id: userId },
                data: updateData
            });

            // Update roles if provided
            if (roles) {
                // Remove existing roles
                await tx.userRole.deleteMany({
                    where: { userId }
                });

                // Add new roles
                if (roles.length > 0) {
                    const roleIds = await tx.role.findMany({
                        where: { name: { in: roles } }
                    });

                    await tx.userRole.createMany({
                        data: roleIds.map(role => ({
                            userId,
                            roleId: role.id
                        }))
                    });
                }
            }

            return updatedUser;
        });

        res.json({ message: 'User updated successfully' });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ error: 'Failed to update user' });
    }
});

// Delete user
router.delete('/:id', async (req, res) => {
    try {
        const userId = parseInt(req.params.id);

        await prisma.$transaction(async (tx) => {
            // Delete related records first
            await tx.userRole.deleteMany({
                where: { userId }
            });

            await tx.employee.deleteMany({
                where: { userId }
            });

            await tx.agent.deleteMany({
                where: { userId }
            });

            // Delete user
            await tx.user.delete({
                where: { id: userId }
            });
        });

        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ error: 'Failed to delete user' });
    }
});

// Get user permissions
router.get('/:id/permissions', async (req, res) => {
    try {
        const userId = parseInt(req.params.id);

        const userRoles = await prisma.userRole.findMany({
            where: { userId },
            include: {
                role: {
                    include: {
                        permissions: {
                            include: {
                                permission: true
                            }
                        }
                    }
                }
            }
        });

        const permissions = userRoles.flatMap(ur =>
            ur.role.permissions.map(rp => rp.permission)
        );

        // Remove duplicates
        const uniquePermissions = permissions.filter((permission, index, self) =>
            index === self.findIndex(p => p.id === permission.id)
        );

        res.json(uniquePermissions);
    } catch (error) {
        console.error('Error fetching user permissions:', error);
        res.status(500).json({ error: 'Failed to fetch user permissions' });
    }
});

// Check if user has specific permission
router.post('/:id/check-permission', async (req, res) => {
    try {
        const userId = parseInt(req.params.id);
        const { resource, action } = req.body;

        const userRoles = await prisma.userRole.findMany({
            where: { userId },
            include: {
                role: {
                    include: {
                        permissions: {
                            include: {
                                permission: true
                            }
                        }
                    }
                }
            }
        });

        const hasPermission = userRoles.some(ur =>
            ur.role.permissions.some(rp =>
                rp.permission.resource === resource && rp.permission.action === action
            )
        );

        res.json({ hasPermission });
    } catch (error) {
        console.error('Error checking user permission:', error);
        res.status(500).json({ error: 'Failed to check user permission' });
    }
});

module.exports = router; 