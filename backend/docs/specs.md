# Backend Specifications

## Overview

Express.js REST API for the Subscription Tracker & Renewal Dashboard. Uses Prisma ORM with PostgreSQL, JWT authentication, and Zod validation.

## Architecture

### Layered Architecture
```
Routes → Controllers → Services → Repository (Prisma)
```

- **Routes**: Define API endpoints and middleware chains
- **Controllers**: Handle HTTP request/response, delegate to services
- **Services**: Business logic (cost normalization, date calculation, aggregation)
- **Repository**: Database queries via Prisma ORM

### Module Structure
Each feature module (`auth`, `subscriptions`) contains:
- `*.routes.js` - Route definitions
- `*.controller.js` - Request handlers
- `*.service.js` - Business logic
- `*.validation.js` - Zod schemas
- `*.repository.js` - Database queries (subscriptions only)

## API Endpoints

### Authentication
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | Public | Create account |
| POST | `/api/auth/login` | Public | Get JWT token |
| POST | `/api/auth/logout` | Protected | Clear cookie |
| GET | `/api/auth/me` | Protected | Get profile |

### Subscriptions
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/subscriptions` | Protected | List all (annotated) |
| POST | `/api/subscriptions` | Protected | Create subscription |
| PATCH | `/api/subscriptions/:id/status` | Protected | Toggle status |
| GET | `/api/subscriptions/metrics` | Protected | Get burn rate + count |
| DELETE | `/api/subscriptions/:id` | Protected | Reserved (501) |

## Business Logic

### Cost Normalization (Cost Uniformity Engine)
- `MONTHLY` → cost (as-is)
- `YEARLY` → cost / 12
- Result rounded to 2 decimal places
- Used only for aggregate metrics; original values preserved in DB

### Date Calculation (Date Intersect Calculator)
- `daysRemaining` = renewalDate - currentDate (whole days)
- `isRenewingSoon` = daysRemaining >= 0 && daysRemaining <= 7
- Time portions reset for accurate date comparison

### Burn Rate Aggregation
- Sums `normalizedMonthlyCost` across all ACTIVE subscriptions
- Paused subscriptions excluded from calculation
- Enables real-time savings simulation on toggle

## Security

- JWT tokens via httpOnly cookies (SameSite=Strict)
- bcrypt password hashing (12 salt rounds)
- Rate limiting on auth endpoints (10 req/min)
- CORS restricted to frontend origin
- Helmet security headers
- Zod validation on all inputs
- Ownership verification on all subscription operations

## Error Handling

Standard error response:
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable message"
  }
}
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 5000 |
| `NODE_ENV` | Environment | development |
| `DATABASE_URL` | PostgreSQL URL | Required |
| `JWT_SECRET` | Token signing secret | Required |
| `JWT_EXPIRES_IN` | Token expiration | 1d |
| `CORS_ORIGIN` | Frontend URL | Required |
| `BCRYPT_SALT_ROUNDS` | Hash rounds | 12 |
