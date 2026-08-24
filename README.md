# Subscription Tracker & Renewal Dashboard

A personal finance web application that lets a single authenticated user track recurring SaaS and streaming subscriptions, monitor monthly cash-flow burn, and get visibility into upcoming renewals — with the ability to "pause" a subscription and instantly simulate the savings without deleting historical data.

## Features

### Core Features (Phase 1)
- **Authentication** — Register/login with JWT-based auth (httpOnly cookies)
- **Subscription Management** — Add, view, and toggle active/paused status
- **Dashboard Metrics** — Real-time monthly burn rate and upcoming renewals count
- **Renewing Soon Badge** — Visual flag for subscriptions renewing within 7 days
- **Optimistic UI** — Instant toggle feedback with server sync

### New Features
- **Annual vs Monthly Nudge** — Flags subscriptions where switching billing cycle would save money (shows estimated yearly savings)
- **Notes Field** — Free-text notes per subscription (e.g., "shared with roommate," "cancel before trial ends")
- **Cost-Splitting** — Mark subscriptions as shared and split cost among people (displays per-person cost)
- **Free Trial Tracker** — Track free trials with end dates and reminders before conversion to paid

## Tech Stack

### Frontend
| Layer | Choice | Version |
|-------|--------|---------|
| Build tool | Vite | 5.4.x |
| UI library | React (JS) | 18.3.x |
| Styling | Emotion | 11.13.x |
| Icons | MUI Icons | 5.16.x |
| Routing | React Router DOM | 6.26.x |
| HTTP client | Axios | 1.7.x |
| Forms | React Hook Form | 7.53.x |
| Date handling | date-fns | 3.6.x |

### Backend
| Layer | Choice | Version |
|-------|--------|---------|
| Runtime | Node.js | 20.x LTS |
| Framework | Express | 4.19.x |
| ORM | Prisma | 5.19.x |
| Database | PostgreSQL | 16.x |
| Auth | bcrypt + jsonwebtoken | 5.1.x / 9.0.x |
| Validation | Zod | 3.23.x |
| Logging | Pino | 9.x |

## Project Structure

```
├── backend/
│   ├── .env.example
│   ├── package.json
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── schema.sql
│   ├── docs/
│   │   ├── specs.md
│   │   └── decisions.md
│   └── src/
│       ├── server.js
│       ├── app.js
│       ├── config/ (env.js, db.js)
│       ├── modules/
│       │   ├── auth/ (routes, controller, service, validation)
│       │   └── subscriptions/ (routes, controller, service, repository, validation)
│       ├── middlewares/ (authMiddleware, errorHandler, validateRequest)
│       ├── utils/ (costNormalizer, dateCalculator, logger)
│       └── routes/ (index.js)
├── frontend/
│   ├── .env.example
│   ├── package.json
│   ├── vite.config.js
│   ├── docs/
│   │   ├── specs.md
│   │   └── decisions.md
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── theme/ (tokens, theme.js, ThemeProvider, globalStyles)
│       ├── components/ (Button, TextField, Select, DatePicker, Layout/)
│       ├── modules/
│       │   ├── auth/ (context, api, pages, components)
│       │   └── subscriptions/ (api, hooks, components, pages)
│       ├── utils/ (apiClient, formatters, constants)
│       └── router/ (routes.jsx)
└── .gitignore
```

## Getting Started

### Prerequisites
- Node.js 20.x LTS
- PostgreSQL 16.x
- npm

### 1. Clone & Install

```bash
# Clone the repository
git clone <repository-url>
cd subscription-tracker

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Database Setup

```bash
# Create PostgreSQL database
createdb subscription_tracker

# Configure backend/.env
cp .env.example .env
# Edit .env with your PostgreSQL credentials

# Run Prisma migration
cd backend
npx prisma generate
npx prisma migrate dev --name init
```

### 3. Start Development Servers

```bash
# Terminal 1 - Backend (port 5000)
cd backend
npm run dev

# Terminal 2 - Frontend (port 5173)
cd frontend
npm run dev
```

### 4. Access the Application

Open [http://localhost:5173](http://localhost:5173) in your browser.

## API Endpoints

### Authentication
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | Public | Create account |
| POST | `/api/auth/login` | Public | Login |
| POST | `/api/auth/logout` | Protected | Logout |
| GET | `/api/auth/me` | Protected | Get profile |

### Subscriptions
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/subscriptions` | Protected | List all (annotated) |
| POST | `/api/subscriptions` | Protected | Create subscription |
| PATCH | `/api/subscriptions/:id` | Protected | Update subscription |
| PATCH | `/api/subscriptions/:id/status` | Protected | Toggle status |
| GET | `/api/subscriptions/metrics` | Protected | Get metrics |
| DELETE | `/api/subscriptions/:id` | Protected | Reserved (501) |

## Features Detail

### 1. Annual vs Monthly Nudge

**Backend Logic** (`costNormalizer.js`):
- For MONTHLY subscriptions, estimates yearly cost = cost × 12
- Applies 17% average discount for yearly billing
- Shows savings if switching to yearly (minimum $1/month threshold)

**UI**: Green badge showing "Save $X/yr" with tooltip explaining savings.

### 2. Notes Field

**Schema**: `notes TEXT` column in subscriptions table.

**UI**: Truncated notes displayed below service name (full text on hover).

### 3. Cost-Splitting

**Schema**: `is_shared BOOLEAN`, `split_count INT`, `split_note VARCHAR(255)`.

**UI**: 
- Purple "Split Nx" badge
- Displays per-person cost in the Cost column
- Full note on hover

### 4. Free Trial Tracker

**Schema**: `is_trial BOOLEAN`, `trial_end_date DATE`, `trial_reminder_days INT`.

**UI**:
- Trial badge showing status (active, ending soon, ended)
- "Trials Ending" metric tile in Topbar
- Configurable reminder window (default 3 days)

## Design Decisions

See `docs/decisions.md` in both frontend and backend for detailed rationale on:
- Architecture choices (layered backend, module-based frontend)
- Styling approach (Emotion with design tokens)
- State management (React Context + custom hooks)
- Business logic placement (server-side only)
- Security implementations

## Environment Variables

### Backend (`backend/.env`)
```
PORT=5000
NODE_ENV=development
DATABASE_URL=postgresql://user:pass@localhost:5432/subscription_tracker
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=1d
CORS_ORIGIN=http://localhost:5173
BCRYPT_SALT_ROUNDS=12
```

### Frontend (`frontend/.env`)
```
VITE_API_BASE_URL=http://localhost:5000/api
```

## License

MIT
