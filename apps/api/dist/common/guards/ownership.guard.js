"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OwnershipGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
let OwnershipGuard = class OwnershipGuard {
    reflector;
    constructor(reflector) {
        this.reflector = reflector;
    }
    canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const { user, params, body, query } = request;
        if (!user || !user.roles) {
            throw new common_1.ForbiddenException('Access Denied');
        }
        const isOnlyEmployee = user.roles.every((r) => r.role?.code === 'EMPLOYEE');
        if (!isOnlyEmployee) {
            return true;
        }
        if (!user.employeeId) {
            throw new common_1.ForbiddenException('Employee record not linked to user');
        }
        const authEmployeeId = user.employeeId.toString();
        if (body && body.employeeId) {
            if (body.employeeId.toString() !== authEmployeeId) {
                throw new common_1.ForbiddenException('Cannot manipulate records for another employee');
            }
        }
        if (query && query.employeeId) {
            if (query.employeeId.toString() !== authEmployeeId) {
                throw new common_1.ForbiddenException('Cannot query records for another employee');
            }
        }
        if (params && params.employeeId) {
            if (params.employeeId.toString() !== authEmployeeId) {
                throw new common_1.ForbiddenException('Cannot access records for another employee');
            }
        }
        const routePath = request.route?.path || '';
        if (routePath.includes('/employees/:id') && params && params.id) {
            if (params.id.toString() !== authEmployeeId) {
                throw new common_1.ForbiddenException('Cannot access another employee\'s profile');
            }
        }
        if (body) {
            if (body.roleIds || body.role) {
                throw new common_1.ForbiddenException('Role manipulation not permitted');
            }
            if (body.userId) {
                throw new common_1.ForbiddenException('User linking not permitted');
            }
        }
        return true;
    }
};
exports.OwnershipGuard = OwnershipGuard;
exports.OwnershipGuard = OwnershipGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector])
], OwnershipGuard);
//# sourceMappingURL=ownership.guard.js.map