# PeoplePay360 - Level 1 Foundation

This is the initial monorepo scaffold for the PeoplePay360 HR and payroll platform.

## Included

- `apps/web`: Next.js App Router frontend with TypeScript and a light/dark dashboard shell.
- `apps/api`: NestJS REST API with validation, CORS, rate limiting, Prisma, and a health endpoint.
- `apps/api/prisma`: PostgreSQL schema for the first domain foundation: users, roles, permissions, employees, contracts, and working schedules.
- `packages/contracts`: shared TypeScript enums intended for API/frontend contracts.
- `docker-compose.yml`: local PostgreSQL service.

## Start locally

1. Copy `.env.example` to `.env` and replace local secrets.
2. Install workspace packages with `pnpm install`.
3. Start PostgreSQL with `docker compose up -d postgres`.
4. Create the database schema with `pnpm --filter @peoplepay360/api prisma:migrate`.
5. Start both applications with `pnpm dev`.

The web app runs on `http://localhost:3000`; the API health check runs at `http://localhost:4000/api/health`.

## Level 1 boundary

This foundation intentionally does not implement login, payroll calculations, or full CRUD yet. It establishes the project structure and the core data relationships required before those modules are built.
