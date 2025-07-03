const express = require('express');
const { PrismaClient } = require('../generated/prisma');

const router = express.Router();
const prisma = new PrismaClient();

// Get all settings
router.get('/', async (req, res) => {
    try {
        const { category } = req.query;

        const where = {};
        if (category) {
            where.category = category;
        }

        const settings = await prisma.systemSettings.findMany({
            where,
            orderBy: [
                { category: 'asc' },
                { key: 'asc' }
            ]
        });

        // Group settings by category
        const groupedSettings = settings.reduce((acc, setting) => {
            if (!acc[setting.category]) {
                acc[setting.category] = [];
            }
            acc[setting.category].push(setting);
            return acc;
        }, {});

        res.json({
            success: true,
            data: groupedSettings,
            message: 'Settings retrieved successfully'
        });
    } catch (error) {
        console.error('Error fetching settings:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch settings',
            error: error.message
        });
    }
});

// Get setting by key
router.get('/:key', async (req, res) => {
    try {
        const { key } = req.params;

        const setting = await prisma.systemSettings.findUnique({
            where: { key }
        });

        if (!setting) {
            return res.status(404).json({
                success: false,
                message: 'Setting not found'
            });
        }

        res.json({
            success: true,
            data: setting,
            message: 'Setting retrieved successfully'
        });
    } catch (error) {
        console.error('Error fetching setting:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch setting',
            error: error.message
        });
    }
});

// Update setting
router.put('/:key', async (req, res) => {
    try {
        const { key } = req.params;
        const { value, description } = req.body;

        // Check if setting exists
        const existingSetting = await prisma.systemSettings.findUnique({
            where: { key }
        });

        if (!existingSetting) {
            return res.status(404).json({
                success: false,
                message: 'Setting not found'
            });
        }

        // Check if setting is editable
        if (!existingSetting.isEditable) {
            return res.status(400).json({
                success: false,
                message: 'This setting cannot be modified'
            });
        }

        const updatedSetting = await prisma.systemSettings.update({
            where: { key },
            data: {
                value,
                description: description || existingSetting.description,
                updatedAt: new Date()
            }
        });

        res.json({
            success: true,
            data: updatedSetting,
            message: 'Setting updated successfully'
        });
    } catch (error) {
        console.error('Error updating setting:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update setting',
            error: error.message
        });
    }
});

// Update multiple settings
router.put('/batch/update', async (req, res) => {
    try {
        const { settings } = req.body;

        if (!Array.isArray(settings)) {
            return res.status(400).json({
                success: false,
                message: 'Settings must be an array'
            });
        }

        const results = [];

        for (const setting of settings) {
            const { key, value, description } = setting;

            try {
                // Check if setting exists and is editable
                const existingSetting = await prisma.systemSettings.findUnique({
                    where: { key }
                });

                if (!existingSetting) {
                    results.push({
                        key,
                        success: false,
                        message: 'Setting not found'
                    });
                    continue;
                }

                if (!existingSetting.isEditable) {
                    results.push({
                        key,
                        success: false,
                        message: 'Setting cannot be modified'
                    });
                    continue;
                }

                const updatedSetting = await prisma.systemSettings.update({
                    where: { key },
                    data: {
                        value,
                        description: description || existingSetting.description,
                        updatedAt: new Date()
                    }
                });

                results.push({
                    key,
                    success: true,
                    data: updatedSetting,
                    message: 'Setting updated successfully'
                });
            } catch (error) {
                results.push({
                    key,
                    success: false,
                    message: error.message
                });
            }
        }

        res.json({
            success: true,
            data: results,
            message: 'Batch update completed'
        });
    } catch (error) {
        console.error('Error in batch update:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update settings',
            error: error.message
        });
    }
});

// Create new setting
router.post('/', async (req, res) => {
    try {
        const { key, value, description, category, isEditable } = req.body;

        // Validate required fields
        if (!key || !value) {
            return res.status(400).json({
                success: false,
                message: 'Key and value are required'
            });
        }

        // Check if setting already exists
        const existingSetting = await prisma.systemSettings.findUnique({
            where: { key }
        });

        if (existingSetting) {
            return res.status(400).json({
                success: false,
                message: 'Setting with this key already exists'
            });
        }

        const newSetting = await prisma.systemSettings.create({
            data: {
                key,
                value,
                description,
                category: category || 'general',
                isEditable: isEditable !== undefined ? isEditable : true
            }
        });

        res.status(201).json({
            success: true,
            data: newSetting,
            message: 'Setting created successfully'
        });
    } catch (error) {
        console.error('Error creating setting:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create setting',
            error: error.message
        });
    }
});

// Delete setting
router.delete('/:key', async (req, res) => {
    try {
        const { key } = req.params;

        // Check if setting exists
        const existingSetting = await prisma.systemSettings.findUnique({
            where: { key }
        });

        if (!existingSetting) {
            return res.status(404).json({
                success: false,
                message: 'Setting not found'
            });
        }

        // Check if setting is editable
        if (!existingSetting.isEditable) {
            return res.status(400).json({
                success: false,
                message: 'This setting cannot be deleted'
            });
        }

        await prisma.systemSettings.delete({
            where: { key }
        });

        res.json({
            success: true,
            message: 'Setting deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting setting:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete setting',
            error: error.message
        });
    }
});

// Get settings by category
router.get('/category/:category', async (req, res) => {
    try {
        const { category } = req.params;

        const settings = await prisma.systemSettings.findMany({
            where: { category },
            orderBy: { key: 'asc' }
        });

        res.json({
            success: true,
            data: settings,
            message: `${category} settings retrieved successfully`
        });
    } catch (error) {
        console.error('Error fetching settings by category:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch settings',
            error: error.message
        });
    }
});

module.exports = router; 