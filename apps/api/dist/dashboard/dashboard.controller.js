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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardController = void 0;
const common_1 = require("@nestjs/common");
const dashboard_service_1 = require("./dashboard.service");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const permissions_guard_1 = require("../common/guards/permissions.guard");
const permissions_decorator_1 = require("../common/decorators/permissions.decorator");
let DashboardController = class DashboardController {
    dashboardService;
    constructor(dashboardService) {
        this.dashboardService = dashboardService;
    }
    async getMyKpis(req) {
        if (!req.user.employeeId) {
            throw new common_1.ForbiddenException('User is not linked to an employee record.');
        }
        return this.dashboardService.getEmployeeKpis(req.user.employeeId);
    }
    async getHrKpis() {
        return this.dashboardService.getHrKpis();
    }
    async getTimeOffKpis() {
        return this.dashboardService.getTimeOffAdminKpis();
    }
    async getPayrollKpis() {
        return this.dashboardService.getPayrollKpis();
    }
    async getPayrollTrend() {
        return this.dashboardService.getPayrollTrend();
    }
};
exports.DashboardController = DashboardController;
__decorate([
    (0, common_1.Get)('my-kpis'),
    (0, permissions_decorator_1.Permissions)('employees.read'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getMyKpis", null);
__decorate([
    (0, common_1.Get)('hr-kpis'),
    (0, permissions_decorator_1.Permissions)('employees.read'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getHrKpis", null);
__decorate([
    (0, common_1.Get)('time-off-kpis'),
    (0, permissions_decorator_1.Permissions)('time-off-requests.read'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getTimeOffKpis", null);
__decorate([
    (0, common_1.Get)('payroll-kpis'),
    (0, permissions_decorator_1.Permissions)('payroll.read'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getPayrollKpis", null);
__decorate([
    (0, common_1.Get)('payroll-trend'),
    (0, permissions_decorator_1.Permissions)('payroll.read'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getPayrollTrend", null);
exports.DashboardController = DashboardController = __decorate([
    (0, common_1.Controller)('dashboard'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    __metadata("design:paramtypes", [dashboard_service_1.DashboardService])
], DashboardController);
//# sourceMappingURL=dashboard.controller.js.map