const SESSION_KEY = 'hrmsSession';
const LANG_KEY = 'hrmsLang';

// --- Supabase Client Setup ---
// هام: استبدل بالـ URL والـ Key الخاص بمشروعك على Supabase
const SUPABASE_URL = 'https://aynpgugnfulnstcfhhqn.supabase.co';
// ملاحظة هامة: المفتاح الذي قدمته هو "Publishable key". مكتبة جافاسكريبت تتطلب مفتاح "anon".
// يرجى الحصول على مفتاح "anon (public)" من إعدادات المشروع في Supabase (قسم API). سيكون سلسلة طويلة من الأحرف (JWT).
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF5bnBndWduZnVsbnN0Y2ZoaHFuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcxNjczOTIsImV4cCI6MjA3Mjc0MzM5Mn0.k7DSq9r9O2Wx8HYZVX3oD3nLXx-SE74BhyXjIhkAX04';

// تحقق من أن القيم قد تم تغييرها
if (SUPABASE_URL.includes('YOUR_SUPABASE_URL') || SUPABASE_ANON_KEY.includes('YOUR_SUPABASE_ANON_KEY')) {
  alert('Please update SUPABASE_URL and SUPABASE_ANON_KEY in js/app.js');
}
// The original `supabase` object from the CDN is used to create a client instance.
// We then overwrite the global `supabase` variable with this new instance
// so all other scripts can use the initialized client.
window.supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const translations = {
  en: {
    loginTitle: 'Login',
    role: 'Role',
    pin: 'PIN',
    submit: 'Submit',
    dashboard: 'Dashboard',
    employees: 'Employees',
    departments: 'Departments',
    attendance: 'Attendance',
    leaves: 'Leaves',
    payroll: 'Payroll',
    audit: 'Audit Log',
    reports: 'Reports',
    settings: 'Settings',
    logout: 'Logout',
    invalidPin: 'Invalid PIN',
    invalidEmail: 'Invalid email',
    add: 'Add',
    edit: 'Edit',
    delete: 'Delete',
    name: 'Name',
    email: 'Email',
    department: 'Department',
    employee: 'Employee',
    date: 'Date',
    startDate: 'Start Date',
    endDate: 'End Date',
    status: 'Status',
    pending: 'Pending',
    approved: 'Approved',
    rejected: 'Rejected',
    action: 'Action',
    entity: 'Entity',
    details: 'Details',
    export: 'Export CSV',
    print: 'Print',
    lang: 'عربي',
    changePin: 'Change PIN',
    currentPin: 'Current PIN',
    newPin: 'New PIN',
    confirm: 'Confirm',
    generate: 'Generate',
    month: 'Month',
    kpiEmployees: 'Employees',
    kpiDepartments: 'Departments',
    kpiLeaves: 'Pending Leaves',
    latestAudit: 'Latest Audit',
    quickActions: 'Quick Actions',
    search: 'Search',
    searchPlaceholderEmployees: 'Search by name, email, or department...',
    save: 'Save',
    approve: 'Approve',
    reject: 'Reject',
    cancel: 'Cancel'
  },
  ar: {
    loginTitle: 'تسجيل الدخول',
    role: 'الدور',
    pin: 'الرمز',
    submit: 'إرسال',
    dashboard: 'لوحة التحكم',
    employees: 'الموظفون',
    departments: 'الأقسام',
    attendance: 'الحضور',
    leaves: 'الإجازات',
    payroll: 'الرواتب',
    audit: 'سجل التدقيق',
    reports: 'التقارير',
    settings: 'الإعدادات',
    logout: 'خروج',
    invalidPin: 'رمز غير صحيح',
    invalidEmail: 'بريد غير صالح',
    add: 'إضافة',
    edit: 'تعديل',
    delete: 'حذف',
    name: 'الاسم',
    email: 'البريد الإلكتروني',
    department: 'القسم',
    employee: 'الموظف',
    date: 'التاريخ',
    startDate: 'تاريخ البدء',
    endDate: 'تاريخ الانتهاء',
    status: 'الحالة',
    pending: 'معلق',
    approved: 'موافق عليه',
    rejected: 'مرفوض',
    action: 'الإجراء',
    entity: 'الكيان',
    details: 'التفاصيل',
    export: 'تصدير CSV',
    print: 'طباعة',
    lang: 'English',
    changePin: 'تغيير الرمز',
    currentPin: 'الرمز الحالي',
    newPin: 'رمز جديد',
    confirm: 'تأكيد',
    generate: 'توليد',
    month: 'الشهر',
    kpiEmployees: 'عدد الموظفين',
    kpiDepartments: 'عدد الأقسام',
    kpiLeaves: 'إجازات معلقة',
    latestAudit: 'أحدث السجلات',
    quickActions: 'إجراءات سريعة',
    search: 'بحث',
    searchPlaceholderEmployees: 'بحث بالاسم، البريد الإلكتروني، أو القسم...',
    save: 'حفظ',
    approve: 'موافقة',
    reject: 'رفض',
    cancel: 'إلغاء'
  }
};

