const { PrismaClient } = require('../generated/prisma');

const prisma = new PrismaClient();

async function seedSettings() {
    try {
        console.log('🌱 Seeding system settings...');

        const defaultSettings = [
            // General Settings
            {
                key: 'company_name',
                value: 'HRoS Pro',
                description: 'Company name displayed throughout the system',
                category: 'general'
            },
            {
                key: 'system_email',
                value: 'sadmin@hros.com',
                description: 'Primary system email address',
                category: 'general'
            },
            {
                key: 'timezone',
                value: 'UTC',
                description: 'System timezone for date/time display',
                category: 'general'
            },
            {
                key: 'notifications_enabled',
                value: 'true',
                description: 'Enable system notifications',
                category: 'general'
            },
            {
                key: 'system_version',
                value: '1.0.0',
                description: 'Current system version',
                category: 'general',
                isEditable: false
            },
            {
                key: 'maintenance_mode',
                value: 'false',
                description: 'Enable maintenance mode',
                category: 'general'
            },

            // Theme Settings
            {
                key: 'theme_mode',
                value: 'default',
                description: 'Default theme mode (default, dark, light, auto)',
                category: 'theme'
            },
            {
                key: 'primary_color',
                value: 'blue',
                description: 'Primary color scheme',
                category: 'theme'
            },
            {
                key: 'sidebar_collapsed',
                value: 'false',
                description: 'Default sidebar state',
                category: 'theme'
            },

            // Notification Settings
            {
                key: 'email_notifications',
                value: 'true',
                description: 'Enable email notifications',
                category: 'notification'
            },
            {
                key: 'push_notifications',
                value: 'true',
                description: 'Enable push notifications',
                category: 'notification'
            },
            {
                key: 'leave_approval_notifications',
                value: 'true',
                description: 'Notify managers of leave requests',
                category: 'notification'
            },
            {
                key: 'attendance_alerts',
                value: 'true',
                description: 'Send attendance alerts',
                category: 'notification'
            },

            // Security Settings
            {
                key: 'session_timeout',
                value: '3600',
                description: 'Session timeout in seconds',
                category: 'security'
            },
            {
                key: 'password_policy',
                value: 'medium',
                description: 'Password strength policy (low, medium, high)',
                category: 'security'
            },
            {
                key: 'two_factor_auth',
                value: 'false',
                description: 'Enable two-factor authentication',
                category: 'security'
            },
            {
                key: 'login_attempts_limit',
                value: '5',
                description: 'Maximum login attempts before lockout',
                category: 'security'
            }
        ];

        for (const setting of defaultSettings) {
            await prisma.systemSettings.upsert({
                where: { key: setting.key },
                update: setting,
                create: setting
            });
        }

        console.log('✅ System settings seeded successfully!');
    } catch (error) {
        console.error('❌ Error seeding system settings:', error);
    } finally {
        await prisma.$disconnect();
    }
}

seedSettings(); 
