const { PrismaClient } = require('../generated/prisma');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    // Seed Departments
    const departments = [
        { name: 'HR' },
        { name: 'IT' },
        { name: 'Finance' },
        { name: 'Operations' },
        { name: 'Marketing' },
        { name: 'Sales' },
    ];
    for (const dept of departments) {
        await prisma.department.upsert({
            where: { name: dept.name },
            update: {},
            create: dept,
        });
    }

    // Seed Designations
    const designations = [
        { title: 'Manager' },
        { title: 'Developer' },
        { title: 'Accountant' },
        { title: 'Executive' },
        { title: 'Analyst' },
        { title: 'Sales Representative' },
    ];
    for (const desig of designations) {
        await prisma.designation.upsert({
            where: { title: desig.title },
            update: {},
            create: desig,
        });
    }

    // Seed Permissions
    const permissions = [
        { name: 'user_management', description: 'Manage users and roles', resource: 'users', action: 'manage' },
        { name: 'employee_management', description: 'Manage employees', resource: 'employees', action: 'manage' },
        { name: 'recruitment_management', description: 'Manage recruitment', resource: 'recruitment', action: 'manage' },
        { name: 'leave_management', description: 'Manage leaves', resource: 'leaves', action: 'manage' },
        { name: 'attendance_management', description: 'Manage attendance', resource: 'attendance', action: 'manage' },
        { name: 'payroll_management', description: 'Manage payroll', resource: 'payroll', action: 'manage' },
        { name: 'agent_management', description: 'Manage agents', resource: 'agents', action: 'manage' },
        { name: 'candidate_management', description: 'Manage candidates', resource: 'candidates', action: 'manage' },
    ];
    for (const perm of permissions) {
        await prisma.permission.upsert({
            where: { name: perm.name },
            update: {},
            create: perm,
        });
    }

    // Seed Roles
    const roles = [
        { name: 'superadmin', description: 'Super Administrator with all permissions' },
        { name: 'admin', description: 'Administrator with most permissions' },
        { name: 'hr_manager', description: 'HR Manager with HR-related permissions' },
        { name: 'employee', description: 'Regular employee with basic permissions' },
        { name: 'agent', description: 'Recruitment agent with candidate management permissions' },
    ];
    for (const role of roles) {
        await prisma.role.upsert({
            where: { name: role.name },
            update: {},
            create: role,
        });
    }

    // Assign permissions to roles
    const rolePermissions = [
        // Superadmin gets all permissions
        { roleName: 'superadmin', permissionNames: permissions.map(p => p.name) },
        // Admin gets most permissions except superadmin-specific ones
        { roleName: 'admin', permissionNames: ['employee_management', 'recruitment_management', 'leave_management', 'attendance_management', 'payroll_management', 'agent_management', 'candidate_management'] },
        // HR Manager gets HR-related permissions
        { roleName: 'hr_manager', permissionNames: ['employee_management', 'recruitment_management', 'leave_management', 'attendance_management', 'candidate_management'] },
        // Employee gets basic permissions
        { roleName: 'employee', permissionNames: ['leave_management', 'attendance_management'] },
        // Agent gets candidate management permissions
        { roleName: 'agent', permissionNames: ['candidate_management'] },
    ];

    for (const rolePerm of rolePermissions) {
        const role = await prisma.role.findUnique({ where: { name: rolePerm.roleName } });
        for (const permName of rolePerm.permissionNames) {
            const permission = await prisma.permission.findUnique({ where: { name: permName } });
            if (role && permission) {
                await prisma.rolePermission.upsert({
                    where: {
                        roleId_permissionId: {
                            roleId: role.id,
                            permissionId: permission.id,
                        },
                    },
                    update: {},
                    create: {
                        roleId: role.id,
                        permissionId: permission.id,
                    },
                });
            }
        }
    }

    // Seed Superadmin User
    const password = await bcrypt.hash('Ompl@65482*', 10);
    const superadminRole = await prisma.role.findUnique({ where: { name: 'superadmin' } });

    const superadminUser = await prisma.user.upsert({
        where: { email: 'sadmin@hros.com' },
        update: {},
        create: {
            email: 'sadmin@hros.com',
            password,
            fullName: 'Super Admin',
            employee: {
                create: {
                    fullName: 'Sadmin',
                    email: 'sadmin@hros.com',
                    phone: '+9603317878',
                    address: 'M.Nector',
                    dob: new Date('1985-01-15'),
                    dateOfJoining: new Date('2023-01-01'),
                    departmentId: 1, // HR
                    designationId: 1, // Manager
                },
            },
        },
    });

    // Assign superadmin role to the user
    if (superadminRole) {
        await prisma.userRole.upsert({
            where: {
                userId_roleId: {
                    userId: superadminUser.id,
                    roleId: superadminRole.id,
                },
            },
            update: {},
            create: {
                userId: superadminUser.id,
                roleId: superadminRole.id,
            },
        });
    }

    // Seed Sample Employees with realistic data for charts
    const sampleEmployees = [
        {
            fullName: 'John Smith',
            email: 'john.smith@company.com',
            phone: '+1234567891',
            address: '456 Oak Avenue, City, State',
            dob: new Date('1990-03-20'),
            dateOfJoining: new Date('2023-02-15'),
            departmentId: 2, // IT
            designationId: 2, // Developer
        },
        {
            fullName: 'Sarah Johnson',
            email: 'sarah.johnson@company.com',
            phone: '+1234567892',
            address: '789 Pine Street, City, State',
            dob: new Date('1988-07-10'),
            dateOfJoining: new Date('2023-03-01'),
            departmentId: 3, // Finance
            designationId: 3, // Accountant
        },
        {
            fullName: 'Michael Brown',
            email: 'michael.brown@company.com',
            phone: '+1234567893',
            address: '321 Elm Road, City, State',
            dob: new Date('1992-11-05'),
            dateOfJoining: new Date('2023-04-10'),
            departmentId: 4, // Operations
            designationId: 4, // Executive
        },
        {
            fullName: 'Emily Davis',
            email: 'emily.davis@company.com',
            phone: '+1234567894',
            address: '654 Maple Drive, City, State',
            dob: new Date('1995-09-25'),
            dateOfJoining: new Date('2023-05-20'),
            departmentId: 5, // Marketing
            designationId: 5, // Analyst
        },
        {
            fullName: 'David Wilson',
            email: 'david.wilson@company.com',
            phone: '+1234567895',
            address: '987 Cedar Lane, City, State',
            dob: new Date('1987-12-30'),
            dateOfJoining: new Date('2023-06-15'),
            departmentId: 6, // Sales
            designationId: 6, // Sales Representative
        },
        {
            fullName: 'Lisa Anderson',
            email: 'lisa.anderson@company.com',
            phone: '+1234567896',
            address: '147 Birch Court, City, State',
            dob: new Date('1991-04-18'),
            dateOfJoining: new Date('2023-07-01'),
            departmentId: 2, // IT
            designationId: 2, // Developer
        },
        {
            fullName: 'Robert Taylor',
            email: 'robert.taylor@company.com',
            phone: '+1234567897',
            address: '258 Spruce Way, City, State',
            dob: new Date('1989-08-12'),
            dateOfJoining: new Date('2023-08-10'),
            departmentId: 3, // Finance
            designationId: 3, // Accountant
        },
        {
            fullName: 'Jennifer Martinez',
            email: 'jennifer.martinez@company.com',
            phone: '+1234567898',
            address: '369 Willow Place, City, State',
            dob: new Date('1993-06-22'),
            dateOfJoining: new Date('2023-09-05'),
            departmentId: 1, // HR
            designationId: 4, // Executive
        },
        {
            fullName: 'Christopher Garcia',
            email: 'christopher.garcia@company.com',
            phone: '+1234567899',
            address: '741 Aspen Circle, City, State',
            dob: new Date('1994-02-14'),
            dateOfJoining: new Date('2023-10-15'),
            departmentId: 5, // Marketing
            designationId: 5, // Analyst
        },
        {
            fullName: 'Amanda Rodriguez',
            email: 'amanda.rodriguez@company.com',
            phone: '+1234567900',
            address: '852 Poplar Street, City, State',
            dob: new Date('1996-10-08'),
            dateOfJoining: new Date('2023-11-20'),
            departmentId: 6, // Sales
            designationId: 6, // Sales Representative
        },
        // Add some employees from 2024 for turnover analysis
        {
            fullName: 'Kevin Lee',
            email: 'kevin.lee@company.com',
            phone: '+1234567901',
            address: '963 Sycamore Road, City, State',
            dob: new Date('1990-05-30'),
            dateOfJoining: new Date('2024-01-15'),
            departmentId: 2, // IT
            designationId: 2, // Developer
        },
        {
            fullName: 'Rachel Green',
            email: 'rachel.green@company.com',
            phone: '+1234567902',
            address: '159 Magnolia Drive, City, State',
            dob: new Date('1992-12-03'),
            dateOfJoining: new Date('2024-02-01'),
            departmentId: 4, // Operations
            designationId: 4, // Executive
        },
        {
            fullName: 'Thomas White',
            email: 'thomas.white@company.com',
            phone: '+1234567903',
            address: '357 Redwood Lane, City, State',
            dob: new Date('1988-03-17'),
            dateOfJoining: new Date('2024-03-10'),
            departmentId: 3, // Finance
            designationId: 3, // Accountant
        },
        {
            fullName: 'Nicole Clark',
            email: 'nicole.clark@company.com',
            phone: '+1234567904',
            address: '486 Sequoia Court, City, State',
            dob: new Date('1995-07-28'),
            dateOfJoining: new Date('2024-04-05'),
            departmentId: 1, // HR
            designationId: 5, // Analyst
        },
        {
            fullName: 'Daniel Lewis',
            email: 'daniel.lewis@company.com',
            phone: '+1234567905',
            address: '753 Cypress Way, City, State',
            dob: new Date('1991-11-11'),
            dateOfJoining: new Date('2024-05-20'),
            departmentId: 5, // Marketing
            designationId: 6, // Sales Representative
        }
    ];

    // Create sample employees
    for (const emp of sampleEmployees) {
        await prisma.employee.upsert({
            where: { email: emp.email },
            update: {},
            create: emp,
        });
    }

    // Seed Sample Agents with user accounts
    const agentRole = await prisma.role.findUnique({ where: { name: 'agent' } });
    const agents = [
        {
            fullName: 'Tech Recruiters Inc',
            email: 'contact@techrecruiters.com',
            phone: '+1234567001',
            company: 'Tech Recruiters Inc',
            commission: 15.0,
            password: 'agent123',
        },
        {
            fullName: 'HR Solutions Pro',
            email: 'info@hrsolutionspro.com',
            phone: '+1234567002',
            company: 'HR Solutions Pro',
            commission: 12.5,
            password: 'agent123',
        },
        {
            fullName: 'Talent Hunters',
            email: 'hello@talenthunters.com',
            phone: '+1234567003',
            company: 'Talent Hunters',
            commission: 18.0,
            password: 'agent123',
        },
    ];

    for (const agentData of agents) {
        // Create user account for agent
        const hashedPassword = await bcrypt.hash(agentData.password, 10);
        
        const user = await prisma.user.upsert({
            where: { email: agentData.email },
            update: {},
            create: {
                email: agentData.email,
                password: hashedPassword,
                fullName: agentData.fullName,
                phone: agentData.phone,
                isActive: true
            }
        });

        // Assign agent role
        if (agentRole) {
            await prisma.userRole.upsert({
                where: {
                    userId_roleId: {
                        userId: user.id,
                        roleId: agentRole.id,
                    },
                },
                update: {},
                create: {
                    userId: user.id,
                    roleId: agentRole.id,
                },
            });
        }

        // Create agent profile
        const agentId = `AGT${String(Date.now()).slice(-6)}${Math.floor(Math.random() * 100)}`;
        await prisma.agent.upsert({
            where: { email: agentData.email },
            update: {},
            create: {
                userId: user.id,
                agentId: agentId,
                fullName: agentData.fullName,
                email: agentData.email,
                phone: agentData.phone,
                company: agentData.company,
                commission: agentData.commission,
                status: 'active'
            },
        });
    }

    // Seed Sample Recruitment Jobs
    const recruitmentJobs = [
        {
            title: 'Senior Software Developer',
            description: 'Experienced developer for web applications',
            requirements: '5+ years experience, React, Node.js, MySQL',
            numberOfPosts: 3,
            salary: 80000,
            status: 'ACTIVE',
            agentId: 1, // Tech Recruiters Inc
        },
        {
            title: 'HR Manager',
            description: 'Lead HR operations and team management',
            requirements: '3+ years HR experience, leadership skills',
            numberOfPosts: 1,
            salary: 65000,
            status: 'ACTIVE',
            agentId: 2, // HR Solutions Pro
        },
        {
            title: 'Marketing Specialist',
            description: 'Digital marketing and brand management',
            requirements: '2+ years marketing experience, social media skills',
            numberOfPosts: 2,
            salary: 55000,
            status: 'ACTIVE',
            agentId: 3, // Talent Hunters
        },
    ];

    for (const job of recruitmentJobs) {
        await prisma.recruitment.upsert({
            where: {
                title_agentId: {
                    title: job.title,
                    agentId: job.agentId,
                }
            },
            update: {},
            create: job,
        });
    }

    console.log('Database seeded successfully with departments, designations, roles, permissions, superadmin user, sample employees, agents, and recruitment jobs!');
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
