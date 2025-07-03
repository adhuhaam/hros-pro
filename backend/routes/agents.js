const express = require('express');
const { PrismaClient } = require('../generated/prisma');
const router = express.Router();
const prisma = new PrismaClient();

// Get all agents
router.get('/', async (req, res) => {
    try {
        const agents = await prisma.agent.findMany({
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        isActive: true,
                        lastLogin: true
                    }
                },
                candidates: {
                    select: {
                        id: true,
                        fullName: true,
                        position: true,
                        status: true,
                        appliedAt: true
                    }
                }
            }
        });

        const agentsWithStats = agents.map(agent => ({
            ...agent,
            candidateCount: agent.candidates.length,
            activeCandidates: agent.candidates.filter(c => c.status === 'pending' || c.status === 'shortlisted').length,
            hiredCandidates: agent.candidates.filter(c => c.status === 'hired').length
        }));

        res.json(agentsWithStats);
    } catch (error) {
        console.error('Error fetching agents:', error);
        res.status(500).json({ error: 'Failed to fetch agents' });
    }
});

// Get agent by ID
router.get('/:id', async (req, res) => {
    try {
        const agent = await prisma.agent.findUnique({
            where: { id: parseInt(req.params.id) },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        isActive: true,
                        lastLogin: true
                    }
                },
                candidates: {
                    orderBy: { appliedAt: 'desc' }
                }
            }
        });

        if (!agent) {
            return res.status(404).json({ error: 'Agent not found' });
        }

        res.json(agent);
    } catch (error) {
        console.error('Error fetching agent:', error);
        res.status(500).json({ error: 'Failed to fetch agent' });
    }
});

// Create new agent
router.post('/', async (req, res) => {
    try {
        const {
            fullName,
            email,
            phone,
            company,
            commission,
            status = 'active',
            createUser = false,
            password
        } = req.body;

        // Check if agent already exists
        const existingAgent = await prisma.agent.findFirst({
            where: { email }
        });

        if (existingAgent) {
            return res.status(400).json({ error: 'Agent with this email already exists' });
        }

        const agent = await prisma.$transaction(async (tx) => {
            let userId = null;

            // Create user account if requested
            if (createUser && password) {
                const bcrypt = require('bcryptjs');
                const hashedPassword = await bcrypt.hash(password, 10);

                const user = await tx.user.create({
                    data: {
                        email,
                        password: hashedPassword,
                        fullName,
                        phone,
                        isActive: true
                    }
                });
                userId = user.id;

                // Assign agent role
                const agentRole = await tx.role.findUnique({
                    where: { name: 'agent' }
                });

                if (agentRole) {
                    await tx.userRole.create({
                        data: {
                            userId,
                            roleId: agentRole.id
                        }
                    });
                }
            }

            const agentId = `AGT${String(Date.now()).slice(-6)}`;

            const newAgent = await tx.agent.create({
                data: {
                    userId,
                    agentId,
                    fullName,
                    email,
                    phone,
                    company,
                    commission: commission ? parseFloat(commission) : null,
                    status
                }
            });

            return newAgent;
        });

        res.status(201).json({
            message: 'Agent created successfully',
            agentId: agent.id,
            agentCode: agent.agentId
        });
    } catch (error) {
        console.error('Error creating agent:', error);
        res.status(500).json({ error: 'Failed to create agent' });
    }
});

// Update agent
router.put('/:id', async (req, res) => {
    try {
        const {
            fullName,
            email,
            phone,
            company,
            commission,
            status
        } = req.body;
        const agentId = parseInt(req.params.id);

        const updateData = {};

        if (fullName) updateData.fullName = fullName;
        if (phone) updateData.phone = phone;
        if (company) updateData.company = company;
        if (commission !== undefined) updateData.commission = parseFloat(commission);
        if (status) updateData.status = status;

        if (email) {
            // Check if email is already taken by another agent
            const existingAgent = await prisma.agent.findFirst({
                where: {
                    email,
                    id: { not: agentId }
                }
            });

            if (existingAgent) {
                return res.status(400).json({ error: 'Email already taken by another agent' });
            }
            updateData.email = email;
        }

        const agent = await prisma.agent.update({
            where: { id: agentId },
            data: updateData
        });

        res.json({ message: 'Agent updated successfully' });
    } catch (error) {
        console.error('Error updating agent:', error);
        res.status(500).json({ error: 'Failed to update agent' });
    }
});

// Delete agent
router.delete('/:id', async (req, res) => {
    try {
        const agentId = parseInt(req.params.id);

        // Check if agent has candidates
        const candidateCount = await prisma.candidate.count({
            where: { agentId }
        });

        if (candidateCount > 0) {
            return res.status(400).json({
                error: 'Cannot delete agent with existing candidates',
                candidateCount
            });
        }

        await prisma.$transaction(async (tx) => {
            // Delete agent
            await tx.agent.delete({
                where: { id: agentId }
            });
        });

        res.json({ message: 'Agent deleted successfully' });
    } catch (error) {
        console.error('Error deleting agent:', error);
        res.status(500).json({ error: 'Failed to delete agent' });
    }
});

