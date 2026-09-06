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
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttendanceCorrectionRequestSchema = exports.AttendanceCorrectionRequest = exports.CorrectionRequestStatus = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
var CorrectionRequestStatus;
(function (CorrectionRequestStatus) {
    CorrectionRequestStatus["PENDING"] = "PENDING";
    CorrectionRequestStatus["APPROVED"] = "APPROVED";
    CorrectionRequestStatus["REJECTED"] = "REJECTED";
    CorrectionRequestStatus["CANCELLED"] = "CANCELLED";
})(CorrectionRequestStatus || (exports.CorrectionRequestStatus = CorrectionRequestStatus = {}));
let AttendanceCorrectionRequest = class AttendanceCorrectionRequest {
    attendanceRecordId;
    employeeId;
    requestedCheckIn;
    requestedCheckOut;
    reason;
    attachmentUrls;
    status;
    reviewedBy;
    reviewedAt;
    reviewReason;
};
exports.AttendanceCorrectionRequest = AttendanceCorrectionRequest;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Attendance', required: true }),
    __metadata("design:type", Object)
], AttendanceCorrectionRequest.prototype, "attendanceRecordId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Employee', required: true }),
    __metadata("design:type", Object)
], AttendanceCorrectionRequest.prototype, "employeeId", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], AttendanceCorrectionRequest.prototype, "requestedCheckIn", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], AttendanceCorrectionRequest.prototype, "requestedCheckOut", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], AttendanceCorrectionRequest.prototype, "reason", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String] }),
    __metadata("design:type", Array)
], AttendanceCorrectionRequest.prototype, "attachmentUrls", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, enum: CorrectionRequestStatus, default: CorrectionRequestStatus.PENDING }),
    __metadata("design:type", String)
], AttendanceCorrectionRequest.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User' }),
    __metadata("design:type", Object)
], AttendanceCorrectionRequest.prototype, "reviewedBy", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], AttendanceCorrectionRequest.prototype, "reviewedAt", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], AttendanceCorrectionRequest.prototype, "reviewReason", void 0);
exports.AttendanceCorrectionRequest = AttendanceCorrectionRequest = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], AttendanceCorrectionRequest);
exports.AttendanceCorrectionRequestSchema = mongoose_1.SchemaFactory.createForClass(AttendanceCorrectionRequest);
//# sourceMappingURL=attendance-correction-request.schema.js.map