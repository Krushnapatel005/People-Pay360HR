// ─── Core Domain Types ────────────────────────────────────────────────────────

export type Role =
  | 'employee'
  | 'hr_manager'
  | 'time_off_admin'
  | 'payroll_user'
  | 'payroll_admin'
  | 'admin';

export type Status = 'active' | 'inactive' | 'archived';

export type Gender = 'male' | 'female' | 'other' | 'prefer_not_to_say';

export type MaritalStatus = 'single' | 'married' | 'divorced' | 'widowed';

// ─── User / Auth ──────────────────────────────────────────────────────────────

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatarUrl?: string;
  initials: string;
  status: Status;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
  employeeId?: string;
}

// ─── Employee ─────────────────────────────────────────────────────────────────

export type EmployeeStatus = 'active' | 'on_leave' | 'terminated' | 'probation';

export interface Employee {
  id: string;
  employeeRef: string; // e.g. EMP/2026/0001
  firstName: string;
  lastName: string;
  fullName: string;
  initials: string;
  avatarUrl?: string;
  gender: Gender;
  dateOfBirth?: string;
  maritalStatus?: MaritalStatus;
  nationality?: string;

  // Work
  jobPosition: string;
  jobTitle?: string;
  department: string;
  workEmail: string;
  workPhone?: string;
  personalEmail?: string;
  personalPhone?: string;
  hireDate: string;
  status: EmployeeStatus;
  managerId?: string;
  managerName?: string;
  workLocation?: string;
  workScheduleId?: string;
  workScheduleName?: string;

  // Payroll
  salaryStructureId?: string;
  salaryStructureName?: string;
  bankAccount?: string;

  // Tags
  tags?: string[];

  createdAt: string;
  updatedAt: string;
}

// ─── Contract ─────────────────────────────────────────────────────────────────

export type ContractType = 'full_time' | 'part_time' | 'fixed_term' | 'internship' | 'freelance';
export type ContractStatus = 'draft' | 'active' | 'expired' | 'cancelled';

