# System Architecture

```
                           +-------------------+
                           |   PostgreSQL DB   |
                           | (Supabase/Neon)   |
                           +---------+---------+
                                     ^
                                     |
                           +---------+---------+
                           |   Next.js 14 App  |
                           |  (API & UI, RBAC) |
                           +---------+---------+
                                     ^
                                     |
                           +---------+---------+
                           |  Browser Client   |
                           | (React/TS/RTL-LTR)|
                           +-------------------+
```

## Flow Examples

### Sign-in
1. User submits email/password or OAuth provider.
2. NextAuth verifies credentials and issues session cookie/JWT.
3. User is redirected to `/org` selection.

### Organization Switch
1. From any page user opens org switcher.
2. Request to `/api/orgs/:id/switch` updates session `org_id`.
3. Subsequent requests and UI load data scoped by `org_id`.

### Invoice Flow
1. Create quote: `/sales/quotes/new`.
2. Convert quote to invoice: `/sales/invoices/new?quote=ID`.
3. Apply discounts and VAT (15% default).
4. Save and generate stamped PDF.
5. Payment updates invoice status and posts journal entries.
