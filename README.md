<div align="center">

  <h1>Aelxand - My Portfolio</h1>

  <a href="https://github.com/aelxand/aelxand"><img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="GitHub"></a>
  <a href="https://github.com/aelxand/aelxand"><img src="https://img.shields.io/badge/Hono-000000?style=for-the-badge&logo=hono&logoColor=white" alt="Hono"></a>
  <a href="https://github.com/aelxand/aelxand"><img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite"></a>
  <a href="https://github.com/aelxand/aelxand"><img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript"></a>
  <a href="https://github.com/aelxand/aelxand"><img src="https://img.shields.io/badge/Bun-000000?style=for-the-badge&logo=bun&logoColor=white" alt="Bun"></a>

  A modern full-stack template combining React frontend with Hono backend, optimized for serverless deployment on Vercel.

  <h3>🚀 See it live at:</h3>
  <a href="https://aelxand.vercel.app/">
    <img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel">
  </a>

  <br>
  <br>

</div>

## Table of Contents

- [Features](#features)
- [Development](#development)
- [Project Structure](#project-structure)
- [API Routes](#api-routes)
- [Frontend-Backend Communication](#frontend-backend-communication)
- [Deployment](#deployment)

## Features

- **React 19** with TypeScript and Vite for fast development
- **Hono** ultra-fast web framework for serverless APIs
- **Bun** for lightning-fast package management and runtime
- **Hot Module Replacement** for both frontend and backend
- **CORS** configured for seamless frontend-backend communication
- **Proxy configuration** for development environment
- **Serverless-ready** for Vercel deployment

## Development

### Install all dependencies

```bash
# backend
bun i

# frontend
cd client
bun i
```

### Start

```bash
bun dev    # runs both backend and frontend

# or separately

bun api    # backend
bun client # frontend
```

This will start:
- Backend server at http://localhost:3000
- Frontend development server at http://localhost:5173

## Project Structure

```
aelxand/
├── api/                   # Hono backend
│   └── index.ts           # Main server file with API routes
├── client/                # React frontend
│   ├── src/
│   │   ├── App.tsx        # Main React component
│   │   └── ...            # Other React files
│   ├── vite.config.ts     # Vite configuration with proxy
│   └── package.json       # Frontend dependencies
├── src/                   # Hono backend
│   ├── routes             # API route handlers
│   │   ├── ping.ts        # Route handler for /api/ping
│   │   └── ...            # Other route files
│   └── index.ts           # Main server file
├── api-server.ts          # Entry point for the API server
├── package.json           # Root dependencies and scripts
├── bun.lock               # Bun lockfile
└── README.md              # This file
```

## API Routes

The frontend is configured to proxy API requests to the backend during development. All requests to `/api/*` on the frontend will be automatically forwarded to the backend server.

### Usage

```
...
├── src/                   # Hono backend
│   ├── routes             # API route handlers
│   │   ├── ping.ts        # Route handler for /api/ping
│   │   └── ...            # Other route files
│   └── index.ts           # Main server file
...
```

The backend includes a sample API endpoint:

- `GET /ping` - Returns `{ "message": "pong" }`

Add new API routes in `src/index.ts`:

```typescript
// Import your route handler
import { usersRouter } from './routes/users'

// Mount the router
app.route('/', usersRouter)
```

Then, on `src/routes/users.ts` you can define the route handlers:

```typescript
app.get('/api/users', (c) => {
  return c.json({ users: [] })
})
```

## Deployment

### Vercel

Set build configuration:
- **Build Command**: `cd client && bun run build`
- **Output Directory**: `client/dist`
- **Install Command**: `bun install && cd client && bun install`

The project is configured for serverless deployment with automatic API routing.

## Technologies Used

- **Frontend**: React 19, TypeScript, Vite
- **Backend**: Hono, Bun runtime
- **Styling**: CSS with Vite processing
- **Development**: Hot reload, proxy configuration
- **Deployment**: Serverless-ready for Vercel

## Contributing

This is a portfolio project, not intended for contributions. If you have any suggestions or improvements, feel free to open an issue or pull request. Thanks!

## License

This project is licensed under the MIT License