export type Role = 'Admin' | 'HRManager' | 'Manager' | 'Employee';

export const rolePages: Record<Role, string[]> = {
  Admin: ['*'],
  HRManager: ['*'],
  Manager: ['dashboard', 'employees', 'attendance', 'leave'],
  Employee: ['dashboard', 'attendance', 'leave', 'payroll'],
};

export function canAccess(role: Role, page: string) {
  const list = rolePages[role];
  return list.includes('*') || list.includes(page);
}
