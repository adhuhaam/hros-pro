const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('./generated/prisma');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('HRMS Backend API is running');
});

app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        const token = jwt.sign(
            { userId: user.id, role: user.role, email: user.email },
            process.env.JWT_SECRET || 'devsecret',
            { expiresIn: '1d' }
        );
        res.json({ token });
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
                departmentId,
                designationId,
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
                departmentId,
                designationId,
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

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app;