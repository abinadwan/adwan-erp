import { Pool } from 'pg';

// Read the connection string from the environment. If it's missing we still
// create a pool instance so that API routes can surface a helpful error message
// rather than crashing during import.
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.warn('DATABASE_URL is not defined');
}

// Supabase exposes a single connection string that already includes all of the
// necessary credentials. We also enable SSL but skip certificate validation
// because Supabase manages the certificates for us.
const pool = new Pool(
  connectionString
    ? {
        connectionString,
        ssl: {
          rejectUnauthorized: false,
        },
      }
    : undefined,
);

export default pool;
