# Smart AI-Powered Learning Management System (LMS)

A full-stack MERN application featuring AI-powered quiz generation, adaptive learning recommendations, real-time progress tracking, and role-based dashboards.

## Tech Stack

- **Frontend:** React.js, Redux Toolkit, Tailwind CSS, Recharts, Socket.io Client
- **Backend:** Node.js, Express.js, JWT, Socket.io
- **Database:** MongoDB with Mongoose ODM
- **AI:** OpenAI API for quiz generation & learning recommendations
- **Media:** Cloudinary for file/video uploads

## Features

- **Authentication** — JWT-based auth with role-based access (Student, Instructor, Admin)
- **Course Management** — Create, edit, publish courses with modules and lessons
- **AI Quiz Generation** — Auto-generate quizzes from any topic using OpenAI
- **Adaptive Learning** — AI-powered personalized recommendations & performance analysis
- **Real-Time Progress** — Live progress tracking via Socket.io
- **Student Dashboard** — Enrolled courses, quiz history, AI recommendations
- **Instructor Dashboard** — Course analytics, student monitoring, quiz management
- **Admin Dashboard** — User management, platform analytics, instructor approvals

## Project Structure

```
├── server/                  # Backend
│   ├── config/              # DB & Cloudinary config
│   ├── controllers/         # Route handlers
│   ├── middleware/           # Auth, error handler, upload
│   ├── models/              # Mongoose schemas
│   ├── routes/              # API routes
│   ├── services/            # AI service (OpenAI)
│   ├── sockets/             # Socket.io handlers
│   └── server.js            # Entry point
├── client/                  # Frontend
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── pages/           # Page components
│   │   ├── store/           # Redux store & slices
│   │   └── utils/           # API & socket utilities
│   └── index.html
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- OpenAI API key
- Cloudinary account (optional, for media uploads)

### Backend Setup

```bash
cd server
npm install
cp .env.example .env
# Edit .env with your credentials
npm run dev
```

### Frontend Setup

```bash
cd client
npm install
npm run dev
```

### Environment Variables

Copy `server/.env.example` to `server/.env` and fill in:

| Variable | Description |
|---|---|
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret key for JWT tokens |
| `OPENAI_API_KEY` | OpenAI API key for AI features |
| `CLOUDINARY_*` | Cloudinary credentials for media |
| `CLIENT_URL` | Frontend URL (default: http://localhost:5173) |

## API Endpoints

### Auth
- `POST /api/auth/register` — Register user
- `POST /api/auth/login` — Login
- `GET /api/auth/me` — Get current user
- `PUT /api/auth/profile` — Update profile

### Courses
- `GET /api/courses` — List published courses
- `GET /api/courses/:id` — Get course details
- `POST /api/courses` — Create course (Instructor)
- `PUT /api/courses/:id` — Update course (Instructor)
- `POST /api/courses/:id/enroll` — Enroll in course (Student)

### Quizzes
- `POST /api/quizzes/generate` — AI generate quiz (Instructor)
- `POST /api/quizzes/:id/submit` — Submit quiz (Student)
- `GET /api/quizzes/attempts/my` — Get quiz history

### Progress
- `POST /api/progress/lesson-complete` — Mark lesson complete
- `GET /api/progress/recommendations` — AI recommendations
- `GET /api/progress/analysis` — AI performance analysis

### Admin
- `GET /api/admin/users` — List users
- `PUT /api/admin/users/:id/approve` — Approve instructor
- `GET /api/admin/analytics` — Platform analytics
