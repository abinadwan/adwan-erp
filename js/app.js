const HRMS_KEY = 'hrmsData';
const SESSION_KEY = 'hrmsSession';
const LANG_KEY = 'hrmsLang';

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
    save: 'Save',
    approve: 'Approve',
    reject: 'Reject'
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
    save: 'حفظ',
    approve: 'موافقة',
    reject: 'رفض'
  }
};

function sanitize(str) {
  return str.replace(/[&<>\"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

function validateEmail(email) {
  return /^[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}$/.test(email);
}

function loadData() {
  return JSON.parse(localStorage.getItem(HRMS_KEY));
}

function saveData(data) {
  localStorage.setItem(HRMS_KEY, JSON.stringify(data));
}

function seedData() {
  if (!localStorage.getItem(HRMS_KEY)) {
    const data = {
      pins: { Admin: '0000', Viewer: '1111' },
      departments: [
        { id: 1, name: 'HR' },
        { id: 2, name: 'IT' }
      ],
      employees: [
        { id: 1, name: 'Alice', email: 'alice@example.com', departmentId: 1 },
        { id: 2, name: 'Bob', email: 'bob@example.com', departmentId: 2 }
      ],
      attendance: [],
      leaves: [
        { id: 1, employeeId: 1, start: '2024-02-01', end: '2024-02-03', status: 'Pending' }
      ],
      payroll: [],
      audit: []
    };
    saveData(data);
  }
}

function addAudit(action, entity, detail) {
  const data = loadData();
  data.audit.unshift({ id: Date.now(), action, entity, detail, time: new Date().toISOString() });
  saveData(data);
}

function exportCSV(entity) {
  const data = loadData()[entity];
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

function setSession(role) {
  localStorage.setItem(SESSION_KEY, JSON.stringify({ role, expires: Date.now() + 30 * 60 * 1000 }));
}

function getSession() {
  const s = localStorage.getItem(SESSION_KEY);
  if (!s) return null;
  const session = JSON.parse(s);
  if (session.expires < Date.now()) {
    localStorage.removeItem(SESSION_KEY);
    return null;
  }
  return session;
}

function requireSession() {
  const s = getSession();
  if (!s) {
    window.location.href = 'login.html';
    return null;
  }
  return s;
}

function logout() {
  localStorage.removeItem(SESSION_KEY);
  window.location.href = 'login.html';
}

function currentLang() {
  return localStorage.getItem(LANG_KEY) || 'ar';
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

document.addEventListener('DOMContentLoaded', () => {
  seedData();
  const session = getSession();
  if (document.body.dataset.auth === 'required') {
    const s = requireSession();
    if (!s) return;
    setupRoleUI(s);
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
  document.getElementById('logout')?.addEventListener('click', logout);
  applyTranslations();
});

