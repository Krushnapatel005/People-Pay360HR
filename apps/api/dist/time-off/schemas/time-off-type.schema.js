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
exports.TimeOffTypeSchema = exports.TimeOffType = exports.TimeOffUnit = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
var TimeOffUnit;
(function (TimeOffUnit) {
    TimeOffUnit["DAYS"] = "DAYS";
    TimeOffUnit["HOURS"] = "HOURS";
})(TimeOffUnit || (exports.TimeOffUnit = TimeOffUnit = {}));
let TimeOffType = class TimeOffType {
    name;
    code;
    companyId;
    color;
    icon;
    isPaid;
    requiresAllocation;
    requiresApproval;
    unit;
    allowNegativeBalance;
    allowPartialDay;
    requiresAttachment;
    carryoverEnabled;
    maximumCarryover;
    minimumNoticeDays;
    maximumDuration;
    isActive;
};
exports.TimeOffType = TimeOffType;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], TimeOffType.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], TimeOffType.prototype, "code", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Company', required: true }),
    __metadata("design:type", Object)
], TimeOffType.prototype, "companyId", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], TimeOffType.prototype, "color", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], TimeOffType.prototype, "icon", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], TimeOffType.prototype, "isPaid", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], TimeOffType.prototype, "requiresAllocation", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], TimeOffType.prototype, "requiresApproval", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, enum: TimeOffUnit, default: TimeOffUnit.DAYS }),
    __metadata("design:type", String)
], TimeOffType.prototype, "unit", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], TimeOffType.prototype, "allowNegativeBalance", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], TimeOffType.prototype, "allowPartialDay", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], TimeOffType.prototype, "requiresAttachment", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], TimeOffType.prototype, "carryoverEnabled", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], TimeOffType.prototype, "maximumCarryover", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], TimeOffType.prototype, "minimumNoticeDays", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], TimeOffType.prototype, "maximumDuration", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], TimeOffType.prototype, "isActive", void 0);
exports.TimeOffType = TimeOffType = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], TimeOffType);
exports.TimeOffTypeSchema = mongoose_1.SchemaFactory.createForClass(TimeOffType);
exports.TimeOffTypeSchema.index({ companyId: 1, code: 1 }, { unique: true });
exports.TimeOffTypeSchema.index({ companyId: 1, isActive: 1 });
//# sourceMappingURL=time-off-type.schema.js.map