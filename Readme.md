# React HRoS Pro - HR Management System

A comprehensive HR Management System with Employee Portal and Agent Portal for recruitment.

## Setup Instructions

### Backend Setup
1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file from example:
   ```bash
   cp .env.example .env
   ```

4. Update the database connection in `.env`:
   ```
   DATABASE_URL="mysql://your_user:your_password@localhost:3306/hrms_db"
   ```

5. Run database migrations:
   ```bash
   npx prisma migrate dev
   ```

6. Seed the database:
   ```bash
   npx prisma db seed
   ```

7. Start the backend server:
   ```bash
   npm start
   ```

### Frontend Setup
1. Navigate to web directory:
   ```bash
   cd web
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## Agent Portal
- Login at `/agent-login` 
- Use credentials from `agent-portal-fixes.md`
- Manage candidates and job applications
