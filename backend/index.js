const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('./generated/prisma');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Import routes
const usersRouter = require('./routes/users');
const rolesRouter = require('./routes/roles');
const agentsRouter = require('./routes/agents');
const settingsRouter = require('./routes/settings');

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// User management routes
app.use('/api/users', usersRouter);
app.use('/api/roles', rolesRouter);
app.use('/api/agents', agentsRouter);
app.use('/api/settings', settingsRouter);

app.get('/', (req, res) => {
    res.send('HRMS Backend API is running');
});

app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await prisma.user.findUnique({
            where: { email },
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

        if (!user || !user.isActive) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Update last login
        await prisma.user.update({
            where: { id: user.id },
            data: { lastLogin: new Date() }
        });

        const roles = user.userRoles.map(ur => ur.role.name);
        const userType = user.employee ? 'employee' : user.agent ? 'agent' : 'user';

        const token = jwt.sign(
            {
                userId: user.id,
                roles: roles,
                userType: userType,
                email: user.email,
                fullName: user.fullName
            },
            process.env.JWT_SECRET || 'devsecret',
            { expiresIn: '1d' }
        );

        res.json({
            token,
            user: {
                id: user.id,
                email: user.email,
                fullName: user.fullName,
                roles: roles,
                userType: userType
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Employees CRUD API
app.get('/api/employees', async (req, res) => {
    try {
        const employees = await prisma.employee.findMany({
            include: { department: true, designation: true, user: true },
            orderBy: { id: 'desc' },
        });
        res.json(employees);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to fetch employees' });
    }
});

app.post('/api/employees', async (req, res) => {
    try {
        const { fullName, email, phone, address, dob, departmentId, designationId, dateOfJoining } = req.body;
        const employee = await prisma.employee.create({
            data: {
                fullName,
                email,
                phone,
                address,
                dob: dob ? new Date(dob) : null,
                departmentId: departmentId ? Number(departmentId) : null,
                designationId: designationId ? Number(designationId) : null,
                dateOfJoining: dateOfJoining ? new Date(dateOfJoining) : null,
            },
        });
        res.status(201).json(employee);
    } catch (err) {
        console.error(err);
        res.status(400).json({ message: 'Failed to add employee', error: err.message });
    }
});

app.put('/api/employees/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { fullName, email, phone, address, dob, departmentId, designationId, dateOfJoining } = req.body;
        const employee = await prisma.employee.update({
            where: { id: Number(id) },
            data: {
                fullName,
                email,
                phone,
                address,
                dob: dob ? new Date(dob) : null,
                departmentId: departmentId ? Number(departmentId) : null,
                designationId: designationId ? Number(designationId) : null,
                dateOfJoining: dateOfJoining ? new Date(dateOfJoining) : null,
            },
        });
        res.json(employee);
    } catch (err) {
        console.error(err);
        res.status(400).json({ message: 'Failed to update employee', error: err.message });
    }
});

app.delete('/api/employees/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.employee.delete({ where: { id: Number(id) } });
        res.json({ message: 'Employee deleted' });
    } catch (err) {
        console.error(err);
        res.status(400).json({ message: 'Failed to delete employee', error: err.message });
    }
});

// Recruitment CRUD API
app.get('/api/recruitment', async (req, res) => {
    try {
        const jobs = await prisma.recruitment.findMany({ orderBy: { id: 'desc' } });
        res.json(jobs);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to fetch jobs' });
    }
});

app.post('/api/recruitment', async (req, res) => {
    try {
        const { position, department, status, postedAt, closedAt, numberOfPosts } = req.body;
        const job = await prisma.recruitment.create({
            data: {
                position,
                department,
                status,
                postedAt: postedAt ? new Date(postedAt) : new Date(),
                closedAt: closedAt ? new Date(closedAt) : null,
                applicants: '', // Placeholder
                numberOfPosts: numberOfPosts ? Number(numberOfPosts) : 1,
            },
        });
        res.status(201).json(job);
    } catch (err) {
        console.error(err);
        res.status(400).json({ message: 'Failed to add job', error: err.message });
    }
});

app.put('/api/recruitment/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { position, department, status, postedAt, closedAt, numberOfPosts } = req.body;
        const job = await prisma.recruitment.update({
            where: { id: Number(id) },
            data: {
                position,
                department,
                status,
                postedAt: postedAt ? new Date(postedAt) : new Date(),
                closedAt: closedAt ? new Date(closedAt) : null,
                numberOfPosts: numberOfPosts ? Number(numberOfPosts) : 1,
            },
        });
        res.json(job);
    } catch (err) {
        console.error(err);
        res.status(400).json({ message: 'Failed to update job', error: err.message });
    }
});

app.delete('/api/recruitment/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.recruitment.delete({ where: { id: Number(id) } });
        res.json({ message: 'Job deleted' });
    } catch (err) {
        console.error(err);
        res.status(400).json({ message: 'Failed to delete job', error: err.message });
    }
});

// Departments and Designations endpoints
app.get('/api/departments', async (req, res) => {
    try {
        const departments = await prisma.department.findMany({ orderBy: { name: 'asc' } });
        res.json(departments);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to fetch departments' });
    }
});

