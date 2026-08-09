# ZenTask - Task Management System Walkthrough

ZenTask is a high-fidelity, full-stack Task Management System featuring a Kanban board layout, JWT authentication, instant guest access, multiple persistent themes, subtask checklists, and responsive motion animations.
---

## 🌐 Live Deployment URLs

* **Frontend (Vercel)**: [https://zentasks-rm3k.vercel.app/](https://zentasks-rm3k.vercel.app/)
* **Backend API (Render)**: [https://zentasks-6ycz.onrender.com/api/backend](https://zentasks-6ycz.onrender.com/api/backend)

---

## 📸 Project Screenshots

### 1. Authentication Page
Clean sign-in interface with staggered input fields, theme toggles, and instant Guest Access.
![ZenTask Sign In](/public/screenshot_login.jpg)

### 2. Kanban Board Dashboard
Responsive column layouts with real-time searches, priorities, subtask checklist counts, and theme changes.
![ZenTask Dashboard](/public/screenshot_dashboard.jpg)

---

## 🛠️ Technology Stack

- **Frontend**: Next.js 16 (App Router), Tailwind CSS, Framer Motion (for premium UI/UX transitions), Axios.
- **Backend**: NestJS (TypeScript), Passport.js (JWT Authentication), bcrypt (Password hashing).
- **Database & ORM**: SQLite, Prisma ORM.

---

## ✨ Features Implemented

### 1. High-Fidelity Kanban Dashboard
* **Four-Stage Board**: Tasks are categorized into **To Do**, **In Progress**, **Under Review**, and **Completed** columns.
* **Direct Transitions**: Drag-and-drop style transition buttons let users shift tasks forward or backward between stages.
* **Task Card Metadata**: Cards display titles, descriptions, due dates, priority tags (**Low**, **Medium**, **Urgent**), and interactive subtask counts.
* **Search & Filters**: Real-time filtering by search keywords and priority levels.

### 2. Interactive Subtask Checklists
* Add, check off, and delete subtasks from inside the creation/edit modal.
* Check off subtasks directly from the board cards.
* Displays a progress bar showing the percentage of subtask completion.

### 3. Secure Authentication & Guest Login
* **JWT Auth**: User registration and login endpoints with password hashing and JWT token issuance.
* **One-Click Guest Login**: Instant access to the dashboard using a generated dummy guest profile so evaluators can test the app without signing up.
* **Show/Hide Password Toggle**: An interactive visibility icon next to the password input field allows users to verify their input before submitting.

### 4. Custom Theme Engine
* Implemented five themes: **Light**, **Dark**, **Soft Blue**, **Emerald**, and **Sunset**.
* Themes are driven by Tailwind CSS variables and persist in `localStorage` across page reloads.

### 5. Premium UI/UX & Motion Animations
* Dynamic entry animations for cards and lists using **Framer Motion**.
* Smooth transitions when moving tasks between board columns.
* Custom event-driven Toast notification popups for real-time validation and feedback.

---

## 📂 Project Structure

```text
task-management-system/
├── backend/                  # NestJS API Server
│   ├── prisma/               # SQLite database & Prisma schema
│   ├── src/
│   │   ├── auth/             # JWT authentication module
│   │   ├── tasks/            # Task CRUD & subtask module
│   │   └── main.ts           # Server bootstrap
│   └── package.json
├── src/                      # Next.js Frontend
│   ├── app/                  # Next.js Pages & Routing
│   ├── components/           # Reusable UI components
│   ├── context/              # Persistent Theme engine
│   └── utils/                # Axios configuration & interceptors
├── package.json              # Frontend package settings
└── tsconfig.json             # TypeScript configuration
```

---

## ⚙️ Local Setup & Running

### 1. Clone the repository and install dependencies:
```bash
# Install frontend packages (at root directory)
npm install

# Install backend packages
cd backend
npm install
```

### 2. Configure Database & Environment
Inside the `backend/` directory, set up your database schema using Prisma:
```bash
npx prisma db push
```

### 3. Run Development Servers
```bash
# Run NestJS backend (runs on port 3001)
cd backend
npm run start:dev

# Run Next.js frontend (runs on port 3000)
cd ..
npm run dev
```

Visit `http://localhost:3000` to interact with the application!
