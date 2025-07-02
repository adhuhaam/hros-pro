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
    ];
    for (const desig of designations) {
        await prisma.designation.upsert({
            where: { title: desig.title },
            update: {},
            create: desig,
        });
    }

    // Seed Superadmin User
    const password = await bcrypt.hash('superadminpassword', 10);

    await prisma.user.upsert({
        where: { email: 'superadmin@yourdomain.com' },
        update: {},
        create: {
            email: 'superadmin@yourdomain.com',
            password,
            role: 'superadmin',
            employee: {
                create: {
                    firstName: 'Super',
                    lastName: 'Admin',
                    email: 'superadmin@yourdomain.com',
                },
            },
        },
    });

    console.log('Departments, Designations, and Superadmin user seeded!');
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });