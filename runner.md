# Cliper - Setup & Run Guide

This guide contains all commands needed to run the Cliper project (Backend + Frontend).

## Prerequisites

Make sure you have the following installed:
- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **Docker** and **Docker Compose** (optional, for containerized setup) - [Download](https://www.docker.com/)
- **npm** (comes with Node.js)
- **Git** (optional, for cloning the repository)

## Project Structure

```
.
├── backend/                 # Express.js API server
│   ├── Dockerfile
│   ├── index.js
│   ├── package.json
│   ├── .env                 # Environment variables (create this)
│   ├── controller/
│   ├── models/
│   └── routes/
├── frontend/                # React + Vite frontend
│   ├── Dockerfile
│   ├── package.json
│   ├── vite.config.js
│   ├── .env                 # Environment variables (create this)
│   ├── src/
│   ├── components/
│   ├── pages/
│   └── public/
├── docker-compose.yml       # Docker Compose configuration
└── README.md
```

---

## Option 1: Running with Docker Compose (Recommended - Easiest)

### 1. Setup Environment Variables

Create `.env` files for both services:

**Backend** - `backend/.env`
```
# Add your environment variables here
# Example:
# MONGO_URI=your_mongodb_connection_string
# PORT=5000
```

**Frontend** - `frontend/.env`
```
# Add your environment variables here
# Example:
# VITE_API_URL=http://localhost:5000
```

### 2. Build and Run

```bash
# Navigate to project root directory
cd "New folder"

# Build and start all services
docker-compose up --build

# Or run in background (detached mode)
docker-compose up -d --build
```

### 3. Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000

### 4. View Logs

```bash
# View all logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f backend
docker-compose logs -f frontend
```

### 5. Stop Services

```bash
# Stop all running services
docker-compose down

# Stop services and remove volumes (clean up)
docker-compose down -v
```

---

## Option 2: Running Manually (Local Development)

### Prerequisites for Manual Setup
- Node.js and npm installed
- MongoDB running locally or accessible via connection string
- Port 5000 (backend) and port 5173 (frontend) available

### Backend Setup

#### 1. Navigate to Backend Directory
```bash
cd backend
```

#### 2. Create Environment File
Create a `backend/.env` file:
```
MONGO_URI=mongodb://localhost:27017/cliper
PORT=5000
# Add other variables as needed
```

#### 3. Install Dependencies
```bash
npm install
```

#### 4. Run the Backend Server

**Option A: Simple start**
```bash
node index.js
```

**Option B: Development mode with auto-reload (using nodemon)**
```bash
npm install --save-dev nodemon
npx nodemon index.js
```

Backend should start on http://localhost:5000

### Frontend Setup

#### 1. Navigate to Frontend Directory
```bash
cd frontend
```

#### 2. Create Environment File
Create a `frontend/.env` file:
```
VITE_API_URL=http://localhost:5000
# Add other variables as needed
```

#### 3. Install Dependencies
```bash
npm install
```

#### 4. Run the Development Server

```bash
# Start Vite development server
npm run dev

# Access at http://localhost:5173
```

#### 5. Build for Production

```bash
npm run build
```

Output will be in the `dist/` directory.

#### 6. Preview Production Build

```bash
npm run preview
```

#### 7. Lint Code

```bash
npm run lint
```

---

## Full Manual Setup Command Sequence

### Terminal 1 - Backend
```bash
cd backend
npm install
npm run dev
# or: npx nodemon index.js
```

### Terminal 2 - Frontend
```bash
cd frontend
npm install
npm run dev
```

Then open your browser to:
- Frontend: http://localhost:5173
- Backend: http://localhost:5000

---

## Stopping the Application

### If running with Docker Compose
```bash
docker-compose down
```

### If running manually
- **Frontend**: Press `Ctrl + C` in the Terminal 2 (Vite)
- **Backend**: Press `Ctrl + C` in the Terminal 1 (Node.js)

---

## Useful Commands Reference

### Backend Commands
```bash
# Install dependencies
npm install

# Start server (requires nodemon to be installed)
npx nodemon index.js

# Start server (direct)
node index.js

# Install nodemon locally for development
npm install --save-dev nodemon

# Install a specific package
npm install package-name

# Remove a package
npm uninstall package-name
```

### Frontend Commands
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Lint code
npm run lint

# Install a specific package
npm install package-name

# Remove a package
npm uninstall package-name
```

### Docker Commands
```bash
# Build images and start containers
docker-compose up --build

# Start containers (without rebuilding)
docker-compose up

# Start in background
docker-compose up -d

# Stop containers
docker-compose down

# Stop and remove volumes
docker-compose down -v

# View container logs
docker-compose logs -f

# Execute command in running container
docker-compose exec backend sh
docker-compose exec frontend sh

# Rebuild specific service
docker-compose build backend
docker-compose build frontend
```

---

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running locally or update `MONGO_URI` in `.env`
- Check connection string format

### Port Already in Use
- Backend: Change PORT in `backend/.env`
- Frontend: Modify `vite.config.js` port setting or use `npm run dev -- --port 3000`

### Dependencies Not Installing
```bash
# Clear npm cache
npm cache clean --force

# Remove node_modules and reinstall
rm -r node_modules package-lock.json
npm install
```

### Docker Issues
```bash
# Remove unused Docker images and containers
docker system prune

# Force rebuild without cache
docker-compose build --no-cache
```

### Port Issues in Windows
If using Windows and ports are blocked:
```powershell
# Check what's using port 5000
netstat -ano | findstr :5000

# Check what's using port 5173
netstat -ano | findstr :5173

# Kill process by PID (replace PID with actual process id)
taskkill /PID <PID> /F
```

---

## Environment Variables Checklist

- [ ] Created `backend/.env`
- [ ] Created `frontend/.env`
- [ ] Added required variables to both `.env` files
- [ ] Updated API URL in frontend `.env` to match backend

---

## Quick Start Summary

**Fastest way to run the project:**

```bash
# Using Docker Compose
docker-compose up --build

# OR manually
# Terminal 1
cd backend && npm install && npx nodemon index.js

# Terminal 2
cd frontend && npm install && npm run dev
```

Access:
- Frontend: http://localhost:5173
- Backend: http://localhost:5000

---

**Last Updated**: 2026-03-03
