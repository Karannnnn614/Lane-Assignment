# Lane Assignment - Client-Server Architecture

This project is now organized with a clean client-server architecture for easy deployment.

## Project Structure

```
├── client/          # React frontend (Vite + TypeScript)
├── server/          # Node.js backend (Express + MongoDB)
├── package.json     # Root package with convenience scripts
└── README.md        # This file
```

## Development Setup

1. **Install dependencies for both client and server:**

   ```bash
   npm run install:all
   ```

2. **Start development servers:**
   ```bash
   npm run dev
   ```
   This runs both client (port 5173) and server (port 3001) concurrently.

## Deployment Options

### Option 1: Separate Deployment (Recommended)

**Frontend (Client) - Deploy to Netlify:**

1. Navigate to `/client` folder
2. Connect your GitHub repo to Netlify
3. Set build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Environment variable: `VITE_API_URL=https://your-backend-url.com`

**Backend (Server) - Deploy to Render/Railway:**

1. Navigate to `/server` folder
2. Connect your GitHub repo to Render/Railway
3. Set environment variables:
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `CLIENT_URL`: Your Netlify frontend URL
   - `PORT`: (automatically set by platform)

### Option 2: Full-Stack Platform

Deploy both client and server together on platforms like:

- Vercel (with serverless functions)
- DigitalOcean App Platform
- AWS Amplify

## Environment Variables

**Client (.env):**

```
VITE_API_URL=http://localhost:3001  # Development
VITE_API_URL=https://your-api.com   # Production
```

**Server (.env):**

```
MONGODB_URI=mongodb://localhost:27017/lane-feedback  # Development
MONGODB_URI=mongodb+srv://...                        # Production (MongoDB Atlas)
CLIENT_URL=http://localhost:5173                     # Development
CLIENT_URL=https://your-frontend.netlify.app         # Production
PORT=3001
```

## Quick Deploy Commands

```bash
# Build client for production
npm run build:client

# Install server dependencies
npm run install:server

# Start server in production
npm run start:server
```
