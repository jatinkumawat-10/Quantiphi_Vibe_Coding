# Backend Architecture Decisions

## 1. Layered Architecture (Routes → Controllers → Services → Repository)

**Decision**: Implement a 4-layer architecture.

**Reasoning**: Separates concerns cleanly:
- Routes handle HTTP plumbing
- Controllers handle request/response mapping
- Services contain pure business logic
- Repository abstracts database access

**Tradeoffs**: 
- More files/boilerplate for simple CRUD
- Worth it for testability (services can be unit tested without HTTP)
- Enables future ORM swaps without touching business logic

## 2. httpOnly Cookie for JWT Storage

**Decision**: Store JWT in httpOnly cookie with SameSite=Strict, also return in response body.

**Reasoning**: 
- httpOnly prevents XSS token theft
- SameSite=Strict prevents CSRF
- Returning in body allows header-based auth as fallback
- More secure than localStorage for MVP

**Tradeoffs**:
- Requires CORS credentials configuration
- Slightly more complex than localStorage
- Worth the security benefit

## 3. Cost Normalization at Query Time (Not Stored)

**Decision**: Compute `normalizedMonthlyCost` in the service layer, not stored in DB.

**Reasoning**:
- Avoids drift if billing cycle or cost changes
- Original values preserved as source of truth
- Minimal performance impact for <500 subscriptions

**Tradeoffs**:
- Slightly more computation per request
- No storage inconsistency risk
- Acceptable tradeoff for data integrity

## 4. Single-Tenant-Per-Account Model

**Decision**: Each user only sees their own data. No multi-tenancy in Phase 1.

**Reasoning**:
- Simplifies authorization (all queries filter by userId)
- No complex access control needed
- Can add multi-user in Phase 3 without rewrites

**Tradeoffs**:
- No shared subscriptions feature
- Acceptable for personal finance use case

## 5. Repository Pattern with Prisma

**Decision**: Dedicated repository layer for database queries.

**Reasoning**:
- Isolates Prisma from service logic
- Makes database queries testable with mocks
- Enables future ORM swaps (e.g., Drizzle, raw SQL)

**Tradeoffs**:
- Extra abstraction layer
- Worth it for maintainability at scale

## 6. Zod for Validation (Not Joi/Yup)

**Decision**: Use Zod for request validation.

**Reasoning**:
- TypeScript-first (but works with JS via schemas)
- Excellent error messages
- Schema inference capabilities
- Lightweight and fast

**Tradeoffs**:
- Newer than Joi
- Better DX and performance

## 7. Pino for Logging (Not Winston)

**Decision**: Use Pino for structured logging.

**Reasoning**:
- JSON structured logs out of the box
- Fastest Node.js logger
- pino-http for request logging
- Perfect for production observability

**Tradeoffs**:
- Less ecosystem than Winston
- Better performance and structured output

## 8. Rate Limiting on Auth Endpoints Only

**Decision**: Apply rate limiting only to `/api/auth/login` and `/api/auth/register`.

**Reasoning**:
- Prevents brute force attacks
- 10 req/min per IP is generous for legitimate use
- No impact on normal API usage

**Tradeoffs**:
- Not global rate limiting
- Sufficient for single-user MVP

## 9. Delete Endpoint Returns 501

**Decision**: Implement DELETE route but return 501 Not Implemented.

**Reasoning**:
- PRD reserves delete for later phase
- Having the route defined makes Phase 2 addition trivial
- Prevents accidental deletion during MVP

**Tradeoffs**:
- Slightly confusing for API consumers
- Clear with documentation

## 10. Cookie Parser for Multi-Method Auth

**Decision**: Support both Authorization header and cookie-based auth.

**Reasoning**:
- Flexibility for different client types
- httpOnly cookie is more secure
- Header-based works for mobile/SPA clients

**Tradeoffs**:
- Two code paths for auth extraction
- Minimal complexity overhead
