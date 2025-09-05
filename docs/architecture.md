# ERP Architecture

```
           +-------------------+
           |   Next.js App     |
           +---------+---------+
                     |
                     v
           +---------+---------+
           | API Routes / RBAC |
           +---------+---------+
                     |
         +-----------+-----------+
         |                       |
         v                       v
+----------------+   +--------------------+
| PostgreSQL DB  |   | Blob Storage (S3)  |
+----------------+   +--------------------+
         ^
         |
         v
    Audit / Logs
```

## Flows

### Sign-in
1. User accesses `/auth/login` and authenticates via email or OAuth.
2. NextAuth creates a session and stores user/org memberships.
3. User redirected to `/dashboard` of their current organization.

### Organization Switch
1. User selects another organization from the header.
2. Membership is verified and session updated with new `org_id`.
3. Dashboard reloads with data filtered by `org_id`.

### Invoice Flow
1. Sales creates a quote `/sales/quote` for a customer.
2. Quote is approved and converted to a sales order.
3. From the order, an invoice is generated including discount and VAT.
4. Payment receipt updates invoice status and creates journal entries.
