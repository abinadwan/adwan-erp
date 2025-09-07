import { Pool } from 'pg';

// Read the connection string from the environment and fail fast if it's
// missing. This helps surface configuration issues early during startup.
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is not defined');
}

// Supabase exposes a single connection string that already includes all of the
// necessary credentials. We also enable SSL but skip certificate validation
// because Supabase manages the certificates for us.
const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false,
  },
});

export default pool;
