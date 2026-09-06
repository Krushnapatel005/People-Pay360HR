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
var _a, _b, _c, _d, _e, _f;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PayrunSchema = exports.Payrun = exports.PayrunStatus = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
var PayrunStatus;
(function (PayrunStatus) {
    PayrunStatus["DRAFT"] = "DRAFT";
    PayrunStatus["COMPUTED"] = "COMPUTED";
    PayrunStatus["VALIDATED"] = "VALIDATED";
    PayrunStatus["PAID"] = "PAID";
    PayrunStatus["CANCELLED"] = "CANCELLED";
})(PayrunStatus || (exports.PayrunStatus = PayrunStatus = {}));
let Payrun = class Payrun {
    reference;
    companyId;
    periodStart;
    periodEnd;
    payFrequency;
    salaryStructureId;
    selectedEmployeeIds;
    status;
    grossTotal;
    deductionTotal;
    netTotal;
    exceptionIds;
    createdBy;
    computedBy;
    computedAt;
    validatedBy;
    validatedAt;
    paidBy;
    paidAt;
    paymentReference;
    notes;
};
exports.Payrun = Payrun;
__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true }),
    __metadata("design:type", String)
], Payrun.prototype, "reference", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Company', required: true }),
    __metadata("design:type", Object)
], Payrun.prototype, "companyId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Date)
], Payrun.prototype, "periodStart", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Date)
], Payrun.prototype, "periodEnd", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Payrun.prototype, "payFrequency", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'SalaryStructure' }),
    __metadata("design:type", Object)
], Payrun.prototype, "salaryStructureId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [{ type: mongoose_2.Types.ObjectId, ref: 'Employee' }] }),
    __metadata("design:type", Array)
], Payrun.prototype, "selectedEmployeeIds", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, enum: PayrunStatus, default: PayrunStatus.DRAFT }),
    __metadata("design:type", String)
], Payrun.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Payrun.prototype, "grossTotal", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Payrun.prototype, "deductionTotal", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Payrun.prototype, "netTotal", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [{ type: mongoose_2.Types.ObjectId }] }),
    __metadata("design:type", Array)
], Payrun.prototype, "exceptionIds", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User' }),
    __metadata("design:type", Object)
], Payrun.prototype, "createdBy", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User' }),
    __metadata("design:type", Object)
], Payrun.prototype, "computedBy", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Payrun.prototype, "computedAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User' }),
    __metadata("design:type", Object)
], Payrun.prototype, "validatedBy", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Payrun.prototype, "validatedAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User' }),
    __metadata("design:type", Object)
], Payrun.prototype, "paidBy", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Payrun.prototype, "paidAt", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Payrun.prototype, "paymentReference", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Payrun.prototype, "notes", void 0);
exports.Payrun = Payrun = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Payrun);
exports.PayrunSchema = mongoose_1.SchemaFactory.createForClass(Payrun);
exports.PayrunSchema.index({ reference: 1 }, { unique: true });
exports.PayrunSchema.index({ companyId: 1, periodStart: 1, periodEnd: 1 });
exports.PayrunSchema.index({ status: 1 });
exports.PayrunSchema.index({ selectedEmployeeIds: 1 });
//# sourceMappingURL=payrun.schema.js.map