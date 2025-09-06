import { Pool } from 'pg';

// Supabase provides a single DATABASE_URL that contains all connection info.
// It's the easiest way to connect.
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Supabase requires SSL.
  ssl: {
    rejectUnauthorized: false,
  },
});

export default pool;
