# ERP-HR

ERP-HR dashboard built with Next.js 14 App Router, TypeScript, TailwindCSS, next-intl and Supabase.

## Features

- Supabase authentication and CRUD modules for employees, attendance, payroll and more.
- Internationalization (English/Arabic) with RTL support.
- Strong security defaults: headers, CSP, validation and rate limiting.

## Tech Stack

- Next.js 14 + TypeScript
- TailwindCSS
- next-intl
- Supabase (@supabase/ssr)
- Playwright & Vitest

## Getting Started

### Prerequisites

- Node.js 18+

### Environment

Copy `.env.example` to `.env` and fill in:

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
NEXT_PUBLIC_APP_URL=http://localhost:3000
DEFAULT_LOCALE=ar
```

### Install & Dev

```
npm install
npm run dev
```

### Build & Test

```
npm run build
npm test
```

(Playwright tests require the dev server running.)

## Scripts

| Script              | Description              |
| ------------------- | ------------------------ |
| `npm run dev`       | Start development server |
| `npm run build`     | Create production build  |
| `npm start`         | Start production server  |
| `npm run lint`      | Run ESLint               |
| `npm run typecheck` | Run TypeScript compiler  |
| `npm test`          | Run unit and e2e tests   |
| `npm run test:unit` | Run Vitest unit tests    |
| `npm run test:e2e`  | Run Playwright tests     |
| `npm run format`    | Format with Prettier     |
| `npm run fix`       | ESLint --fix & Prettier  |

## Security Notes

- Global security headers (HSTS, X-Frame-Options, etc.)
- Content-Security-Policy with per-request nonce
- Zod validation for all inputs
- Basic rate limiting on API and auth routes

## Deployment

Deploy to Vercel or any Node 18 environment:

```
npm run build
npm start
```

## Contributing

Pull requests welcome. Please run `npm run fix` and `npm test` before submitting.

## License

MIT
