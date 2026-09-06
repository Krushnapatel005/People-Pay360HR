import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class OwnershipGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const { user, params, body, query } = request;

    if (!user || !user.roles) {
      throw new ForbiddenException('Access Denied');
    }

    // Check if user has a system role other than EMPLOYEE
    const isOnlyEmployee = user.roles.every((r: any) => r.role?.code === 'EMPLOYEE');

    if (!isOnlyEmployee) {
      // HR/Admin roles bypass this strict parameter check; their access is governed by PermissionsGuard
      return true;
    }

    if (!user.employeeId) {
      throw new ForbiddenException('Employee record not linked to user');
    }

    const authEmployeeId = user.employeeId.toString();

    // 1. Check body (POST/PUT/PATCH)
    if (body && body.employeeId) {
      if (body.employeeId.toString() !== authEmployeeId) {
        throw new ForbiddenException('Cannot manipulate records for another employee');
      }
    }

    // 2. Check query params (e.g. filtering GET lists)
    if (query && query.employeeId) {
      if (query.employeeId.toString() !== authEmployeeId) {
        throw new ForbiddenException('Cannot query records for another employee');
      }
    }

    // 3. Check route params: 
    if (params && params.employeeId) {
      if (params.employeeId.toString() !== authEmployeeId) {
        throw new ForbiddenException('Cannot access records for another employee');
      }
    }

    // For /employees/:id
    const routePath = request.route?.path || '';
    if (routePath.includes('/employees/:id') && params && params.id) {
      if (params.id.toString() !== authEmployeeId) {
        throw new ForbiddenException('Cannot access another employee\'s profile');
      }
    }

    // Also prevent employees from changing sensitive fields on themselves if passed in body
    if (body) {
      if (body.roleIds || body.role) {
        throw new ForbiddenException('Role manipulation not permitted');
      }
      if (body.userId) {
        throw new ForbiddenException('User linking not permitted');
      }
    }

    return true;
  }
}
