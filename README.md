# ERP-HR

A simplified ERP-HR web app built with Next.js 14 and Supabase.

## Setup

```bash
pnpm install
pnpm dev
```

Run Supabase locally:
```bash
supabase start
supabase db push
supabase db seed
```

Set environment variables from `.env.example`.

## Features
- Authentication with Supabase
- Employee directory, attendance, leave, payroll modules
- Basic i18n Arabic/English with RTL

## Tests

```bash
npx playwright test
```
