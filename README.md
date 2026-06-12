# Explore X Travel AI Enterprise Upgrade

## Overview
This repository now includes a modern enterprise-ready travel platform upgrade:

- **Frontend**: Next.js + Tailwind CSS + Framer Motion admin dashboard
- **Backend**: Node.js + Express + MongoDB + JWT + WebSocket real-time sync
- **Database**: MongoDB schemas for users, bookings, packages, hotels, transports, inquiries, audit logs, and notifications
- **Deployment**: Docker Compose with frontend, backend, and MongoDB

## Folder structure

- `backend/` — Express API, MongoDB models, realtime services, auth, and admin controllers
- `frontend/` — Next.js admin dashboard and landing pages
- `infra/` — Docker Compose and Dockerfiles for production deployment

## Getting started

### Backend

1. Copy `backend/.env.example` to `backend/.env` and set values.
2. Install dependencies:
   ```bash
   cd backend
   npm install
   ```
3. Start backend:
   ```bash
   npm run dev
   ```

### Frontend

1. Copy `frontend/.env.local.example` to `frontend/.env.local`.
2. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```
3. Start frontend:
   ```bash
   npm run dev
   ```

### Docker

From the project root:

```bash
cd infra
docker compose up --build
```

## Admin pages

- Admin login: `/admin/login`
- Admin dashboard: `/admin/dashboard`

## Notes

- The backend exposes REST APIs under `/api/*`.
- Real-time updates are broadcast over Socket.io from the backend.
- AI itinerary generation is available via `/api/ai/itinerary`.

## Next steps

- Add role-based form controls to the frontend.
- Implement more dashboard panels for packages, hotels, and inquiries.
- Connect the AI endpoints to a live provider key.
- Add unit tests and CI automation.
