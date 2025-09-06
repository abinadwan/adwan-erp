import { Pool } from 'pg';

// Supabase provides a single DATABASE_URL that contains all connection info.
// It's the easiest way to connect.
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
postgresql://postgres.aynpgugnfulnstcfhhqn:Adwan@@0558166618@aws-1-eu-north-1.pooler.supabase.com:6543/postgres
  ssl: {
    rejectUnauthorized: false,
  },
});

export default pool;
