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
var _a, _b, _c, _d, _e;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimeOffRequestSchema = exports.TimeOffRequest = exports.ApprovalHistorySchema = exports.ApprovalHistory = exports.RequestStatus = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const time_off_type_schema_1 = require("./time-off-type.schema");
var RequestStatus;
(function (RequestStatus) {
    RequestStatus["DRAFT"] = "DRAFT";
    RequestStatus["PENDING"] = "PENDING";
    RequestStatus["APPROVED"] = "APPROVED";
    RequestStatus["REJECTED"] = "REJECTED";
    RequestStatus["CANCELLED"] = "CANCELLED";
    RequestStatus["WITHDRAWN"] = "WITHDRAWN";
})(RequestStatus || (exports.RequestStatus = RequestStatus = {}));
let ApprovalHistory = class ApprovalHistory {
    action;
    actorUserId;
    comment;
    createdAt;
};
exports.ApprovalHistory = ApprovalHistory;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], ApprovalHistory.prototype, "action", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User', required: true }),
    __metadata("design:type", Object)
], ApprovalHistory.prototype, "actorUserId", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], ApprovalHistory.prototype, "comment", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: Date.now }),
    __metadata("design:type", Date)
], ApprovalHistory.prototype, "createdAt", void 0);
exports.ApprovalHistory = ApprovalHistory = __decorate([
    (0, mongoose_1.Schema)()
], ApprovalHistory);
exports.ApprovalHistorySchema = mongoose_1.SchemaFactory.createForClass(ApprovalHistory);
let TimeOffRequest = class TimeOffRequest {
    reference;
    employeeId;
    timeOffTypeId;
    companyId;
    startDate;
    endDate;
    duration;
    unit;
    status;
    reason;
    attachmentUrls;
    approverIds;
    approvalHistory;
    leaveAllocationId;
};
exports.TimeOffRequest = TimeOffRequest;
__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true }),
    __metadata("design:type", String)
], TimeOffRequest.prototype, "reference", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Employee', required: true }),
    __metadata("design:type", Object)
], TimeOffRequest.prototype, "employeeId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'TimeOffType', required: true }),
    __metadata("design:type", Object)
], TimeOffRequest.prototype, "timeOffTypeId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Company', required: true }),
    __metadata("design:type", Object)
], TimeOffRequest.prototype, "companyId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Date)
], TimeOffRequest.prototype, "startDate", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Date)
], TimeOffRequest.prototype, "endDate", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], TimeOffRequest.prototype, "duration", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, enum: time_off_type_schema_1.TimeOffUnit, default: time_off_type_schema_1.TimeOffUnit.DAYS }),
    __metadata("design:type", String)
], TimeOffRequest.prototype, "unit", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, enum: RequestStatus, default: RequestStatus.PENDING }),
    __metadata("design:type", String)
], TimeOffRequest.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], TimeOffRequest.prototype, "reason", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String] }),
    __metadata("design:type", Array)
], TimeOffRequest.prototype, "attachmentUrls", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [{ type: mongoose_2.Types.ObjectId, ref: 'User' }] }),
    __metadata("design:type", Array)
], TimeOffRequest.prototype, "approverIds", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [exports.ApprovalHistorySchema], default: [] }),
    __metadata("design:type", Array)
], TimeOffRequest.prototype, "approvalHistory", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'LeaveAllocation' }),
    __metadata("design:type", Object)
], TimeOffRequest.prototype, "leaveAllocationId", void 0);
exports.TimeOffRequest = TimeOffRequest = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], TimeOffRequest);
exports.TimeOffRequestSchema = mongoose_1.SchemaFactory.createForClass(TimeOffRequest);
exports.TimeOffRequestSchema.index({ reference: 1 }, { unique: true });
exports.TimeOffRequestSchema.index({ employeeId: 1, startDate: 1, endDate: 1 });
exports.TimeOffRequestSchema.index({ timeOffTypeId: 1 });
exports.TimeOffRequestSchema.index({ status: 1 });
exports.TimeOffRequestSchema.index({ companyId: 1, status: 1 });
//# sourceMappingURL=time-off-request.schema.js.map