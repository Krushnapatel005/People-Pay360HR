import * as assert from 'assert';

const BASE_URL = 'http://localhost:4000/api';

async function login(email: string, password = 'Employee@123') {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const text = await res.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch (e) {
    throw new Error(`Login failed for ${email} with status ${res.status}: ${text.substring(0, 200)}`);
  }
  if (!res.ok) throw new Error(`Login failed for ${email}: ${JSON.stringify(data)}`);
  
  // Also get the set-cookie header for access token if needed, but our API returns accessToken in JSON usually.
  // Wait, our API uses HTTP-only cookies in AuthController, let's extract it.
  const cookieHeader = res.headers.get('set-cookie');
  return { data, cookieHeader };
}

async function request(path: string, method: string, cookie: string, body?: any) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      Cookie: cookie || '',
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  return { status: res.status, data: await res.json().catch(() => null) };
}

async function runTests() {
  console.log('--- RUNNING RBAC E2E TESTS ---');

  // 1. Login with Aarav (Employee)
  console.log('1. Testing EMPLOYEE (Aarav)');
  const aarav = await login('employee@peoplepay360.local', 'Employee@123');
  const aaravCookie = aarav.cookieHeader!;
  
  // Employee can read own details
  const myEmpRes = await request(`/employees/${aarav.data.user.employeeId}`, 'GET', aaravCookie);
  if (myEmpRes.status !== 200) throw new Error(`Aarav could not read own profile: ${myEmpRes.status}`);

  // Employee CANNOT read other employee
  const otherEmpRes = await request(`/employees/65abcdef1234567890abcdef`, 'GET', aaravCookie);
  if (otherEmpRes.status !== 403) throw new Error(`Aarav could read other profile or got wrong status: ${otherEmpRes.status}`);

  // Employee CANNOT access Payroll
  const payrunRes = await request(`/payroll/payruns`, 'GET', aaravCookie);
  if (payrunRes.status !== 403) throw new Error(`Aarav could access payroll: ${payrunRes.status}`);

  console.log('✔ EMPLOYEE tests passed.');

  // 2. Login with Maya (HR Manager)
  console.log('2. Testing HR_MANAGER (Maya)');
  const maya = await login('hr.manager@peoplepay360.local', 'HRManager@123');
  const mayaCookie = maya.cookieHeader!;

  // HR Manager CAN read other employee
  const mayaEmpRes = await request(`/employees/${aarav.data.user.employeeId}`, 'GET', mayaCookie);
  if (mayaEmpRes.status !== 200) throw new Error(`Maya could not read employee profile: ${mayaEmpRes.status}`);

  // HR Manager CANNOT access Payroll
  const mayaPayrunRes = await request(`/payroll/payruns`, 'GET', mayaCookie);
  if (mayaPayrunRes.status !== 403) throw new Error(`Maya could access payroll: ${mayaPayrunRes.status}`);

  console.log('✔ HR_MANAGER tests passed.');

  // 3. Login with Kavya (HR Payroll User)
  console.log('3. Testing HR_PAYROLL_USER (Kavya)');
  const kavya = await login('payroll.user@peoplepay360.local', 'PayrollUser@123');
  const kavyaCookie = kavya.cookieHeader!;

  // Can read Payruns
  const kavyaPayrunRes = await request(`/payroll/payruns`, 'GET', kavyaCookie);
  if (kavyaPayrunRes.status !== 200) throw new Error(`Kavya could not read payroll: ${kavyaPayrunRes.status}`);

  // CANNOT read Salary Structures
  const kavyaSalRes = await request(`/payroll/salary-structures`, 'GET', kavyaCookie);
  if (kavyaSalRes.status !== 403) throw new Error(`Kavya could read salary structures when she shouldn't: ${kavyaSalRes.status}`);

  // CANNOT delete Payruns
  const kavyaDelPayrun = await request(`/payroll/payruns/123`, 'DELETE', kavyaCookie);
  if (kavyaDelPayrun.status !== 403) throw new Error(`Kavya could delete payroll: ${kavyaDelPayrun.status}`);

  // CANNOT create Salary Structures
  const kavyaCreateSal = await request(`/payroll/salary-structures`, 'POST', kavyaCookie);
  if (kavyaCreateSal.status !== 403) throw new Error(`Kavya could create salary structures: ${kavyaCreateSal.status}`);

  console.log('✔ HR_PAYROLL_USER tests passed.');

  // 4. Login with Nisha (HR Payroll Manager)
  console.log('4. Testing HR_PAYROLL_MANAGER (Nisha)');
  const nisha = await login('payroll.admin@peoplepay360.local', 'PayrollAdmin@123');
  const nishaCookie = nisha.cookieHeader!;

  // CAN delete Payruns (will fail with 404 or invalid ID, but NOT 403)
  const nishaDelPayrun = await request(`/payroll/payruns/123`, 'DELETE', nishaCookie);
  if (nishaDelPayrun.status === 403) throw new Error(`Nisha could not delete payroll (403 forbidden)`);

  // CANNOT manage users
  const nishaUsers = await request(`/users`, 'GET', nishaCookie);
  if (nishaUsers.status !== 403) throw new Error(`Nisha could access users: ${nishaUsers.status}`);

  console.log('✔ HR_PAYROLL_MANAGER tests passed.');

  // 5. Login with System Admin (Admin)
  console.log('5. Testing ADMIN (System Admin)');
  const admin = await login('admin@peoplepay360.local', 'Admin@123');
  const adminCookie = admin.cookieHeader!;

  // CAN manage users
  const adminUsers = await request(`/users`, 'GET', adminCookie);
  if (adminUsers.status !== 200) throw new Error(`Admin could not access users: ${adminUsers.status}`);

  console.log('✔ ADMIN tests passed.');

  console.log('ALL TESTS PASSED SUCCESSFULLY!');
}

runTests().catch(console.error);