function sanitize(str) {
  return str.replace(/[&<>\"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

function validateEmail(email) {
  return /^[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}$/.test(email);
}

async function addAudit(action, entity, detail) {
  const { error } = await supabase
    .from('audit')
    .insert([{ action, entity, detail, time: new Date().toISOString() }]);
  if (error) console.error('Error adding audit:', error);
}

async function exportCSV(entity) {
  const { data, error } = await supabase.from(entity).select();

  if (error) {
    console.error(`Error fetching ${entity} for CSV export:`, error);
    alert(`Could not export ${entity}.`);
    return;
  }

  let csv = '';
  if (data.length) {
    const headers = Object.keys(data[0]);
    csv += headers.join(',') + '\n';
    data.forEach(row => {
      csv += headers.map(h => JSON.stringify(row[h] ?? '')).join(',') + '\n';
    });
  }
  const blob = new Blob([csv], { type: 'text/csv' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = entity + '.csv';
  document.body.appendChild(a);
  a.click();
  a.remove();
}

/**
 * Fetches the current user session from Supabase.
 * It returns a simplified session object for compatibility with the existing UI logic.
 * NOTE: This assumes the user's role is stored in `user.user_metadata.role`.
 * You can set this metadata when a user signs up or manage it in the Supabase dashboard.
 * @returns {Promise<object|null>} A promise that resolves to { role: 'Admin' | 'Viewer' } or null.
 */
async function getSession() {
  const { data, error } = await supabase.auth.getSession();
  if (error || !data.session) {
    return null;
  }
  // For compatibility, we return an object with a 'role' property.
  // This role should be stored in the user's metadata in Supabase.
  const role = data.session.user.user_metadata?.role || 'Viewer'; // Default to 'Viewer' if no role
  return { role };
}

/**
 * Checks for an active session and redirects to login if none is found.
 * @returns {Promise<object|null>} A promise that resolves to the session object or null if redirected.
 */
async function requireSession() {
  const session = await getSession();
  if (!session) {
    window.location.href = 'login.html';
    return null; // Stop execution
  }
  return session;
}

/**
 * Signs the user out and redirects to the login page.
 */
async function logout() {
  await supabase.auth.signOut();
  window.location.href = 'login.html';
}

function currentLang() {
  return localStorage.getItem(LANG_KEY) || 'en';
}

function setLang(lang) {
  localStorage.setItem(LANG_KEY, lang);
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  const btn = document.getElementById('langToggle');
  if (btn) btn.textContent = lang === 'ar' ? 'English' : 'عربي';
  applyTranslations();
}

function t(key) {
  const lang = currentLang();
  return translations[lang][key] || key;
}

function applyTranslations() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    el.textContent = t(el.dataset.i18n);
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    el.placeholder = t(el.dataset.i18nPlaceholder);
  });
}

function setupRoleUI(session) {
  if (session.role !== 'Admin') {
    document.querySelectorAll('.admin-only').forEach(el => {
      el.classList.add('hidden');
    });
  }
  if (session.role === 'Viewer') {
    document.querySelectorAll('input, select, textarea, button').forEach(el => {
      if (!el.classList.contains('allow-viewer')) {
        el.disabled = true;
      }
    });
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  if (document.body.dataset.auth === 'required') {
    const session = await requireSession();
    if (!session) return; // Stop if redirected
    setupRoleUI(session);
  }
  const lang = currentLang();
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  const langBtn = document.getElementById('langToggle');
  if (langBtn) {
    langBtn.textContent = lang === 'ar' ? 'English' : 'عربي';
    langBtn.addEventListener('click', () => {
      setLang(currentLang() === 'ar' ? 'en' : 'ar');
    });
  }
  document.getElementById('logout')?.addEventListener('click', () => logout());
  applyTranslations();
});
