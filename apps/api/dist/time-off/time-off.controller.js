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
exports.TimeOffController = void 0;
const common_1 = require("@nestjs/common");
const time_off_service_1 = require("./time-off.service");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const permissions_guard_1 = require("../common/guards/permissions.guard");
const ownership_guard_1 = require("../common/guards/ownership.guard");
const permissions_decorator_1 = require("../common/decorators/permissions.decorator");
let TimeOffController = class TimeOffController {
    timeOffService;
    constructor(timeOffService) {
        this.timeOffService = timeOffService;
    }
    create(createDto) {
        return this.timeOffService.create(createDto);
    }
    findAll(req) {
        const isOnlyEmployee = req.user.roleIds.every((role) => role.code === 'EMPLOYEE');
        const filterEmployeeId = isOnlyEmployee ? req.user.employeeId : undefined;
        return this.timeOffService.findAll(filterEmployeeId);
    }
    async findById(id, req) {
        const record = await this.timeOffService.findById(id);
        const isOnlyEmployee = req.user.roleIds.every((role) => role.code === 'EMPLOYEE');
        if (isOnlyEmployee && record.employeeId.toString() !== req.user.employeeId.toString()) {
            throw new common_1.ForbiddenException('Cannot access time-off records for another employee');
        }
        return record;
    }
    update(id, updateDto) {
        return this.timeOffService.update(id, updateDto);
    }
    remove(id) {
        return this.timeOffService.remove(id);
    }
    approve(id) {
        return this.timeOffService.approve(id);
    }
    refuse(id) {
        return this.timeOffService.refuse(id);
    }
    findTypes() { return this.timeOffService.findTypes(); }
    createType(data) { return this.timeOffService.createType(data); }
    updateType(id, data) { return this.timeOffService.updateType(id, data); }
    removeType(id) { return this.timeOffService.removeType(id); }
    findAllocations(req) {
        const isOnlyEmployee = req.user.roleIds.every((role) => role.code === 'EMPLOYEE');
        const filterEmployeeId = isOnlyEmployee ? req.user.employeeId : undefined;
        return this.timeOffService.findAllocations(filterEmployeeId);
    }
    createAllocation(data) { return this.timeOffService.createAllocation(data); }
    updateAllocation(id, data) { return this.timeOffService.updateAllocation(id, data); }
    removeAllocation(id) { return this.timeOffService.removeAllocation(id); }
};
exports.TimeOffController = TimeOffController;
__decorate([
    (0, common_1.Post)(),
    (0, permissions_decorator_1.Permissions)('time_off.request'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], TimeOffController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, permissions_decorator_1.Permissions)('time_off.read'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], TimeOffController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, permissions_decorator_1.Permissions)('time_off.read'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], TimeOffController.prototype, "findById", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, permissions_decorator_1.Permissions)('time_off.request'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], TimeOffController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, permissions_decorator_1.Permissions)('time_off.request'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TimeOffController.prototype, "remove", null);
__decorate([
    (0, common_1.Patch)(':id/approve'),
    (0, permissions_decorator_1.Permissions)('time_off.approve'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TimeOffController.prototype, "approve", null);
__decorate([
    (0, common_1.Patch)(':id/refuse'),
    (0, permissions_decorator_1.Permissions)('time_off.approve'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TimeOffController.prototype, "refuse", null);
__decorate([
    (0, common_1.Get)('types'),
    (0, permissions_decorator_1.Permissions)('time_off.read_settings'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TimeOffController.prototype, "findTypes", null);
__decorate([
    (0, common_1.Post)('types'),
    (0, permissions_decorator_1.Permissions)('time_off.manage_settings'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], TimeOffController.prototype, "createType", null);
__decorate([
    (0, common_1.Patch)('types/:id'),
    (0, permissions_decorator_1.Permissions)('time_off.manage_settings'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], TimeOffController.prototype, "updateType", null);
__decorate([
    (0, common_1.Delete)('types/:id'),
    (0, permissions_decorator_1.Permissions)('time_off.manage_settings'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TimeOffController.prototype, "removeType", null);
__decorate([
    (0, common_1.Get)('allocations'),
    (0, permissions_decorator_1.Permissions)('time_off.read'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], TimeOffController.prototype, "findAllocations", null);
__decorate([
    (0, common_1.Post)('allocations'),
    (0, permissions_decorator_1.Permissions)('time_off.manage_allocations'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], TimeOffController.prototype, "createAllocation", null);
__decorate([
    (0, common_1.Patch)('allocations/:id'),
    (0, permissions_decorator_1.Permissions)('time_off.manage_allocations'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], TimeOffController.prototype, "updateAllocation", null);
__decorate([
    (0, common_1.Delete)('allocations/:id'),
    (0, permissions_decorator_1.Permissions)('time_off.manage_allocations'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TimeOffController.prototype, "removeAllocation", null);
exports.TimeOffController = TimeOffController = __decorate([
    (0, common_1.Controller)('time-off'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard, ownership_guard_1.OwnershipGuard),
    __metadata("design:paramtypes", [time_off_service_1.TimeOffService])
], TimeOffController);
//# sourceMappingURL=time-off.controller.js.map