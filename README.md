# ZenTask - Premium Task Management System

ZenTask is a high-fidelity, full-stack Task Management System featuring a responsive Kanban board, persistent multi-theme support, guest login, and nested subtask progress tracking.

Built with **Next.js 14 (App Router)** and **NestJS**, it follows strict UI/UX best practices: accessible color contrast, fluid micro-interactions, responsive layouts, and zero-configuration SQLite persistence for local development.

---

## 🌟 Features

- **Responsive Kanban Board**: Four stages of task progress (`To Do`, `In Progress`, `Under Review`, `Completed`). Seamless, instant task transitions.
- **Subtask Checklist**: Add, toggle, and delete subtasks from a checklist inside each task. Progress is tracked via a visual indicator bar on the dashboard.
- **Guest Login**: Instantly experience the application using the "Guest Login" feature. Creates a secure, temporary profile automatically.
- **Persistent Themes**: Switch between five beautiful color palettes (`Light`, `Dark`, `Soft Blue`, `Emerald`, `Sunset`). The choice is persisted across page refreshes.
- **API Request Validation**: Global NestJS validation pipes ensuring all payload fields strictly match schema requirements.
- **Clean Monorepo Structure**: Separate `frontend/` and `backend/` folders for modularity.

---

## 📁 Project Structure

```text
task-management-system/
├── frontend/                  # Next.js (App Router, Tailwind CSS v4, TypeScript)
│   ├── src/
│   │   ├── app/               # App Router pages and root layout
│   │   ├── components/        # Reusable UI elements (Toast, etc.)
│   │   ├── context/           # Theme provider state management
│   │   └── utils/             # Axios API client setup with JWT interceptors
├── backend/                   # NestJS (Prisma ORM, JWT, SQLite/PostgreSQL)
│   ├── prisma/                # Schema definitions & database migrations
│   ├── src/
│   │   ├── auth/              # Registration, Login, and Guest Login module
│   │   ├── prisma/            # Global database connection provider
│   │   └── tasks/             # Tasks CRUD controller, services, and DTOs
```

---

## 🚀 Running Locally

Ensure you have [Node.js (LTS)](https://nodejs.org/) installed.

### 1. Set Up and Start the Backend
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. The database is pre-configured with SQLite. Run migrations and client generation:
   ```bash
   npx prisma migrate dev --name init
   npx prisma generate
   ```
3. Start the NestJS development server:
   ```bash
   npm run start:dev
   ```
   The backend API will run on: `http://localhost:3001/api`.

### 2. Set Up and Start the Frontend
1. Open a new terminal window and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Start the Next.js development server:
   ```bash
   npm run dev
   ```
   Open your browser and navigate to: `http://localhost:3000`.

---

## 🌐 Deploying & Hosting

### 1. Frontend: Deploy to Vercel
Since the frontend is built using Next.js, it is optimized for Vercel deployment:
1. Push your project folder to **GitHub/GitLab**.
2. Log in to the [Vercel Dashboard](https://vercel.com/) and click **Add New** > **Project**.
3. Select your repository.
4. Set the **Root Directory** to `frontend`.
5. Add the Environment Variable:
   - `NEXT_PUBLIC_API_URL`: Your hosted backend URL (e.g., `https://your-backend.onrender.com/api`).
6. Click **Deploy**.

### 2. Backend: Deploy to Render / Railway
Since NestJS requires a persistent server container, you can host it on Render or Railway:
1. Log in to the [Render Dashboard](https://render.com/) and create a **Web Service**.
2. Select your repository and set the **Root Directory** to `backend`.
3. Set the **Build Command** to `npm install && npm run build` and **Start Command** to `node dist/main.js`.
4. Provide a PostgreSQL database URL from Supabase, Neon, or Render PostgreSQL. In Prisma 7, connection URLs are defined in `prisma.config.ts`.
5. Add the environment variables:
   - `DATABASE_URL`: Your PostgreSQL connection string.
   - `JWT_SECRET`: A secure string for generating token payloads.
   - `PORT`: `10000` (Render will set this automatically).
