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
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeaveAllocationSchema = exports.LeaveAllocation = exports.LeaveAdjustmentSchema = exports.LeaveAdjustment = exports.AllocationStatus = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
var AllocationStatus;
(function (AllocationStatus) {
    AllocationStatus["ACTIVE"] = "ACTIVE";
    AllocationStatus["EXPIRED"] = "EXPIRED";
    AllocationStatus["CANCELLED"] = "CANCELLED";
})(AllocationStatus || (exports.AllocationStatus = AllocationStatus = {}));
let LeaveAdjustment = class LeaveAdjustment {
    amount;
    reason;
    adjustedBy;
    adjustedAt;
};
exports.LeaveAdjustment = LeaveAdjustment;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], LeaveAdjustment.prototype, "amount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], LeaveAdjustment.prototype, "reason", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User', required: true }),
    __metadata("design:type", Object)
], LeaveAdjustment.prototype, "adjustedBy", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: Date.now }),
    __metadata("design:type", Date)
], LeaveAdjustment.prototype, "adjustedAt", void 0);
exports.LeaveAdjustment = LeaveAdjustment = __decorate([
    (0, mongoose_1.Schema)()
], LeaveAdjustment);
exports.LeaveAdjustmentSchema = mongoose_1.SchemaFactory.createForClass(LeaveAdjustment);
let LeaveAllocation = class LeaveAllocation {
    employeeId;
    timeOffTypeId;
    companyId;
    validFrom;
    validTo;
    allocatedAmount;
    usedAmount;
    pendingAmount;
    remainingAmount;
    carryoverAmount;
    status;
    adjustments;
};
exports.LeaveAllocation = LeaveAllocation;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Employee', required: true }),
    __metadata("design:type", Object)
], LeaveAllocation.prototype, "employeeId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'TimeOffType', required: true }),
    __metadata("design:type", Object)
], LeaveAllocation.prototype, "timeOffTypeId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Company', required: true }),
    __metadata("design:type", Object)
], LeaveAllocation.prototype, "companyId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Date)
], LeaveAllocation.prototype, "validFrom", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Date)
], LeaveAllocation.prototype, "validTo", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, default: 0 }),
    __metadata("design:type", Number)
], LeaveAllocation.prototype, "allocatedAmount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], LeaveAllocation.prototype, "usedAmount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], LeaveAllocation.prototype, "pendingAmount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], LeaveAllocation.prototype, "remainingAmount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], LeaveAllocation.prototype, "carryoverAmount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, enum: AllocationStatus, default: AllocationStatus.ACTIVE }),
    __metadata("design:type", String)
], LeaveAllocation.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [exports.LeaveAdjustmentSchema], default: [] }),
    __metadata("design:type", Array)
], LeaveAllocation.prototype, "adjustments", void 0);
exports.LeaveAllocation = LeaveAllocation = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], LeaveAllocation);
exports.LeaveAllocationSchema = mongoose_1.SchemaFactory.createForClass(LeaveAllocation);
exports.LeaveAllocationSchema.index({ employeeId: 1, timeOffTypeId: 1, validFrom: 1, validTo: 1 }, { unique: true });
exports.LeaveAllocationSchema.index({ companyId: 1 });
exports.LeaveAllocationSchema.index({ validTo: 1 });
exports.LeaveAllocationSchema.index({ status: 1 });
//# sourceMappingURL=leave-allocation.schema.js.map