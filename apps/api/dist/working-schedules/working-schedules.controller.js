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
exports.WorkingSchedulesController = void 0;
const common_1 = require("@nestjs/common");
const working_schedules_service_1 = require("./working-schedules.service");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const permissions_guard_1 = require("../common/guards/permissions.guard");
const permissions_decorator_1 = require("../common/decorators/permissions.decorator");
let WorkingSchedulesController = class WorkingSchedulesController {
    workingSchedulesService;
    constructor(workingSchedulesService) {
        this.workingSchedulesService = workingSchedulesService;
    }
    create(createDto) {
        return this.workingSchedulesService.create(createDto);
    }
    findAll() {
        return this.workingSchedulesService.findAll();
    }
    findById(id) {
        return this.workingSchedulesService.findById(id);
    }
    update(id, updateDto) {
        return this.workingSchedulesService.update(id, updateDto);
    }
    remove(id) {
        return this.workingSchedulesService.remove(id);
    }
};
exports.WorkingSchedulesController = WorkingSchedulesController;
__decorate([
    (0, common_1.Post)(),
    (0, permissions_decorator_1.Permissions)('working_schedules.create'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], WorkingSchedulesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, permissions_decorator_1.Permissions)('working_schedules.read'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], WorkingSchedulesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, permissions_decorator_1.Permissions)('working_schedules.read'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], WorkingSchedulesController.prototype, "findById", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, permissions_decorator_1.Permissions)('working_schedules.update'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], WorkingSchedulesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, permissions_decorator_1.Permissions)('working_schedules.archive'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], WorkingSchedulesController.prototype, "remove", null);
exports.WorkingSchedulesController = WorkingSchedulesController = __decorate([
    (0, common_1.Controller)('working-schedules'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    __metadata("design:paramtypes", [working_schedules_service_1.WorkingSchedulesService])
], WorkingSchedulesController);
//# sourceMappingURL=working-schedules.controller.js.map