# Full-stack CRUD — Next.js + NestJS + PostgreSQL

A small "Tasks" app with full **C**reate / **R**ead / **U**pdate / **D**elete.

| Layer    | Tech                                   | Port | Folder       |
|----------|----------------------------------------|------|--------------|
| Frontend | Next.js (React, App Router, TypeScript)| 3000 | `frontend/`  |
| Backend  | NestJS (Node.js) + TypeORM             | 4000 | `backend/`   |
| Database | PostgreSQL 16                          | 5432 | `db/init.sql`|

## Architecture

```
 Browser ──HTTP──▶ Next.js server (SSR pages)  ──┐
    │                                            │  REST / JSON
    └────── fetch from client components ────────┼──────────▶ NestJS API ──SQL──▶ PostgreSQL
                                                 │            /api/tasks
```

* **Next.js Server Components** (`app/tasks/page.tsx`, `app/tasks/[id]/page.tsx`) call the API
  *on the server* and send ready-made HTML → fast first paint, SEO friendly.
* **Client Components** (`components/TaskForm.tsx`, `TaskActions.tsx`) handle forms/clicks in the
  browser, call the API directly, then `router.refresh()` to re-render server data.
* **NestJS** is layered: `Controller` (HTTP) → `Service` (business logic) → `Repository` (TypeORM → SQL).
  DTOs + `ValidationPipe` reject bad input with `400` before it reaches the service.

## REST API

| Method | Route            | Body                                   | Response        |
|--------|------------------|----------------------------------------|-----------------|
| GET    | `/api/tasks`     | –                                      | `200 Task[]`    |
| GET    | `/api/tasks/:id` | –                                      | `200 Task` / `404` |
| POST   | `/api/tasks`     | `{ title, description?, completed? }`  | `201 Task` / `400` |
| PATCH  | `/api/tasks/:id` | any subset of the above                | `200 Task` / `404` |
| DELETE | `/api/tasks/:id` | –                                      | `204` / `404`   |

## Frontend routes

| URL                | What it does                        |
|--------------------|-------------------------------------|
| `/`                | redirects to `/tasks`               |
| `/tasks`           | list all tasks (toggle / edit / delete) |
| `/tasks/new`       | create form                         |
| `/tasks/[id]`      | task detail                         |
| `/tasks/[id]/edit` | edit form                           |

## Run it locally

Requires Node.js 20+ and Docker (or your own PostgreSQL).

```bash
# 1. Database (creates crud_db and runs db/init.sql on first start)
docker compose up -d

# 2. Backend
cd backend
cp .env.example .env
npm install
npm run start:dev          # http://localhost:4000/api/tasks

# 3. Frontend (new terminal)
cd frontend
cp .env.example .env.local
npm install
npm run dev                # http://localhost:3000
```

No Docker? Create the DB yourself:
`createdb crud_db && psql -d crud_db -f db/init.sql` and adjust `backend/.env`.

Quick API test:
```bash
curl -X POST localhost:4000/api/tasks -H 'Content-Type: application/json' -d '{"title":"Hello"}'
curl localhost:4000/api/tasks
```

## Learning notes / next steps (system design)

1. **Migrations instead of `init.sql`** — use TypeORM migrations so schema changes are versioned.
2. **Pagination** — `GET /api/tasks?limit=20&cursor=…` (cursor > offset for large tables).
3. **Indexes** — e.g. `CREATE INDEX ON tasks (completed, created_at)` once you filter/sort.
4. **Caching** — put Redis in front of reads; invalidate on write (cache-aside pattern).
5. **Auth** — JWT with `@nestjs/passport`, then `user_id` foreign key on `tasks`.
6. **Observability** — structured logs, request IDs, a `/health` endpoint for load balancers.
7. **Scaling** — the API is stateless, so you can run N copies behind a load balancer;
   Postgres becomes the bottleneck → connection pooling (PgBouncer), read replicas.
8. **Tests** — Jest unit tests for `TasksService`, Supertest e2e tests for the controller.
