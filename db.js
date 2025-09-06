const mysql = require('mysql2/promise');

// أنشئ مجمع اتصالات.
// استبدل تفاصيل الاتصال ببيانات اعتماد قاعدة البيانات الفعلية الخاصة بك.
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'password', // كلمة مرور قاعدة البيانات الخاصة بك
    database: 'adwan_erp_db', // اسم قاعدة البيانات الخاصة بك
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = pool;