# College Discovery API

A production-grade REST API for college search, comparison, and admission prediction. Built for the AI Software Engineer Internship — Track B (Backend Engineer).

## Tech Stack

- **Framework**: NestJS (TypeScript)
- **Database**: PostgreSQL
- **ORM**: Prisma v5
- **Auth**: JWT (passport-jwt)
- **Validation**: class-validator + class-transformer
- **Docs**: Swagger/OpenAPI (auto-generated)

## Architecture Decisions

### Why NestJS over Next.js API Routes
NestJS provides module isolation, dependency injection, decorators-based routing, and global middleware — all production patterns that Next.js API routes don't offer natively.

### Cursor-based Pagination (not offset)
Offset pagination breaks when rows are inserted/deleted mid-query. Cursor-based pagination (by `id`) is stable and performant at scale.

### PostgreSQL Full-Text Search
Uses a `tsvector` column generated from `name`, `city`, `state`, and `description` with GIN index for fast ranked search — not naive `LIKE '%query%'` which can't use indexes.

### Consistent Response Envelope
Every response wraps data in `{ success, data, timestamp }`. Every error wraps in `{ success: false, statusCode, error, timestamp, path }`. Frontend never needs to guess the shape.

### Comparison Matrix
The compare endpoint doesn't just return raw data — it computes a `comparisonMatrix` array that highlights which college wins on each metric (`isBest: true`), saving the frontend from doing this logic.

### Admission Chance Algorithm
The predictor classifies colleges into `HIGH / MEDIUM / LOW / REACH` based on where the user's rank falls within the `openingRank → closingRank` range:
- `> 50%` of range remaining → HIGH
- `20–50%` remaining → MEDIUM
- `0–20%` remaining → LOW
- Beyond closing rank → REACH

## API Endpoints

```
POST /api/v1/auth/register       Register new user
POST /api/v1/auth/login          Login, returns JWT

GET  /api/v1/colleges            List colleges (search + filter + cursor pagination)
GET  /api/v1/colleges/filters    Get distinct states, cities, types for filter UI
GET  /api/v1/colleges/:slug      Full college detail (courses, placements, reviews)

GET  /api/v1/compare?ids=1,2,3   Side-by-side comparison + matrix
GET  /api/v1/predictor           Rank-based college admission prediction
```

### Query Params — `/api/v1/colleges`
| Param | Type | Description |
|---|---|---|
| `q` | string | Full-text search across name, city, state, description |
| `type` | enum | IIT, NIT, IIIT, DEEMED, PRIVATE, GOVERNMENT, CENTRAL |
| `state` | string | Filter by state |
| `city` | string | Filter by city |
| `minFees` | number | Minimum annual fees (₹) |
| `maxFees` | number | Maximum annual fees (₹) |
| `minRating` | number | Minimum rating (0–5) |
| `sortBy` | enum | rating_desc, fees_asc, fees_desc, name_asc, established_desc |
| `cursor` | number | Last college ID (cursor pagination) |
| `limit` | number | Page size (default 20, max 100) |

### Query Params — `/api/v1/predictor`
| Param | Type | Description |
|---|---|---|
| `exam` | enum | JEE_MAIN, JEE_ADVANCED, NEET, CAT, GATE, XAT, CLAT |
| `rank` | number | Your rank |
| `category` | enum | GENERAL, OBC, SC, ST, EWS (default GENERAL) |
| `limit` | number | Max results (default 20) |

## Database Schema

```
College     ← has many → Course, Placement, Review, ExamCutoff, SavedCollege
User        ← has many → Review, SavedCollege
```

Indexes on: `type`, `state`, `totalRating`, `minFees`, `(exam, category, closingRank)`, `searchVector` (GIN).

## Local Setup

```bash
# 1. Install dependencies
npm install

# 2. Set up .env
cp .env.example .env
# Edit DATABASE_URL to point to your PostgreSQL instance

# 3. Run migrations
npx prisma migrate dev

# 4. Seed data
npm run db:seed

# 5. Start server
npm run start:dev

# Swagger docs at http://localhost:3000/docs
```

## Swagger Docs

Interactive API docs available at `/docs` when the server is running.

## Deployment

Deploy to Railway or Render:
1. Set `DATABASE_URL` environment variable (Neon PostgreSQL recommended)
2. Set `JWT_SECRET`
3. Build command: `npm run build`
4. Start command: `npm run start:prod`
