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
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PayslipSchema = exports.Payslip = exports.EmailDeliveryStatus = exports.PayslipStatus = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
var PayslipStatus;
(function (PayslipStatus) {
    PayslipStatus["DRAFT"] = "DRAFT";
    PayslipStatus["GENERATED"] = "GENERATED";
    PayslipStatus["PUBLISHED"] = "PUBLISHED";
    PayslipStatus["ARCHIVED"] = "ARCHIVED";
})(PayslipStatus || (exports.PayslipStatus = PayslipStatus = {}));
var EmailDeliveryStatus;
(function (EmailDeliveryStatus) {
    EmailDeliveryStatus["NOT_SENT"] = "NOT_SENT";
    EmailDeliveryStatus["QUEUED"] = "QUEUED";
    EmailDeliveryStatus["SENT"] = "SENT";
    EmailDeliveryStatus["FAILED"] = "FAILED";
})(EmailDeliveryStatus || (exports.EmailDeliveryStatus = EmailDeliveryStatus = {}));
let Payslip = class Payslip {
    reference;
    payrunId;
    employeeId;
    contractSnapshot;
    salaryStructureSnapshot;
    salaryRuleSnapshots;
    companySnapshot;
    periodStart;
    periodEnd;
    earnings;
    deductions;
    employerContributions;
    grossPay;
    netPay;
    status;
    pdfUrl;
    emailDeliveryStatus;
    publishedAt;
    sentAt;
};
exports.Payslip = Payslip;
__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true }),
    __metadata("design:type", String)
], Payslip.prototype, "reference", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Payrun', required: true }),
    __metadata("design:type", Object)
], Payslip.prototype, "payrunId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Employee', required: true }),
    __metadata("design:type", Object)
], Payslip.prototype, "employeeId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object }),
    __metadata("design:type", Object)
], Payslip.prototype, "contractSnapshot", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object }),
    __metadata("design:type", Object)
], Payslip.prototype, "salaryStructureSnapshot", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [Object] }),
    __metadata("design:type", Array)
], Payslip.prototype, "salaryRuleSnapshots", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object }),
    __metadata("design:type", Object)
], Payslip.prototype, "companySnapshot", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Date)
], Payslip.prototype, "periodStart", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Date)
], Payslip.prototype, "periodEnd", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [{ name: String, amount: Number }] }),
    __metadata("design:type", Array)
], Payslip.prototype, "earnings", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [{ name: String, amount: Number }] }),
    __metadata("design:type", Array)
], Payslip.prototype, "deductions", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [{ name: String, amount: Number }] }),
    __metadata("design:type", Array)
], Payslip.prototype, "employerContributions", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Payslip.prototype, "grossPay", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Payslip.prototype, "netPay", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, enum: PayslipStatus, default: PayslipStatus.DRAFT }),
    __metadata("design:type", String)
], Payslip.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Payslip.prototype, "pdfUrl", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, enum: EmailDeliveryStatus, default: EmailDeliveryStatus.NOT_SENT }),
    __metadata("design:type", String)
], Payslip.prototype, "emailDeliveryStatus", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Payslip.prototype, "publishedAt", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Payslip.prototype, "sentAt", void 0);
exports.Payslip = Payslip = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Payslip);
exports.PayslipSchema = mongoose_1.SchemaFactory.createForClass(Payslip);
exports.PayslipSchema.index({ reference: 1 }, { unique: true });
exports.PayslipSchema.index({ payrunId: 1, employeeId: 1 }, { unique: true });
exports.PayslipSchema.index({ employeeId: 1, periodStart: 1, periodEnd: 1 });
exports.PayslipSchema.index({ status: 1 });
exports.PayslipSchema.index({ emailDeliveryStatus: 1 });
//# sourceMappingURL=payslip.schema.js.map