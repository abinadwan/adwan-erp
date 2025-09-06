const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('./db'); // تم تصحيح المسار

const router = express.Router();

// مسار تسجيل مستخدم جديد
router.post('/register', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).send('الرجاء إدخال اسم المستخدم وكلمة المرور.');
    }

    try {
        // 1. تجزئة (hashing) كلمة المرور قبل حفظها
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 2. حفظ المستخدم الجديد في قاعدة البيانات
        await db.query(
            'INSERT INTO users (username, password) VALUES ($1, $2)',
            [username, hashedPassword]
        );

        // 3. إعادة توجيه المستخدم إلى صفحة تسجيل الدخول بعد التسجيل الناجح
        res.redirect('/login');

    } catch (error) {
        console.error('Registration error:', error);
        // التحقق مما إذا كان الخطأ بسبب اسم مستخدم موجود مسبقًا
        if (error.code === '23505') { // 23505 هو رمز خطأ PostgreSQL لتكرار القيمة الفريدة
            return res.status(409).send('اسم المستخدم هذا موجود بالفعل.');
        }
        res.status(500).send('حدث خطأ في الخادم أثناء محاولة تسجيل المستخدم.');
    }
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).send('الرجاء إدخال اسم المستخدم وكلمة المرور.');
    }

    try {
        // 1. ابحث عن المستخدم بالاسم من قاعدة البيانات
        // ملاحظة: تم تحديث بناء جملة الاستعلام لـ PostgreSQL (استخدام $1)
        const { rows } = await db.query('SELECT * FROM users WHERE username = $1', [username]);

        if (rows.length === 0) {
            // لم يتم العثور على المستخدم
            return res.status(401).send('اسم المستخدم أو كلمة المرور غير صحيحة.');
        }

        const user = rows[0];

        // 2. قارن كلمة المرور المُرسلة مع كلمة المرور المجزأة في قاعدة البيانات
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            // كلمات المرور غير متطابقة
            return res.status(401).send('اسم المستخدم أو كلمة المرور غير صحيحة.');
        }

        // 3. إذا كانت بيانات الاعتماد صحيحة، فأنشئ جلسة للمستخدم
        req.session.user = {
            id: user.id,
            username: user.username,
            // أضف أي بيانات أخرى للمستخدم تريد تخزينها في الجلسة
        };
        
        // 4. أعد توجيه المستخدم إلى صفحة محمية مثل لوحة التحكم
        // يمكنك أيضًا إرسال استجابة نجاح بتنسيق JSON
        res.redirect('/dashboard');

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).send('حدث خطأ في الخادم أثناء محاولة تسجيل الدخول.');
    }
});

router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.redirect('/dashboard'); // أو أي صفحة أخرى
        }
        res.clearCookie('connect.sid'); // اسم ملف تعريف الارتباط الافتراضي للجلسة
        res.redirect('/login');
    });
});

module.exports = router;