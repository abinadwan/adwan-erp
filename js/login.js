document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('loginForm');
  // ملاحظة: هذا نظام دخول مؤقت.
  // في تطبيق حقيقي، يجب استخدام نظام المصادقة الخاص بـ Supabase (مثلاً، بالبريد الإلكتروني وكلمة المرور).
  // تم إزالة نظام PIN لأنه غير متوافق مع قاعدة البيانات.
  form.addEventListener('submit', e => {
    e.preventDefault();
    const role = document.getElementById('role').value;
    // في هذا العرض التوضيحي، نقوم فقط بتعيين دور الجلسة والمتابعة.
    setSession(role);
    addAudit('login', role, `Logged in as ${role}`);
    window.location.href = 'index.html';
  });
});
