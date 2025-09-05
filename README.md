# ERP Starter

## English

A minimal multi-tenant ERP skeleton built with Next.js 14, TypeScript, Tailwind, shadcn/ui, PostgreSQL and NextAuth. It provides module placeholders for HR, Inventory, Sales, Purchasing, Finance and CRM with Arabic/English support.

### Local Setup
1. Install dependencies:
   ```bash
   pnpm install
   ```
2. Create `.env.local` with:
   ```bash
   DATABASE_URL=postgres://...
   NEXTAUTH_SECRET=your-secret
   ```
3. Run database migrations (schema in `db/erp_schema.sql`):
   ```bash
   pnpm db:migrate
   ```
4. Start the development server:
   ```bash
   pnpm dev
   ```

### Seed Accounts
- owner@example.com / password

### Known Limitations
- This is a demo skeleton; many production features are simplified.

## العربية

نظام ERP مبسّط متعدد العملاء مبني باستخدام Next.js 14 وTypeScript وTailwind وshadcn/ui وPostgreSQL وNextAuth. يوفر هياكل أولية للوحدات: الموارد البشرية، المخزون، المبيعات، المشتريات، المالية وCRM مع دعم العربية والإنجليزية.

### إعداد محلي
1. تثبيت الاعتمادات:
   ```bash
   pnpm install
   ```
2. إنشاء ملف `.env.local` يحتوي على:
   ```bash
   DATABASE_URL=postgres://...
   NEXTAUTH_SECRET=your-secret
   ```
3. تشغيل الهجرات:
   ```bash
   pnpm db:migrate
   ```
4. تشغيل الخادم التطويري:
   ```bash
   pnpm dev
   ```

### حسابات تجريبية
- owner@example.com / password

### حدود معروفة
- المشروع تجريبي والعديد من الخصائص مبسّطة.
