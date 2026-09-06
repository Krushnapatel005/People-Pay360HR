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
exports.AttendanceSchema = exports.Attendance = exports.CorrectionStatus = exports.AttendanceSource = exports.AttendanceStatus = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
var AttendanceStatus;
(function (AttendanceStatus) {
    AttendanceStatus["PRESENT"] = "PRESENT";
    AttendanceStatus["ABSENT"] = "ABSENT";
    AttendanceStatus["LATE"] = "LATE";
    AttendanceStatus["INCOMPLETE"] = "INCOMPLETE";
    AttendanceStatus["ON_LEAVE"] = "ON_LEAVE";
    AttendanceStatus["HOLIDAY"] = "HOLIDAY";
})(AttendanceStatus || (exports.AttendanceStatus = AttendanceStatus = {}));
var AttendanceSource;
(function (AttendanceSource) {
    AttendanceSource["SELF_SERVICE"] = "SELF_SERVICE";
    AttendanceSource["HR_MANUAL"] = "HR_MANUAL";
    AttendanceSource["IMPORT"] = "IMPORT";
    AttendanceSource["SYSTEM"] = "SYSTEM";
})(AttendanceSource || (exports.AttendanceSource = AttendanceSource = {}));
var CorrectionStatus;
(function (CorrectionStatus) {
    CorrectionStatus["NONE"] = "NONE";
    CorrectionStatus["PENDING"] = "PENDING";
    CorrectionStatus["APPROVED"] = "APPROVED";
    CorrectionStatus["REJECTED"] = "REJECTED";
})(CorrectionStatus || (exports.CorrectionStatus = CorrectionStatus = {}));
let Attendance = class Attendance {
    employeeId;
    companyId;
    scheduleId;
    date;
    checkIn;
    checkOut;
    breakMinutes;
    totalMinutes;
    scheduledMinutes;
    varianceMinutes;
    status;
    source;
    notes;
    correctionStatus;
    isLocked;
};
exports.Attendance = Attendance;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Employee', required: true }),
    __metadata("design:type", Object)
], Attendance.prototype, "employeeId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Company', required: true }),
    __metadata("design:type", Object)
], Attendance.prototype, "companyId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'WorkingSchedule' }),
    __metadata("design:type", Object)
], Attendance.prototype, "scheduleId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Date)
], Attendance.prototype, "date", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Attendance.prototype, "checkIn", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Attendance.prototype, "checkOut", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], Attendance.prototype, "breakMinutes", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], Attendance.prototype, "totalMinutes", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], Attendance.prototype, "scheduledMinutes", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], Attendance.prototype, "varianceMinutes", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, enum: AttendanceStatus, default: AttendanceStatus.PRESENT }),
    __metadata("design:type", String)
], Attendance.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, enum: AttendanceSource, default: AttendanceSource.SYSTEM }),
    __metadata("design:type", String)
], Attendance.prototype, "source", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Attendance.prototype, "notes", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, enum: CorrectionStatus, default: CorrectionStatus.NONE }),
    __metadata("design:type", String)
], Attendance.prototype, "correctionStatus", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], Attendance.prototype, "isLocked", void 0);
exports.Attendance = Attendance = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Attendance);
exports.AttendanceSchema = mongoose_1.SchemaFactory.createForClass(Attendance);
exports.AttendanceSchema.index({ employeeId: 1, date: 1 }, { unique: true });
exports.AttendanceSchema.index({ companyId: 1, date: 1 });
exports.AttendanceSchema.index({ status: 1 });
exports.AttendanceSchema.index({ scheduleId: 1 });
//# sourceMappingURL=attendance.schema.js.map