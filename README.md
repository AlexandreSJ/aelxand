# React Hono Template

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Hono](https://img.shields.io/badge/Hono-000000?style=for-the-badge&logo=hono&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Bun](https://img.shields.io/badge/Bun-000000?style=for-the-badge&logo=bun&logoColor=white)

A modern full-stack template combining React frontend with Hono backend, optimized for serverless deployment on Vercel.

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

#frontend
cd client
bun i
```

### Start both frontend and backend:

```bash
bun dev
```

This will start:
- Backend server at http://localhost:3000
- Frontend development server at http://localhost:5173

### Start individually:

```bash
# Backend only
bun api

# Frontend only
bun client
```

## Project Structure

```
react-hono-template/
├── api/                   # Hono backend
│   └── index.ts           # Main server file with API routes
├── client/                # React frontend
│   ├── src/
│   │   ├── App.tsx        # Main React component
│   │   └── ...            # Other React files
│   ├── vite.config.ts     # Vite configuration with proxy
│   └── package.json       # Frontend dependencies
├── package.json           # Root dependencies and scripts
└── README.md              # This file
```

## API Routes

The backend includes a sample API endpoint:

- `GET /ping` - Returns `{ "message": "pong" }`

Add new API routes in `api/`:

```typescript
app.get('/api/users', (c) => {
  return c.json({ users: [] })
})
```

## Frontend-Backend Communication

The frontend uses a proxy configuration to forward API requests:

```typescript
// Frontend ~ Automatically proxied to backend /api
fetch('/api/ping')

// Backend receives
GET /ping
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

## License

This project is licensed under the MIT License