# PetsCare – Backend Documentation

This document describes the **backend** of the PetsCare application: stack, structure, API routes, models, and configuration.

---

## Table of Contents

1. [Tech Stack](#tech-stack)
2. [Project Structure](#project-structure)
3. [Environment Variables](#environment-variables)
4. [Database](#database)
5. [API Routes](#api-routes)
6. [Models](#models)
7. [Middleware](#middleware)
8. [Real-time (Socket.io)](#real-time-socketio)
9. [Running the Backend](#running-the-backend)

---

## Tech Stack

| Technology | Purpose |
|------------|---------|
| **Node.js** | Runtime |
| **Express** | Web framework |
| **MongoDB** | Database (via Mongoose) |
| **JWT** | Authentication (jsonwebtoken) |
| **Socket.io** | Real-time notifications |
| **Multer** | File uploads (images, voice) |
| **Nodemailer** | Email (appointment status, admin messages) |
| **dotenv** | Environment variables |
| **express-async-handler** | Async route error handling |
| **cors** | Cross-origin requests |

---

## Project Structure

```
petsCare2025/
├── backend/
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── controllers/
│   │   ├── userController.js
│   │   ├── petController.js
│   │   ├── serviceController.js
│   │   ├── doctorController.js
│   │   ├── appointmentController.js
│   │   ├── notificationController.js
│   │   └── aiController.js    # AI FAQ, summarization, recommendations
│   ├── middlewares/
│   │   ├── authMiddleware.js  # protect, admin, doctor, doctorOrAdmin
│   │   └── errorMiddleware.js # notFound, errorHandler
│   ├── models/
│   │   ├── userModel.js
│   │   ├── petModel.js
│   │   ├── serviceModel.js
│   │   ├── doctorModel.js
│   │   ├── appointmentModel.js
│   │   └── notificationModel.js
│   ├── routes/
│   │   ├── userRoutes.js
│   │   ├── petRoutes.js
│   │   ├── serviceRoutes.js
│   │   ├── doctorRoutes.js
│   │   ├── appointmentRoutes.js
│   │   ├── notificationRoutes.js
│   │   ├── uploadRoutes.js    # images + voice
│   │   └── aiRoutes.js
│   ├── utils/
│   │   ├── generateToken.js
│   │   └── emailService.js
│   ├── data/                  # Seed data + images
│   ├── server.js              # Entry point, Express + Socket.io
│   └── seeder.js              # Seed DB
├── .env                       # Not committed; copy from .env.example
└── .env.example
```

---

## Environment Variables

Copy `.env.example` to `.env` and fill in values. **Never commit `.env`.**

| Variable | Description |
|----------|-------------|
| `NODE_ENV` | `development` or `production` |
| `PORT` | Server port (default `5000`) |
| `FRONTEND_URL` | Frontend origin for CORS/Socket (e.g. `http://localhost:5173`) |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret for signing JWT tokens |
| `ADMIN_EMAIL` | Gmail for sending emails |
| `ADMIN_EMAIL_APP_PASSWORD` | Gmail app password (not normal password) |
| `GROQ_API_KEY` | Groq API key for AI (recommended; see [GROQ_AI_INTEGRATION.md](./GROQ_AI_INTEGRATION.md)) |
| `GEMINI_API_KEY` | Optional; used if Groq not set |
| `CLINIC_ADDRESS` | Optional; shown in AI FAQ answers |
| `CLINIC_HOURS` | Optional; shown in AI FAQ answers |
| `CLOUDINARY_*` | Optional; for cloud image storage |

---

## Database

- **ORM:** Mongoose.
- **Connection:** `config/db.js` uses `process.env.MONGO_URI`.
- **Collections:** Users, Pets, Services, Doctors, Appointments, Notifications.

See [Models](#models) for schemas.

---

## API Routes

Base path: `/api`. All routes are mounted in `server.js`.

### Users – `/api/users`

| Method | Path | Access | Description |
|--------|------|--------|-------------|
| POST | `/register` | Public | Register new user |
| POST | `/login` | Public | User login |
| POST | `/logout` | Public | Logout |
| POST | `/admin/login` | Public | Admin login |
| GET | `/profile` | Protected | Get current user profile |
| PUT | `/profile` | Protected | Update user profile |

### Pets – `/api/pets`

| Method | Path | Access | Description |
|--------|------|--------|-------------|
| GET | `/` | Public | List all pets |
| GET | `/:id` | Public | Get pet by ID |
| GET | `/:id/vaccination-records` | Admin | Get vaccination records |
| POST | `/create` | Admin | Create pet |
| PUT | `/:id` | Admin | Update pet |
| DELETE | `/:id` | Admin | Delete pet |

### Services – `/api/services`

| Method | Path | Access | Description |
|--------|------|--------|-------------|
| GET | `/` | Public | List all services |
| GET | `/:id` | Public | Get service by ID |
| POST | `/create` | Admin | Create service |
| PUT | `/:id` | Admin | Update service |
| DELETE | `/:id` | Admin | Delete service |

### Doctors – `/api/doctors`

| Method | Path | Access | Description |
|--------|------|--------|-------------|
| GET | `/` | Public | List all doctors |
| GET | `/:id` | Public | Get doctor by ID |
| POST | `/create` | Admin | Create doctor |
| PUT | `/:id` | Admin | Update doctor |
| DELETE | `/:id` | Admin | Delete doctor |
| POST | `/doctorLogin` | Public | Doctor login |

### Appointments – `/api/appointment`

| Method | Path | Access | Description |
|--------|------|--------|-------------|
| POST | `/book` | Protected (user) | Book appointment |
| GET | `/all` | Admin | Get all appointments |
| GET | `/usersAppointments` | Protected (user) | Get current user's appointments |
| GET | `/doctorsAppointments` | Doctor | Get doctor's appointments |
| PUT | `/respond` | Doctor | Accept / reject / cancel (with optional rejection reason) |
| POST | `/send-email` | Admin | Send email to pet owner for an appointment |

### Notifications – `/api/notifications`

Used for in-app notifications (e.g. appointment accepted/rejected). See `notificationRoutes.js` and `notificationController.js` for exact paths and behavior.

### Uploads – `/api/uploads`

| Method | Path | Access | Description |
|--------|------|--------|-------------|
| POST | `/image` | Protected/Admin | Upload image (e.g. pet, doctor) |
| POST | `/voice` | Protected | Upload voice recording (e.g. visit notes) |

Static files: `/uploads` and `/images` are served by Express from local folders.

### AI – `/api/ai`

| Method | Path | Access | Description |
|--------|------|--------|-------------|
| POST | `/chat` | Public | FAQ chat (booking, cancel, clinic location) – uses Groq or Gemini |
| POST | `/pet-recommendations` | Public | Vaccination/care recommendations by pet type, age, breed |
| POST | `/ask-about-service` | Public | Ask a question about a specific service |
| POST | `/summarize-notes` | Doctor/Admin | Summarize visit notes for pet owner |

See [GROQ_AI_INTEGRATION.md](./GROQ_AI_INTEGRATION.md) for how Groq is integrated.

---

## Models

### User

- Fields: name, email, password (hashed), role, `isAdmin`, etc.
- Used for pet owners and admin users.

### Pet

- Fields: name, breed, species, age, vaccination records, etc.
- Can reference owner (User).

### Service

- Fields: title, description, image, etc.
- Used for “Ask about this service” AI and service listing.

### Doctor

- Fields: name, email, password, specialization, image, `isDoctor`, etc.
- Separate from User; doctors log in via `/doctorLogin`.

### Appointment

- Fields: `petOwner` (ref User), `pet` (ref Pet, optional), `petName`, `petBreed`, `doctor` (ref Doctor), `appointmentDate`, `status` (Pending/Accepted/Rejected/Cancelled), `query`, `doctorResponse`, `rejectionReason`, timestamps.
- Doctor can set `rejectionReason` when rejecting.

### Notification

- Fields: user, type, message, read status, etc.
- Pushed via Socket.io to the user’s room.

---

## Middleware

### authMiddleware.js

| Middleware | Description |
|------------|-------------|
| `protect` | Verifies JWT from `Authorization: Bearer <token>`. Attaches `req.user` or `req.doctor`. |
| `admin` | Requires `req.user` and `req.user.isAdmin`. Use after `protect` for admin-only routes. |
| `doctor` | Requires `req.doctor` and doctor record in DB. Use after `protect` for doctor-only routes. |
| `doctorOrAdmin` | Allows either doctor or admin. Use for routes like “respond to appointment” that both can access. |

### errorMiddleware.js

- `notFound`: 404 for unknown routes.
- `errorHandler`: Central error handler; returns JSON with message and status.

---

## Real-time (Socket.io)

- **Server:** Socket.io is attached to the same HTTP server as Express in `server.js`.
- **Auth:** Socket middleware verifies JWT from `auth.token` or `query.token` and sets `socket.userId`.
- **Rooms:** Each user joins room `user:${userId}`. Backend can emit to that room (e.g. appointment response) so only that user receives the event.
- **Frontend:** Uses `socket.io-client` and a `useSocket` hook to connect with the user’s token and listen for events (e.g. `appointment_response`).

---

## Running the Backend

From project root (where `server.js` or the script that runs it lives):

```bash
# Install dependencies (if not done)
npm install

# Ensure .env is set (MONGO_URI, JWT_SECRET, etc.)
# Then start the server (example; adjust to your package.json scripts)
node backend/server.js
# or
npm run server
```

- API base: `http://localhost:5000` (or your `PORT`).
- Health: `GET http://localhost:5000/` returns “petsCare API is running”.
- Socket.io connects to the same host/port; frontend must use `FRONTEND_URL` for CORS.

For full app setup (DB seed, env, scripts), see the project root `README` or setup docs.