// Get agent candidates
router.get('/:id/candidates', async (req, res) => {
    try {
        const agentId = parseInt(req.params.id);
        const { status, position } = req.query;

        const whereClause = { agentId };
        if (status) whereClause.status = status;
        if (position) whereClause.position = { contains: position };

        const candidates = await prisma.candidate.findMany({
            where: whereClause,
            orderBy: { appliedAt: 'desc' }
        });

        res.json(candidates);
    } catch (error) {
        console.error('Error fetching agent candidates:', error);
        res.status(500).json({ error: 'Failed to fetch agent candidates' });
    }
});

// Create candidate for agent
router.post('/:id/candidates', async (req, res) => {
    try {
        const agentId = parseInt(req.params.id);
        const {
            jobId,
            fullName,
            email,
            phone,
            position,
            experience,
            resume,
            notes
        } = req.body;

        // Validate required fields
        if (!jobId || !fullName || !email || !position) {
            return res.status(400).json({ 
                error: 'Missing required fields: jobId, fullName, email, and position are required' 
            });
        }

        // Check if agent exists
        const agent = await prisma.agent.findUnique({
            where: { id: agentId }
        });

        if (!agent) {
            return res.status(404).json({ error: 'Agent not found' });
        }

        // Check if job exists
        const job = await prisma.recruitment.findUnique({
            where: { id: parseInt(jobId) }
        });

        if (!job) {
            return res.status(404).json({ error: 'Job/Recruitment not found' });
        }

        // Check if candidate already exists for this job
        const existingCandidate = await prisma.candidate.findFirst({
            where: {
                email,
                jobId: parseInt(jobId)
            }
        });

        if (existingCandidate) {
            return res.status(400).json({ 
                error: 'Candidate with this email already applied for this job' 
            });
        }

        const candidate = await prisma.candidate.create({
            data: {
                agentId,
                jobId: parseInt(jobId),
                fullName,
                email,
                phone,
                position,
                experience: experience ? parseInt(experience) : null,
                resume,
                notes,
                status: 'pending'
            },
            include: {
                job: true,
                agent: true
            }
        });

        res.status(201).json({
            message: 'Candidate created successfully',
            candidateId: candidate.id,
            candidate
        });
    } catch (error) {
        console.error('Error creating candidate:', error);
        res.status(500).json({ error: 'Failed to create candidate' });
    }
});

// Update candidate
router.put('/candidates/:candidateId', async (req, res) => {
    try {
        const candidateId = parseInt(req.params.candidateId);
        const {
            fullName,
            email,
            phone,
            position,
            experience,
            resume,
            notes,
            status
        } = req.body;

        const updateData = {};

        if (fullName) updateData.fullName = fullName;
        if (email) updateData.email = email;
        if (phone) updateData.phone = phone;
        if (position) updateData.position = position;
        if (experience !== undefined) updateData.experience = parseInt(experience);
        if (resume) updateData.resume = resume;
        if (notes) updateData.notes = notes;
        if (status) updateData.status = status;

        const candidate = await prisma.candidate.update({
            where: { id: candidateId },
            data: updateData
        });

        res.json({ message: 'Candidate updated successfully' });
    } catch (error) {
        console.error('Error updating candidate:', error);
        res.status(500).json({ error: 'Failed to update candidate' });
    }
});

// Delete candidate
router.delete('/candidates/:candidateId', async (req, res) => {
    try {
        const candidateId = parseInt(req.params.candidateId);

        await prisma.candidate.delete({
            where: { id: candidateId }
        });

        res.json({ message: 'Candidate deleted successfully' });
    } catch (error) {
        console.error('Error deleting candidate:', error);
        res.status(500).json({ error: 'Failed to delete candidate' });
    }
});

// Get agent statistics
router.get('/:id/stats', async (req, res) => {
    try {
        const agentId = parseInt(req.params.id);

        const candidates = await prisma.candidate.findMany({
            where: { agentId },
            select: { status: true, appliedAt: true }
        });

        const stats = {
            totalCandidates: candidates.length,
            pending: candidates.filter(c => c.status === 'pending').length,
            shortlisted: candidates.filter(c => c.status === 'shortlisted').length,
            rejected: candidates.filter(c => c.status === 'rejected').length,
            hired: candidates.filter(c => c.status === 'hired').length,
            thisMonth: candidates.filter(c => {
                const now = new Date();
                const applied = new Date(c.appliedAt);
                return applied.getMonth() === now.getMonth() &&
                    applied.getFullYear() === now.getFullYear();
            }).length
        };

        res.json(stats);
    } catch (error) {
        console.error('Error fetching agent stats:', error);
        res.status(500).json({ error: 'Failed to fetch agent statistics' });
    }
});

module.exports = router; 