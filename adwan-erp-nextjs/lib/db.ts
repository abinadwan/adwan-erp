import mysql from 'mysql2/promise';

// Create a connection pool.
// Replace the connection details with your actual database credentials.
// It is recommended to use environment variables for this.
// Create a .env.local file in the root of your project and add the following:
// DB_HOST=localhost
// DB_USER=root
// DB_PASSWORD=password
// DB_DATABASE=adwan_erp_db

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_DATABASE || 'adwan_erp_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

export default pool;
