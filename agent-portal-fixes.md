# Agent Portal Database Fixes

## Summary of Issues Fixed

### 1. **Missing `jobId` in Candidate Creation**
- **Problem**: The Candidate model requires both `agentId` and `jobId`, but the API endpoint was missing `jobId` parameter
- **Fix**: Added `jobId` validation, job existence check, and duplicate candidate prevention

### 2. **Schema Mismatches in Seed Data**
- **Agent Model Issues**:
  - Used `name` instead of `fullName`
  - Used `commissionRate` instead of `commission`  
  - Had non-existent `address` field
  - Missing user account creation for agents
  - Missing `agentId` generation
- **Fix**: Updated seed data to match schema, created user accounts with agent role, and generated proper agent IDs

### 3. **Recruitment Model Issues**
- **Problem**: Seed data used fields like `title`, `description`, `requirements`, `salary` which don't exist
- **Fix**: Updated to use correct fields: `position`, `department`, `status`, `numberOfPosts`

### 4. **Missing Employee ID Generation**
- **Problem**: `employeeId` field was not being generated when creating employees
- **Fix**: Added automatic employee ID generation in format `EMP001`, `EMP002`, etc.

### 5. **Case Sensitivity with MySQL**
- **Problem**: Using `mode: 'insensitive'` which doesn't work with MySQL
- **Fix**: Removed the insensitive mode flag

### 6. **Enhanced Agent Authentication**
- **Problem**: No agent-specific data returned on login
- **Fix**: Added agent profile data to login response including agentId, company, commission

### 7. **Added Missing API Endpoints**
- Added `/api/agents/profile` - Get logged-in agent's profile
- Added `/api/agents/:id/jobs` - Get available jobs for candidate assignment
- Added JWT authentication middleware for protected routes

## Agent Portal Login Credentials

After running the seed script, you can login as an agent using:

```
Email: contact@techrecruiters.com
Password: agent123

Email: info@hrsolutionspro.com  
Password: agent123

Email: hello@talenthunters.com
Password: agent123
```

## API Usage Examples

### 1. Agent Login
```bash
POST /api/auth/login
{
  "email": "contact@techrecruiters.com",
  "password": "agent123"
}
```

### 2. Get Agent Profile
```bash
GET /api/agents/profile
Authorization: Bearer <token>
```

### 3. Create Candidate
```bash
POST /api/agents/:agentId/candidates
{
  "jobId": 1,
  "fullName": "John Doe",
  "email": "john.doe@example.com",
  "phone": "+1234567890",
  "position": "Senior Software Developer",
  "experience": 5,
  "resume": "path/to/resume.pdf",
  "notes": "Strong React experience"
}
```

### 4. Get Jobs for Candidate Assignment
```bash
GET /api/agents/:agentId/jobs
```

## Database Reset Instructions

If you need to reset the database:

```bash
cd backend
npx prisma migrate reset
npx prisma db seed
```

This will recreate all tables and seed data with the fixes applied.