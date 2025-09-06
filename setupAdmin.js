const bcrypt = require('bcryptjs');
const pool = require('./db'); // استيراد إعدادات الاتصال بقاعدة البيانات

async function createAdminUser() {
    const username = 'admin';
    const plainPassword = '123456';
    const role = 'admin';

    console.log('بدء إعداد حساب مدير النظام...');

    try {
        // التحقق مما إذا كان المستخدم موجودًا بالفعل لتجنب الأخطاء
        const { rows } = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
        if (rows.length > 0) {
            console.log(`المستخدم '${username}' موجود بالفعل. تم إيقاف العملية.`);
            return;
        }

        // 1. تجزئة كلمة المرور
        console.log('...جاري تجزئة كلمة المرور');
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(plainPassword, salt);

        // 2. إضافة المستخدم إلى قاعدة البيانات مع صلاحية "admin"
        console.log(`...جاري إضافة المستخدم '${username}' بصلاحية '${role}'`);
        await pool.query(
            'INSERT INTO users (username, password, role) VALUES ($1, $2, $3)',
            [username, hashedPassword, role]
        );

        console.log('✅ تم إنشاء حساب مدير النظام بنجاح!');
        console.log('تنبيه هام: الرجاء تسجيل الدخول وتغيير كلمة المرور الافتراضية في أقرب وقت ممكن.');

    } catch (error) {
        console.error('❌ حدث خطأ أثناء إنشاء حساب مدير النظام:', error);
    } finally {
        await pool.end(); // إغلاق الاتصال بقاعدة البيانات
    }
}

createAdminUser();