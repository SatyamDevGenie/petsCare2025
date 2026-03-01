# PetsCare – Frontend Documentation

This document describes the **frontend** of the PetsCare application: stack, structure, routing, state management, API layer, and theming.

---

## Table of Contents

1. [Tech Stack](#tech-stack)
2. [Project Structure](#project-structure)
3. [Environment](#environment)
4. [Routing](#routing)
5. [State Management (Redux)](#state-management-redux)
6. [API Layer](#api-layer)
7. [Theming (Dark / Light / Classic)](#theming-dark--light--classic)
8. [Key Components](#key-components)
9. [Pages](#pages)
10. [Real-time (Socket.io)](#real-time-socketio)
11. [Running the Frontend](#running-the-frontend)

---

## Tech Stack

| Technology | Purpose |
|------------|---------|
| **React 18** | UI library |
| **Vite** | Build tool and dev server |
| **React Router v6** | Client-side routing |
| **Redux Toolkit** | Global state (auth, appointments, services, doctors, pets, notifications) |
| **Axios** | HTTP client for API calls |
| **Tailwind CSS** | Styling |
| **react-toastify** | Toast notifications |
| **Socket.io Client** | Real-time notifications |
| **ThemeContext** | Light / Dark / Classic theme switching |

---

## Project Structure

```
petsCare2025/frontend/
├── public/
├── src/
│   ├── api/
│   │   ├── api.js         # Axios instance + getAuthConfig()
│   │   ├── ai.js          # AI: chat, summarize, pet-recommendations, askAboutService
│   │   └── upload.js      # Image and voice upload helpers
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.jsx      # Nav, theme switcher, user menu
│   │   │   ├── Layout.jsx      # Wrapper: Header + Outlet + AiChatWidget
│   │   │   └── ProtectedRoute.jsx
│   │   ├── common/
│   │   │   ├── Button.jsx
│   │   │   ├── Card.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Modal.jsx
│   │   │   └── Spinner.jsx
│   │   ├── admin/
│   │   │   └── SendEmailModal.jsx
│   │   ├── SummarizeNotesModal.jsx
│   │   └── AiChatWidget.jsx     # FAQ chatbot (uses /api/ai/chat)
│   ├── context/
│   │   └── ThemeContext.jsx    # theme, setTheme, persisted in localStorage
│   ├── hooks/
│   │   └── useSocket.js        # Socket.io connection with auth token
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Services.jsx
│   │   ├── ServiceDetail.jsx   # “Ask about this service” AI
│   │   ├── Doctors.jsx
│   │   ├── DoctorDetail.jsx
│   │   ├── Pets.jsx
│   │   ├── PetDetail.jsx
│   │   ├── petowner/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── BookAppointment.jsx
│   │   │   ├── MyAppointments.jsx
│   │   │   └── Notifications.jsx
│   │   ├── doctor/
│   │   │   ├── DoctorDashboard.jsx
│   │   │   └── DoctorAppointments.jsx
│   │   └── admin/
│   │       ├── AdminDashboard.jsx
│   │       ├── AllAppointments.jsx
│   │       ├── PetsManage.jsx
│   │       ├── ServicesManage.jsx
│   │       └── DoctorsManage.jsx
│   ├── store/
│   │   ├── index.js            # configureStore
│   │   └── slices/
│   │       ├── authSlice.js
│   │       ├── appointmentSlice.js
│   │       ├── notificationSlice.js
│   │       ├── serviceSlice.js
│   │       ├── doctorSlice.js
│   │       └── petSlice.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css               # Tailwind + theme CSS variables
├── index.html
├── package.json
├── tailwind.config.js
└── vite.config.js
```

---

## Environment

- **Vite:** use `import.meta.env.VITE_*` for env vars.
- **API base URL:** `VITE_API_URL` in `.env` (e.g. `http://localhost:5000/api`). Default in code is `/api` (relative to same host).

Example `.env` in frontend (if needed):

```env
VITE_API_URL=http://localhost:5000/api
```

---

## Routing

All routes are defined in `App.jsx` under a single `<Layout />` (header + outlet).

| Path | Component | Access |
|------|-----------|--------|
| `/` | Home | Public |
| `/login` | Login | Public |
| `/register` | Register | Public |
| `/services` | Services | Public |
| `/services/:id` | ServiceDetail | Public |
| `/doctors` | Doctors | Public |
| `/doctors/:id` | DoctorDetail | Public |
| `/pets` | Pets | Public |
| `/pets/:id` | PetDetail | Public |
| `/dashboard` | PetOwner Dashboard | User only |
| `/dashboard/book` | Book Appointment | User only |
| `/dashboard/appointments` | My Appointments | User only |
| `/dashboard/notifications` | Notifications | User only |
| `/doctor` | Doctor Dashboard | Doctor only |
| `/doctor/appointments` | Doctor Appointments | Doctor only |
| `/admin` | Admin Dashboard | Admin only |
| `/admin/appointments` | All Appointments | Admin only |
| `/admin/pets` | Pets Manage | Admin only |
| `/admin/services` | Services Manage | Admin only |
| `/admin/doctors` | Doctors Manage | Admin only |
| `*` | Navigate to `/` | Fallback |

**ProtectedRoute** wraps role-specific routes and redirects to `/login` (or appropriate page) if the user is not logged in or doesn’t have the required role (`user`, `doctor`, `admin`).

---

## State Management (Redux)

Store is configured in `store/index.js` with these slices:

| Slice | Purpose |
|-------|---------|
| `auth` | User/doctor token, profile, login, register, logout |
| `appointments` | List, book, respond, send email, user/doctor appointments |
| `notifications` | In-app notifications (e.g. from Socket) |
| `services` | List services, single service |
| `doctors` | List doctors, single doctor |
| `pets` | List pets, single pet, CRUD (admin) |

Typical usage: `useSelector` to read state, thunks (or direct `api` + `dispatch`) for async actions. Token is stored in state and often in `localStorage` for persistence (see `authSlice`).

---

## API Layer

### api.js

- **`api`:** Axios instance with `baseURL: import.meta.env.VITE_API_URL || '/api'`, JSON headers.
- **`getAuthConfig(getState)`:** Returns `{ headers: { Authorization: 'Bearer <token>' } }` from Redux state. Use in thunks for protected endpoints.

### ai.js

- **`sendAiChat(message)`** → `POST /ai/chat` (FAQ).
- **`summarizeVisitNotes(notes, getState)`** → `POST /ai/summarize-notes` (doctor/admin).
- **`getPetRecommendations(petType, age, breed)`** → `POST /ai/pet-recommendations`.
- **`askAboutService(serviceId, question)`** → `POST /ai/ask-about-service`.

### upload.js

- Image and voice upload helpers to `/api/uploads/image` and `/api/uploads/voice` (or similar). Used by forms (e.g. Book Appointment for voice, admin for images).

---

## Theming (Dark / Light / Classic)

- **ThemeContext** (`context/ThemeContext.jsx`): provides `theme` and `setTheme` (`'light' | 'dark' | 'classic'`). Value is persisted in `localStorage` under `petscare_theme` and applied to `document.documentElement` as `data-theme`.
- **index.css:** defines CSS variables for each theme (`--bg-main`, `--bg-card`, `--text-primary`, `--text-muted`, `--border-color`, etc.) and utility classes (e.g. `theme-bg-main`, `theme-text`). Global overrides for Tailwind classes (e.g. `text-slate-900`, `bg-white`) under `html[data-theme="dark"]` and `html[data-theme="classic"]` so existing components follow the theme.
- **Header:** theme switcher dropdown (Light / Dark / Classic) that calls `setTheme`.

---

## Key Components

| Component | Description |
|-----------|-------------|
| **Layout** | Wraps all routes: header + main (Outlet) + AiChatWidget. Uses theme classes for background and text. |
| **Header** | Logo, nav links (Home, Services, Doctors, Pets), theme switcher, Sign in / Get started or user menu (Dashboard, Book, Appointments, Notifications, Sign out). Role badge shown for logged-in user. |
| **ProtectedRoute** | Checks auth and role; redirects if not allowed. |
| **AiChatWidget** | Floating button that opens FAQ chat; calls `sendAiChat` from `api/ai.js`. |
| **SummarizeNotesModal** | Doctor/admin: summarize visit notes (and optionally voice) via `summarizeVisitNotes`. |
| **SendEmailModal** | Admin: send email to pet owner for an appointment. |
| **Card, Button, Input, Modal, Spinner** | Reusable UI; Card/Input use theme-aware classes where applicable. |

---

## Pages

- **Home:** Hero, stats, features, how it works, services/doctors/pets links, testimonial, CTA, footer (full-width; sticks to bottom with flex).
- **Login / Register:** Forms that dispatch auth actions and redirect.
- **Services / ServiceDetail:** List services; detail page includes “Ask about this service” (AI) via `askAboutService`.
- **Doctors / DoctorDetail:** List and detail for doctors.
- **Pets / PetDetail:** List and detail for pets (public).
- **Pet owner:** Dashboard, Book Appointment (pet, doctor, date, notes/voice/language), My Appointments, Notifications.
- **Doctor:** Doctor dashboard, appointments list, accept/reject/cancel with optional rejection reason; can summarize notes (and voice).
- **Admin:** Dashboard, All Appointments (send email, view details), Pets Manage, Services Manage, Doctors Manage.

---

## Real-time (Socket.io)

- **useSocket:** Connects to the backend Socket.io server with the current user’s token (from Redux). Joins user-specific room on the server.
- **Events:** Backend emits to `user:<userId>` on events such as appointment accepted/rejected. Frontend listens and updates Redux (e.g. notifications, appointments) or shows toasts.

---

## Running the Frontend

From `frontend/`:

```bash
npm install
npm run dev
```

- Dev server: typically `http://localhost:5173`.
- Build: `npm run build`. Preview: `npm run preview`.

Ensure backend is running and `VITE_API_URL` (or proxy) points to the API so all `/api/*` requests reach the backend.
