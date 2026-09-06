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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkingScheduleSchema = exports.WorkingSchedule = exports.WorkDaySchema = exports.WorkDay = exports.ScheduleType = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
var ScheduleType;
(function (ScheduleType) {
    ScheduleType["FIXED"] = "FIXED";
    ScheduleType["FLEXIBLE"] = "FLEXIBLE";
    ScheduleType["SHIFT"] = "SHIFT";
})(ScheduleType || (exports.ScheduleType = ScheduleType = {}));
let WorkDay = class WorkDay {
    dayOfWeek;
    isWorkingDay;
    startTime;
    endTime;
    breakMinutes;
};
exports.WorkDay = WorkDay;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], WorkDay.prototype, "dayOfWeek", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], WorkDay.prototype, "isWorkingDay", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], WorkDay.prototype, "startTime", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], WorkDay.prototype, "endTime", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], WorkDay.prototype, "breakMinutes", void 0);
exports.WorkDay = WorkDay = __decorate([
    (0, mongoose_1.Schema)()
], WorkDay);
exports.WorkDaySchema = mongoose_1.SchemaFactory.createForClass(WorkDay);
let WorkingSchedule = class WorkingSchedule {
    name;
    code;
    companyId;
    type;
    timezone;
    weeklyHours;
    workDays;
    breakMinutes;
    flexibleTimeEnabled;
    shiftEnabled;
    isActive;
};
exports.WorkingSchedule = WorkingSchedule;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], WorkingSchedule.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], WorkingSchedule.prototype, "code", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Company', required: true }),
    __metadata("design:type", Object)
], WorkingSchedule.prototype, "companyId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, enum: ScheduleType, default: ScheduleType.FIXED }),
    __metadata("design:type", String)
], WorkingSchedule.prototype, "type", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 'Asia/Kolkata' }),
    __metadata("design:type", String)
], WorkingSchedule.prototype, "timezone", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], WorkingSchedule.prototype, "weeklyHours", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [exports.WorkDaySchema], default: [] }),
    __metadata("design:type", Array)
], WorkingSchedule.prototype, "workDays", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], WorkingSchedule.prototype, "breakMinutes", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], WorkingSchedule.prototype, "flexibleTimeEnabled", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], WorkingSchedule.prototype, "shiftEnabled", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], WorkingSchedule.prototype, "isActive", void 0);
exports.WorkingSchedule = WorkingSchedule = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], WorkingSchedule);
exports.WorkingScheduleSchema = mongoose_1.SchemaFactory.createForClass(WorkingSchedule);
exports.WorkingScheduleSchema.index({ companyId: 1, code: 1 }, { unique: true });
exports.WorkingScheduleSchema.index({ companyId: 1, isActive: 1 });
//# sourceMappingURL=working-schedule.schema.js.map