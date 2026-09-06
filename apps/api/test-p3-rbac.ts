
const API_URL = 'http://localhost:4000/api';

const users = [
  { role: 'EMPLOYEE', email: 'employee@peoplepay360.com', pass: 'Employee@123' },
  { role: 'HR_MANAGER', email: 'hr.manager@peoplepay360.com', pass: 'HrManager@123' },
  { role: 'HR_PAYROLL_USER', email: 'hr.payroll@peoplepay360.com', pass: 'HrPayroll@123' },
  { role: 'HR_PAYROLL_MANAGER', email: 'payroll.manager@peoplepay360.com', pass: 'PayrollManager@123' },
  { role: 'ADMIN', email: 'admin@peoplepay360.com', pass: 'Admin@123' },
];

async function testEndpoint(
  name: string,
  cookie: string,
  method: 'GET' | 'POST' | 'DELETE' | 'PATCH',
  url: string,
  expectAllowed: boolean
) {
  try {
    const res = await fetch(`${API_URL}${url}`, {
      method,
      headers: { Cookie: cookie },
    });

    const isPermitted = res.ok || res.status === 404 || res.status === 400;
    const isDenied = res.status === 403 || res.status === 401;

    if (isPermitted) {
      if (expectAllowed) {
        console.log(`  ✅ [${name}] ${method} ${url} — Allowed (${res.status})`);
      } else {
        console.error(`  ❌ [${name}] ${method} ${url} — Should have been DENIED but got (${res.status})`);
        process.exitCode = 1;
      }
    } else if (isDenied) {
      if (!expectAllowed) {
        console.log(`  ✅ [${name}] ${method} ${url} — Denied (${res.status}) as expected`);
      } else {
        console.error(`  ❌ [${name}] ${method} ${url} — Should have been ALLOWED but got (${res.status})`);
        process.exitCode = 1;
      }
    } else {
      console.warn(`  ⚠️  [${name}] ${method} ${url} — Unexpected status (${res.status})`);
    }
  } catch (error: any) {
    console.error(`  ⚠️  [${name}] ${method} ${url} — Network error: ${error.message}`);
  }
}

