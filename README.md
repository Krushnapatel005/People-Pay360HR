# PeoplePay360 - Level 1 Foundation

This is the initial monorepo scaffold for the PeoplePay360 HR and payroll platform.

## Included

- `apps/web`: Next.js App Router frontend with TypeScript and a light/dark dashboard shell.
- `apps/api`: NestJS REST API with validation, CORS, rate limiting, Prisma, and a health endpoint.
- `apps/api/prisma`: PostgreSQL schema for the first domain foundation: users, roles, permissions, employees, contracts, and working schedules.
- `packages/contracts`: shared TypeScript enums intended for API/frontend contracts.
- `docker-compose.yml`: local PostgreSQL service.

## Start locally

1. Copy `.env.example` to `.env` in `apps/api` and replace local secrets.
2. Install workspace packages with `pnpm install`.
3. Ensure MongoDB is running locally (default: `mongodb://localhost:27017`).
4. Run the seed script: `pnpm --filter @peoplepay360/api seed`.
5. Start both applications with `pnpm dev`.

The web app runs on `http://localhost:3000`; the API health check runs at `http://localhost:4000/api/health`.

## Demo Credentials (Local Only)

| Role | Demo Name | Email | Password |
|---|---|---|---|
| Employee | Aarav Mehta | employee@peoplepay360.local | Employee@123 |
| HR Manager | Maya Shah | hr.manager@peoplepay360.local | HRManager@123 |
| Time Off Admin | Rohan Patel | timeoff.admin@peoplepay360.local | TimeOff@123 |
| HR Payroll User | Kavya Rao | payroll.user@peoplepay360.local | PayrollUser@123 |
| HR Payroll Admin| Nisha Verma | payroll.admin@peoplepay360.local | PayrollAdmin@123 |
| Admin | System Admin | admin@peoplepay360.local | Admin@123 |