app.get('/api/designations', async (req, res) => {
    try {
        const designations = await prisma.designation.findMany({ orderBy: { title: 'asc' } });
        res.json(designations);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to fetch designations' });
    }
});

// Health check endpoint for system status
app.get('/api/health', async (req, res) => {
    try {
        // Test database connection
        await prisma.$queryRaw`SELECT 1`;
        res.json({
            status: 'healthy',
            timestamp: new Date().toISOString(),
            database: 'connected'
        });
    } catch (err) {
        console.error('Health check failed:', err);
        res.status(503).json({
            status: 'unhealthy',
            timestamp: new Date().toISOString(),
            database: 'disconnected',
            error: err.message
        });
    }
});

// Dashboard Analytics Endpoints
app.get('/api/dashboard/employee-status', async (req, res) => {
    try {
        const totalEmployees = await prisma.employee.count();
        const activeEmployees = await prisma.employee.count({
            where: {
                dateOfJoining: {
                    not: null
                }
            }
        });
        const newHires = await prisma.employee.count({
            where: {
                dateOfJoining: {
                    gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
                }
            }
        });
        const terminatedEmployees = totalEmployees - activeEmployees;

        res.json({
            total: totalEmployees,
            active: activeEmployees,
            newHires: newHires,
            terminated: terminatedEmployees
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to fetch employee status' });
    }
});

app.get('/api/dashboard/turnover-ratio', async (req, res) => {
    try {
        const currentYear = new Date().getFullYear();
        const monthlyData = [];

        for (let month = 0; month < 12; month++) {
            const startOfMonth = new Date(currentYear, month, 1);
            const endOfMonth = new Date(currentYear, month + 1, 0);

            // Employees who joined this month
            const newHires = await prisma.employee.count({
                where: {
                    dateOfJoining: {
                        gte: startOfMonth,
                        lte: endOfMonth
                    }
                }
            });

            // Total employees at the end of this month
            const totalEmployees = await prisma.employee.count({
                where: {
                    dateOfJoining: {
                        lte: endOfMonth
                    }
                }
            });

            // Calculate turnover ratio (new hires / total employees * 100)
            const turnoverRatio = totalEmployees > 0 ? (newHires / totalEmployees) * 100 : 0;

            monthlyData.push({
                month: startOfMonth.toLocaleString('default', { month: 'short' }),
                newHires,
                totalEmployees,
                turnoverRatio: Math.round(turnoverRatio * 100) / 100
            });
        }

        res.json(monthlyData);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to fetch turnover ratio' });
    }
});

app.get('/api/dashboard/department-distribution', async (req, res) => {
    try {
        const employees = await prisma.employee.findMany({
            include: {
                department: true
            }
        });

        const departmentCounts = {};
        employees.forEach(emp => {
            const deptName = emp.department?.name || 'Unassigned';
            departmentCounts[deptName] = (departmentCounts[deptName] || 0) + 1;
        });

        const distribution = Object.entries(departmentCounts).map(([name, count]) => ({
            name,
            count
        }));

        res.json(distribution);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to fetch department distribution' });
    }
});

// Additional analytics endpoint for more detailed insights
app.get('/api/dashboard/analytics', async (req, res) => {
    try {
        const currentYear = new Date().getFullYear();
        const currentMonth = new Date().getMonth();

        // Get total employees
        const totalEmployees = await prisma.employee.count();

        // Get employees by year of joining
        const employeesByYear = await prisma.employee.groupBy({
            by: ['dateOfJoining'],
            _count: {
                id: true
            },
            where: {
                dateOfJoining: {
                    not: null
                }
            }
        });

        // Calculate average tenure
        const employeesWithJoiningDate = await prisma.employee.findMany({
            where: {
                dateOfJoining: {
                    not: null
                }
            },
            select: {
                dateOfJoining: true
            }
        });

        const totalTenureDays = employeesWithJoiningDate.reduce((sum, emp) => {
            const daysSinceJoining = Math.floor((new Date() - new Date(emp.dateOfJoining)) / (1000 * 60 * 60 * 24));
            return sum + daysSinceJoining;
        }, 0);

        const averageTenureDays = employeesWithJoiningDate.length > 0 ? totalTenureDays / employeesWithJoiningDate.length : 0;
        const averageTenureMonths = Math.round(averageTenureDays / 30);

        // Get recent hires (last 6 months)
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const recentHires = await prisma.employee.count({
            where: {
                dateOfJoining: {
                    gte: sixMonthsAgo
                }
            }
        });

        // Get department growth
        const departmentGrowth = await prisma.employee.groupBy({
            by: ['departmentId'],
            _count: {
                id: true
            }
        });

        // Get department names for the grouped results
        const departmentIds = departmentGrowth.map(dept => dept.departmentId).filter(id => id !== null);
        const departments = await prisma.department.findMany({
            where: {
                id: {
                    in: departmentIds
                }
            }
        });

        const departmentMap = {};
        departments.forEach(dept => {
            departmentMap[dept.id] = dept.name;
        });

        res.json({
            totalEmployees,
            averageTenureMonths,
            recentHires,
            departmentGrowth: departmentGrowth.map(dept => ({
                name: departmentMap[dept.departmentId] || 'Unassigned',
                count: dept._count.id
            }))
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to fetch analytics' });
    }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app;