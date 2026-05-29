This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

## Script to run test 
```
  "test": "vitest run",
  "test:watch": "vitest",
```

### db seed script

`node src/lib/seed/script.ts`

## Tech Stack

### Frontend
- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS
- ShadCN UI

### Backend
- Next.js API Routes
- Prisma ORM
- PostgreSQL (Supabase)

### Testing
- Vitest
- React Testing Library

LLD - HLD
![System Architecture (HLD & LLD)](docs/lld-hld-trade-offs.png)



## Trade-offs & Design Decisions

### Tech Stack

* Chose Next.js App Router for a simple full-stack setup with API routes and frontend in a single codebase.
* Used Prisma as the ORM to provide type-safe database access and improve developer productivity.
* Used Supabase Postgres as a managed database solution to avoid infrastructure overhead.

### Architecture Decisions
* For renderign large employee list I have used offset pased pagination.
* Kept the architecture relatively simple and easy to understand since the assignment scope was limited.
* Separated concerns into API routes, services, database layer, and UI components to keep the codebase maintainable and scalable.
* Added reusable UI components and utility functions to reduce duplication.

### Performance Considerations

* Optimized database queries and add indexing strategies based on production usage patterns and frequently used filters.
*  Used server-side rendering (SSR) the pages for fast retrieval and quick TTFB load.
* Minimized unnecessary client-side state and data fetching where possible.
* Structured components to support future optimizations such as pagination, caching, and filtering.


### Testing

* Focused on covering core business logic and utility functions.
* Followed TDD - Test Driven Development.
* Given the time constraints, end-to-end and integration testing were not implemented but would be added in a production environment.

### What I Would Improve With More Time

* Add authentication and role-based access control.
* * For further improvement for rendering large data list we can use virtualization or use cursor based pagination.
* * Instead of real time insights we can cache the insights and run schedule to recalculate insights based on aggregations at some intervals.
* * Add employee details view page which can show details view of the employee
* Implement pagination, sorting, and advanced filtering for employee records.
* Add comprehensive integration and E2E tests.
* Introduce structured logging, monitoring, and error tracking we can use sentry, gcp logs, data dog etc.
* Improve API validation and error handling consistency.
* Add CI/CD quality checks and automated deployment workflows.
