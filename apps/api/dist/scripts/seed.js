"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const argon2 = require("argon2");
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('Connected to PostgreSQL. Starting seed...');
    await prisma.auditLog.deleteMany();
    await prisma.payslip.deleteMany();
    await prisma.payrun.deleteMany();
    await prisma.salaryRule.deleteMany();
    await prisma.salaryStructure.deleteMany();
    await prisma.timeOffRequest.deleteMany();
    await prisma.leaveAllocation.deleteMany();
    await prisma.timeOffType.deleteMany();
    await prisma.attendance.deleteMany();
    await prisma.contract.deleteMany();
    await prisma.employee.deleteMany();
    await prisma.workingSchedule.deleteMany();
    await prisma.userRole.deleteMany();
    await prisma.rolePermission.deleteMany();
    await prisma.user.deleteMany();
    await prisma.role.deleteMany();
    await prisma.permission.deleteMany();
    const permDefs = [
        { code: 'employees.read' },
        { code: 'employees.create' },
        { code: 'employees.update' },
        { code: 'employees.archive' },
        { code: 'contracts.read' },
        { code: 'contracts.create' },
        { code: 'contracts.update' },
        { code: 'contracts.archive' },
        { code: 'working_schedules.read' },
        { code: 'working_schedules.create' },
        { code: 'working_schedules.update' },
        { code: 'working_schedules.archive' },
        { code: 'attendance.read' },
        { code: 'attendance.create' },
        { code: 'attendance.update' },
        { code: 'attendance.approve' },
        { code: 'time_off.read' },
        { code: 'time_off.request' },
        { code: 'time_off.approve' },
        { code: 'time_off.manage_types' },
        { code: 'time_off.manage_allocations' },
        { code: 'payroll.read' },
        { code: 'payroll.create_payrun' },
        { code: 'payroll.compute' },
        { code: 'payroll.validate' },
        { code: 'payroll.mark_paid' },
        { code: 'payroll.manage_salary_structures' },
        { code: 'payroll.manage_salary_rules' },
        { code: 'payroll.publish_payslips' },
        { code: 'payroll.delete_payslips' },
        { code: 'payroll.send_payslips' },
        { code: 'users.read' },
        { code: 'users.create' },
        { code: 'users.update' },
        { code: 'users.deactivate' },
        { code: 'roles.read' },
        { code: 'roles.manage' },
        { code: 'settings.read' },
        { code: 'settings.update' },
        { code: 'audit_logs.read' },
    ];
    await prisma.permission.createMany({ data: permDefs });
    const permissions = await prisma.permission.findMany();
    const getPerms = (codes) => permissions.filter((p) => codes.includes(p.code)).map((p) => p.id);
    const getAllPerms = () => permissions.map((p) => p.id);
    const hrManagerPerms = ['employees.read', 'employees.create', 'employees.update', 'employees.archive', 'contracts.read', 'contracts.create', 'contracts.update', 'contracts.archive', 'working_schedules.read', 'working_schedules.create', 'working_schedules.update', 'working_schedules.archive', 'attendance.read', 'attendance.create', 'attendance.update', 'attendance.approve', 'time_off.read', 'time_off.request', 'time_off.approve', 'time_off.manage_types', 'time_off.manage_allocations'];
    const rolesData = [
        { code: 'EMPLOYEE', name: 'Employee', perms: getPerms(['employees.read', 'attendance.read', 'attendance.create', 'time_off.read', 'time_off.request']) },
        { code: 'HR_MANAGER', name: 'HR Manager', perms: getPerms(hrManagerPerms) },
        { code: 'TIME_OFF_ADMIN', name: 'Time Off Admin', perms: getPerms(['time_off.read', 'time_off.request', 'time_off.approve', 'time_off.manage_types', 'time_off.manage_allocations']) },
        { code: 'HR_PAYROLL_USER', name: 'HR Payroll User', perms: getPerms([...hrManagerPerms, 'payroll.read', 'payroll.create_payrun', 'payroll.compute', 'payroll.publish_payslips', 'payroll.send_payslips']) },
        { code: 'HR_PAYROLL_MANAGER', name: 'HR Payroll Manager', perms: getPerms([...hrManagerPerms, 'payroll.read', 'payroll.create_payrun', 'payroll.compute', 'payroll.validate', 'payroll.mark_paid', 'payroll.manage_salary_structures', 'payroll.manage_salary_rules', 'payroll.publish_payslips', 'payroll.delete_payslips', 'payroll.send_payslips']) },
        { code: 'ADMIN', name: 'Admin', perms: getAllPerms() },
    ];
    const roleMap = {};
    for (const r of rolesData) {
        const role = await prisma.role.create({
            data: {
                code: r.code,
                name: r.name,
                permissions: { create: r.perms.map(id => ({ permissionId: id })) }
            }
        });
        roleMap[r.code] = role.id;
    }
    const demoUsers = [
        { first: 'Employee', last: 'User', email: 'employee@peoplepay360.com', pass: 'Employee@123', role: 'EMPLOYEE', dept: 'Engineering' },
        { first: 'HR', last: 'Manager', email: 'hr.manager@peoplepay360.com', pass: 'HrManager@123', role: 'HR_MANAGER', dept: 'Human Resources' },
        { first: 'HR', last: 'Payroll', email: 'hr.payroll@peoplepay360.com', pass: 'HrPayroll@123', role: 'HR_PAYROLL_USER', dept: 'Human Resources' },
        { first: 'Payroll', last: 'Manager', email: 'payroll.manager@peoplepay360.com', pass: 'PayrollManager@123', role: 'HR_PAYROLL_MANAGER', dept: 'Human Resources' },
        { first: 'System', last: 'Admin', email: 'admin@peoplepay360.com', pass: 'Admin@123', role: 'ADMIN', dept: 'IT' },
    ];
    let adminUserId = null;
    const createdEmployees = [];
    for (const u of demoUsers) {
        const passwordHash = await argon2.hash(u.pass);
        const user = await prisma.user.create({
            data: {
                email: u.email,
                passwordHash,
                status: client_1.UserStatus.ACTIVE,
                roles: { create: [{ roleId: roleMap[u.role] }] }
            }
        });
        if (u.role === 'ADMIN') {
            adminUserId = user.id;
        }
        const employee = await prisma.employee.create({
            data: {
                employeeNumber: `EMP-${Math.floor(1000 + Math.random() * 9000)}`,
                firstName: u.first,
                lastName: u.last,
                workEmail: u.email,
                department: u.dept,
                startDate: new Date('2024-01-01'),
                employmentStatus: client_1.EmploymentStatus.ACTIVE,
            }
        });
        await prisma.user.update({ where: { id: user.id }, data: { employeeId: employee.id } });
        createdEmployees.push(employee);
    }
    const schedule = await prisma.workingSchedule.create({
        data: {
            name: 'Standard 40h',
            weeklyHours: 40,
            type: client_1.ScheduleType.FIXED,
        }
    });
    const basicRule = await prisma.salaryRule.create({
        data: {
            name: 'Basic Salary', code: 'BASIC',
            category: client_1.RuleCategory.BASIC_SALARY, calculationMethod: client_1.CalculationMethod.FIXED,
        }
    });
    const pfRule = await prisma.salaryRule.create({
        data: {
            name: 'PF Deduction', code: 'PF',
            category: client_1.RuleCategory.DEDUCTION, calculationMethod: client_1.CalculationMethod.PERCENTAGE,
            percentage: 12, baseRuleId: basicRule.id,
        }
    });
    const structure = await prisma.salaryStructure.create({
        data: {
            name: 'Standard Structure', code: 'STD-SAL',
            payFrequency: 'MONTHLY',
        }
    });
    const employeeUser = createdEmployees.find(e => e.firstName === 'Employee');
    const contract = await prisma.contract.create({
        data: {
            reference: 'CON-001',
            employeeId: employeeUser.id,
            startDate: new Date('2024-01-01'),
            wageAmount: 100000,
            currency: 'INR',
            salaryStructureId: structure.id,
            scheduleId: schedule.id,
            status: client_1.ContractStatus.ACTIVE,
        }
    });
    await prisma.attendance.create({
        data: {
            employeeId: employeeUser.id,
            date: new Date('2026-09-01'),
            checkIn: new Date('2026-09-01T09:00:00Z'),
            checkOut: new Date('2026-09-01T17:00:00Z'),
            status: client_1.AttendanceStatus.PRESENT,
        }
    });
    const ptoType = await prisma.timeOffType.create({
        data: {
            name: 'Paid Time Off', code: 'PTO',
            unit: client_1.TimeOffUnit.DAYS, requiresAllocation: true,
        }
    });
    const allocation = await prisma.leaveAllocation.create({
        data: {
            employeeId: employeeUser.id,
            timeOffTypeId: ptoType.id,
            validFrom: new Date('2026-01-01'),
            validTo: new Date('2026-12-31'),
            allocatedAmount: 20,
        }
    });
    await prisma.timeOffRequest.create({
        data: {
            employeeId: employeeUser.id,
            timeOffTypeId: ptoType.id,
            startDate: new Date('2026-09-15'),
            endDate: new Date('2026-09-16'),
            duration: 2,
            unit: client_1.TimeOffUnit.DAYS,
            status: client_1.RequestStatus.APPROVED,
            reason: 'Vacation',
            leaveAllocationId: allocation.id,
        }
    });
    const payrun = await prisma.payrun.create({
        data: {
            reference: 'PR-2026-09',
            periodStart: new Date('2026-09-01'),
            periodEnd: new Date('2026-09-30'),
            payFrequency: 'MONTHLY',
            structureId: structure.id,
            status: client_1.PayrunStatus.PAID,
            grossTotal: 100000,
            deductionTotal: 12000,
            netTotal: 88000,
            paidAt: new Date(),
        }
    });
    await prisma.payslip.create({
        data: {
            reference: 'PS-001',
            payrunId: payrun.id,
            employeeId: employeeUser.id,
            periodStart: new Date('2026-09-01'),
            periodEnd: new Date('2026-09-30'),
            grossPay: 100000,
            netPay: 88000,
            status: 'PUBLISHED',
        }
    });
    await prisma.auditLog.create({
        data: {
            action: 'SEED_DATABASE',
            resource: 'system',
            actorUserId: adminUserId || 'system',
        }
    });
    console.log('Seed completed successfully.');
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map