export interface Contract {
  id: string;
  ref: string; // CON/2026/0042
  employeeId: string;
  employeeName: string;
  jobPosition: string;
  department: string;
  contractType: ContractType;
  status: ContractStatus;
  startDate: string;
  endDate?: string;
  wage: number;
  currency: string;
  wageType: 'monthly' | 'daily' | 'hourly';
  workScheduleId?: string;
  workScheduleName?: string;
  salaryStructureId?: string;
  salaryStructureName?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Working Schedule ─────────────────────────────────────────────────────────

export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

export interface WorkScheduleDay {
  day: DayOfWeek;
  isWorkDay: boolean;
  dayPeriod?: 'morning' | 'afternoon' | 'full';
  startTime?: string;
  endTime?: string;
  hours?: number;
}

export interface WorkingSchedule {
  id: string;
  name: string;
  type: 'fixed' | 'flexible' | 'shift';
  hoursPerWeek: number;
  companyId?: string;
  timezone: string;
  days: WorkScheduleDay[];
  status: Status;
  createdAt: string;
  updatedAt: string;
}

// ─── Attendance ───────────────────────────────────────────────────────────────

export type AttendanceReason = 'normal' | 'overtime' | 'remote' | 'correction';

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeRef: string;
  department: string;
  date: string;
  checkIn?: string;
  checkOut?: string;
  workedHours?: number;
  overtimeHours?: number;
  reason: AttendanceReason;
  status: 'present' | 'absent' | 'partial' | 'approved_leave';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Time Off ─────────────────────────────────────────────────────────────────

export type TimeOffRequestStatus = 'draft' | 'pending' | 'approved' | 'rejected' | 'cancelled';

export interface TimeOffRequest {
  id: string;
  ref: string;
  employeeId: string;
  employeeName: string;
  department: string;
  timeOffTypeId: string;
  timeOffTypeName: string;
  startDate: string;
  endDate: string;
  days: number;
  halfDay?: boolean;
  description?: string;
  status: TimeOffRequestStatus;
  approvedById?: string;
  approvedByName?: string;
  approvedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TimeOffType {
  id: string;
  name: string;
  code: string;
  color: string;
  allocationMode: 'no' | 'fixed' | 'accrual';
  leaveValidation: 'no' | 'manager' | 'both' | 'hr';
  allowNegative: boolean;
  daysDuration?: number;
  requiresAllocation: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type AllocationStatus = 'draft' | 'active' | 'expired' | 'cancelled';
export type AllocationMode = 'fixed' | 'accrual';

export interface LeaveAllocation {
  id: string;
  ref: string;
  employeeId: string;
  employeeName: string;
  department: string;
  timeOffTypeId: string;
  timeOffTypeName: string;
  numberOfDays: number;
  dateFrom: string;
  dateTo: string;
  allocationMode: AllocationMode;
  status: AllocationStatus;
  approvedById?: string;
  approvedByName?: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Payroll ──────────────────────────────────────────────────────────────────

export type SalaryRuleCategory = 'basic' | 'allowance' | 'deduction' | 'tax' | 'net';
export type SalaryRuleAmountSelect = 'percentage' | 'fix' | 'code';

export interface SalaryRule {
  id: string;
  name: string;
  code: string;
  category: SalaryRuleCategory;
  sequence: number;
  amountSelect: SalaryRuleAmountSelect;
  amountFix?: number;
  amountPercentage?: number;
  amountPercentageBase?: string;
  amountPythonCompute?: string;
  quantity: number;
  quantitySelect?: 'fix' | 'code';
  isActive: boolean;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SalaryStructure {
  id: string;
  name: string;
  code: string;
  type: string;
  parentId?: string;
  parentName?: string;
  rules: SalaryRule[];
  isActive: boolean;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type PayrunStatus = 'draft' | 'computed' | 'validated' | 'paid' | 'cancelled';

export interface PayrunEmployee {
  employeeId: string;
  employeeName: string;
  department: string;
  jobPosition: string;
  basicWage: number;
  grossWage: number;
  netWage: number;
  totalDeductions: number;
  totalAllowances: number;
  status: 'ok' | 'error' | 'warning';
  errorMessage?: string;
}

export interface Payrun {
  id: string;
  ref: string;
  name: string;
  dateFrom: string;
  dateTo: string;
  status: PayrunStatus;
  salaryStructureId?: string;
  salaryStructureName?: string;
  employees: PayrunEmployee[];
  totalGross: number;
  totalNet: number;
  totalDeductions: number;
  exceptionCount: number;
  computedAt?: string;
  validatedAt?: string;
  paidAt?: string;
  createdAt: string;
  updatedAt: string;
}

export type PayslipStatus = 'draft' | 'computed' | 'validated' | 'paid' | 'cancelled';

export interface PayslipLine {
  ruleId: string;
  ruleName: string;
  ruleCode: string;
  category: SalaryRuleCategory;
  quantity: number;
  rate: number;
  amount: number;
}

export interface Payslip {
  id: string;
  ref: string;
  employeeId: string;
  employeeName: string;
  department: string;
  jobPosition: string;
  payrunId: string;
  payrunRef: string;
  dateFrom: string;
  dateTo: string;
  status: PayslipStatus;
  lines: PayslipLine[];
  basicWage: number;
  grossWage: number;
  totalDeductions: number;
  netWage: number;
  createdAt: string;
  updatedAt: string;
}

// ─── Notification ─────────────────────────────────────────────────────────────

export type NotificationType = 'info' | 'success' | 'warning' | 'error';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  link?: string;
  createdAt: string;
}

// ─── Dashboard Stats ──────────────────────────────────────────────────────────

export interface DashboardStat {
  label: string;
  value: string | number;
  delta?: string;
  deltaType?: 'up' | 'down' | 'neutral';
  icon?: string;
}
