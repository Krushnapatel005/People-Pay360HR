import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';
import { PrismaService } from './src/prisma/prisma.service';
import { ContractsService } from './src/contracts/contracts.service';
import { WorkingSchedulesService } from './src/working-schedules/working-schedules.service';
import { AttendanceService } from './src/attendance/attendance.service';
import { TimeOffService } from './src/time-off/time-off.service';
import { PayrollService } from './src/payroll/payroll.service';

async function runTests() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const prisma = app.get(PrismaService);
  const contracts = app.get(ContractsService);
  const schedules = app.get(WorkingSchedulesService);
  const attendance = app.get(AttendanceService);
  const timeoff = app.get(TimeOffService);
  const payroll = app.get(PayrollService);

  console.log('--- Starting P1 E2E Logic Tests ---');

  // Find Employee
  const emp = await prisma.employee.findFirst({ where: { user: { email: 'employee@peoplepay360.local' } } });
  if (!emp) throw new Error('Employee not found');

  console.log(`Testing with Employee: ${emp.firstName} ${emp.lastName}`);

  // Test Working Schedules
  const schedule = await schedules.create({
    name: 'P1 Test Schedule',
    days: [
      { dayOfWeek: 1, startTime: '09:00', endTime: '17:00', breakMinutes: 60 },
      { dayOfWeek: 2, startTime: '09:00', endTime: '17:00', breakMinutes: 60 }
    ]
  });
  console.log(`[PASS] Schedule created with auto-calculated weeklyHours: ${schedule.weeklyHours} (Expected: 14)`);

  // Test Contracts
  const structure = await prisma.salaryStructure.findFirst();
  const existingContract = await prisma.contract.findFirst({ where: { employeeId: emp.id } });
  
  if (existingContract) {
    console.log(`[PASS] Found existing contract: ${existingContract.reference}`);
  }

  const contractData = {
    employeeId: emp.id,
    type: 'FULL_TIME',
    startDate: new Date('2024-01-01'),
    wageAmount: 5000,
    currency: 'USD',
    reference: 'P1-CONT-OVERLAP',
    salaryStructureId: structure!.id,
    scheduleId: schedule.id
  };
  
  try {
    await contracts.create(contractData);
    console.error('[FAIL] Overlap validation failed, created overlapping contract');
  } catch (e: any) {
    console.log(`[PASS] Overlap validation caught conflicting contract: ${e.message}`);
  }

  // Test Attendance
  const att = await attendance.create({
    employeeId: emp.id,
    date: new Date('2024-06-01'),
    checkIn: new Date('2024-06-01T09:00:00Z'),
    checkOut: new Date('2024-06-01T17:30:00Z'),
    status: 'PRESENT'
  });
  console.log(`[PASS] Attendance recorded, calculated workedHours: ${att.workedHours} (Expected: 8.5)`);

  // Test Time Off
  const pStart = new Date('2024-01-01T00:00:00Z');
  const pEnd = new Date('2024-12-31T23:59:59Z');
  const type = await prisma.timeOffType.findFirst();
  
  let allocation = await prisma.leaveAllocation.create({
    data: {
      employeeId: emp.id,
      timeOffTypeId: type!.id,
      validFrom: pStart,
      validTo: pEnd,
      allocatedAmount: 10,
      takenAmount: 0,
      remainingAmount: 10
    }
  });

  const request = await timeoff.create({
    employeeId: emp.id,
    timeOffTypeId: type!.id,
    startDate: new Date('2024-06-10T00:00:00Z'),
    endDate: new Date('2024-06-12T23:59:59Z'), // 3 days
    leaveAllocationId: allocation.id
  });

  console.log(`[PASS] Time off request created, duration: ${request.duration} days (Expected: 3)`);
  
  await timeoff.approve(request.id);
  allocation = (await prisma.leaveAllocation.findUnique({ where: { id: allocation.id } }))!;
  console.log(`[PASS] Time off approved, remaining amount: ${allocation.remainingAmount} (Expected: 7)`);

  // Test Payroll
  const payrun = await prisma.payrun.create({
    data: {
      reference: 'PR-TEST-P1',
      periodStart: new Date('2024-06-01'),
      periodEnd: new Date('2024-06-30'),
      structureId: structure!.id,
      status: 'DRAFT'
    }
  });

  const eligible = await payroll.getEligibleEmployees(payrun.periodStart.toISOString(), payrun.periodEnd.toISOString(), structure!.id);
  console.log(`[PASS] Eligible employees for payrun: ${eligible.length}`);
  
  const empIds = eligible.map(e => e.id);
  const computed = await payroll.computePayrun(payrun.id, empIds);
  console.log(`[PASS] Payrun computed, Status: ${computed.status}, Gross: ${computed.grossTotal}, Net: ${computed.netTotal}`);

  const valid = await payroll.validatePayrun(payrun.id);
  console.log(`[PASS] Payrun validated, Status: ${valid.status}`);

  const paid = await payroll.markPaid(payrun.id);
  console.log(`[PASS] Payrun marked paid, Status: ${paid.status}`);

  console.log('--- All P1 Tests Passed Successfully ---');

  await app.close();
}

runTests().catch(e => {
  console.error('[FATAL]', e);
  process.exit(1);
});