async function runTests() {
  console.log('\n════════════════════════════════════════════════');
  console.log('  PeoplePay360 — RBAC & Login E2E Test Suite   ');
  console.log('════════════════════════════════════════════════\n');

  const cookies: Record<string, string> = {};

  // ─── PHASE 1: Login Tests ────────────────────────────────────────────────────
  console.log('[ PHASE 1 ] Login Verification\n');
  let loginsFailed = false;
  for (const u of users) {
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: u.email, password: u.pass }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${await res.text()}`);

      // Extract the Set-Cookie header to reuse in subsequent requests
      const rawCookies = res.headers.getSetCookie?.() ?? [];
      const cookieStr = rawCookies.map((c: string) => c.split(';')[0]).join('; ');
      cookies[u.role] = cookieStr;

      const body: any = await res.json();
      console.log(`  ✅ ${u.role.padEnd(20)} ${u.email}`);
      console.log(`     User ID: ${body.user?.id}`);
    } catch (err: any) {
      console.error(`  ❌ Login FAILED for ${u.role} (${u.email}): ${err.message}`);
      loginsFailed = true;
      process.exitCode = 1;
    }
  }

  if (loginsFailed) {
    console.error('\n  Aborting RBAC tests — one or more logins failed.\n');
    return;
  }

  // ─── PHASE 2: RBAC Permission Tests ──────────────────────────────────────────
  console.log('\n[ PHASE 2 ] RBAC Permission Verification\n');
  console.log('  --- EMPLOYEE ---');
  await testEndpoint('EMPLOYEE', cookies['EMPLOYEE'], 'GET', '/payroll/payruns', false);      // DENIED
  await testEndpoint('EMPLOYEE', cookies['EMPLOYEE'], 'POST', '/payroll/payruns', false);     // DENIED
  await testEndpoint('EMPLOYEE', cookies['EMPLOYEE'], 'GET', '/employees', true);             // ALLOWED
  await testEndpoint('EMPLOYEE', cookies['EMPLOYEE'], 'GET', '/attendance', true);            // ALLOWED
  await testEndpoint('EMPLOYEE', cookies['EMPLOYEE'], 'GET', '/time-off', true);              // ALLOWED
  await testEndpoint('EMPLOYEE', cookies['EMPLOYEE'], 'GET', '/users', false);                // DENIED

  console.log('  --- HR_MANAGER ---');
  await testEndpoint('HR_MANAGER', cookies['HR_MANAGER'], 'GET', '/employees', true);        // ALLOWED
  await testEndpoint('HR_MANAGER', cookies['HR_MANAGER'], 'GET', '/attendance', true);       // ALLOWED
  await testEndpoint('HR_MANAGER', cookies['HR_MANAGER'], 'GET', '/payroll/payruns', false); // DENIED
  await testEndpoint('HR_MANAGER', cookies['HR_MANAGER'], 'GET', '/payroll/payslips', false); // DENIED
  await testEndpoint('HR_MANAGER', cookies['HR_MANAGER'], 'GET', '/users', false);           // DENIED

  console.log('  --- HR_PAYROLL_USER ---');
  await testEndpoint('HR_PAYROLL_USER', cookies['HR_PAYROLL_USER'], 'GET', '/payroll/payruns', true);       // ALLOWED
  await testEndpoint('HR_PAYROLL_USER', cookies['HR_PAYROLL_USER'], 'POST', '/payroll/payruns', true);      // ALLOWED (400 body missing)
  await testEndpoint('HR_PAYROLL_USER', cookies['HR_PAYROLL_USER'], 'DELETE', '/payroll/payslips/fake-id', false); // DENIED
  await testEndpoint('HR_PAYROLL_USER', cookies['HR_PAYROLL_USER'], 'GET', '/employees', true);             // ALLOWED
  await testEndpoint('HR_PAYROLL_USER', cookies['HR_PAYROLL_USER'], 'GET', '/users', false);                // DENIED

  console.log('  --- HR_PAYROLL_MANAGER ---');
  await testEndpoint('HR_PAYROLL_MANAGER', cookies['HR_PAYROLL_MANAGER'], 'GET', '/payroll/payruns', true);         // ALLOWED
  await testEndpoint('HR_PAYROLL_MANAGER', cookies['HR_PAYROLL_MANAGER'], 'DELETE', '/payroll/payslips/fake-id', true); // ALLOWED (404)
  await testEndpoint('HR_PAYROLL_MANAGER', cookies['HR_PAYROLL_MANAGER'], 'GET', '/payroll/salary-rules', true);   // ALLOWED
  await testEndpoint('HR_PAYROLL_MANAGER', cookies['HR_PAYROLL_MANAGER'], 'GET', '/users', false);                 // DENIED
  await testEndpoint('HR_PAYROLL_MANAGER', cookies['HR_PAYROLL_MANAGER'], 'GET', '/roles', false);                 // DENIED

  console.log('  --- ADMIN ---');
  await testEndpoint('ADMIN', cookies['ADMIN'], 'GET', '/users', true);                            // ALLOWED
  await testEndpoint('ADMIN', cookies['ADMIN'], 'GET', '/roles', true);                            // ALLOWED
  await testEndpoint('ADMIN', cookies['ADMIN'], 'DELETE', '/payroll/payslips/fake-id', true);      // ALLOWED
  await testEndpoint('ADMIN', cookies['ADMIN'], 'GET', '/payroll/salary-structures', true);        // ALLOWED

  // ─── PHASE 3: PostgreSQL Verification ──────────────────────────────────────
  console.log('\n[ PHASE 3 ] PostgreSQL Duplicate Check\n');
  const { PrismaClient } = require('@prisma/client');
  const prisma = new PrismaClient();

  try {
    const expectedEmails = [
      'employee@peoplepay360.com',
      'hr.manager@peoplepay360.com',
      'hr.payroll@peoplepay360.com',
      'payroll.manager@peoplepay360.com',
      'admin@peoplepay360.com',
    ];

    for (const email of expectedEmails) {
      const users = await prisma.user.findMany({
        where: { email },
        include: { roles: { include: { role: true } } },
      });

      if (users.length === 0) {
        console.error(`  ❌ ${email} — NOT FOUND in database`);
        process.exitCode = 1;
      } else if (users.length > 1) {
        console.error(`  ❌ ${email} — DUPLICATE found (${users.length} records)`);
        process.exitCode = 1;
      } else {
        const u = users[0];
        const roleNames = u.roles.map((r: any) => r.role.code).join(', ');
        const hasHash = u.passwordHash != null && u.passwordHash.startsWith('$argon2');
        console.log(`  ✅ ${email.padEnd(40)} Role: ${roleNames.padEnd(20)} Hash: ${hasHash ? 'argon2 ✔' : '⚠️ MISSING'} Status: ${u.status}`);
      }
    }
  } finally {
    await prisma.$disconnect();
  }

  console.log('\n════════════════════════════════════════════════');
  console.log(`  Test run complete. Exit code: ${process.exitCode ?? 0}`);
  console.log('════════════════════════════════════════════════\n');
}

runTests();
