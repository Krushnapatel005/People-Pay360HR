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
exports.ContractSchema = exports.Contract = exports.PayFrequency = exports.ContractStatus = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
var ContractStatus;
(function (ContractStatus) {
    ContractStatus["DRAFT"] = "DRAFT";
    ContractStatus["ACTIVE"] = "ACTIVE";
    ContractStatus["ENDED"] = "ENDED";
    ContractStatus["CANCELLED"] = "CANCELLED";
})(ContractStatus || (exports.ContractStatus = ContractStatus = {}));
var PayFrequency;
(function (PayFrequency) {
    PayFrequency["MONTHLY"] = "MONTHLY";
    PayFrequency["BIWEEKLY"] = "BIWEEKLY";
    PayFrequency["WEEKLY"] = "WEEKLY";
    PayFrequency["HOURLY"] = "HOURLY";
})(PayFrequency || (exports.PayFrequency = PayFrequency = {}));
let Contract = class Contract {
    reference;
    employeeId;
    companyId;
    departmentId;
    contractType;
    jobTitle;
    startDate;
    endDate;
    probationEndDate;
    status;
    wageAmount;
    currency;
    payFrequency;
    salaryStructureId;
    scheduleId;
    notes;
    isActive;
};
exports.Contract = Contract;
__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true }),
    __metadata("design:type", String)
], Contract.prototype, "reference", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Employee', required: true }),
    __metadata("design:type", Object)
], Contract.prototype, "employeeId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Company', required: true }),
    __metadata("design:type", Object)
], Contract.prototype, "companyId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Department' }),
    __metadata("design:type", Object)
], Contract.prototype, "departmentId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Contract.prototype, "contractType", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Contract.prototype, "jobTitle", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Date)
], Contract.prototype, "startDate", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Contract.prototype, "endDate", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Contract.prototype, "probationEndDate", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, enum: ContractStatus, default: ContractStatus.DRAFT }),
    __metadata("design:type", String)
], Contract.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], Contract.prototype, "wageAmount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 'INR' }),
    __metadata("design:type", String)
], Contract.prototype, "currency", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, enum: PayFrequency, required: true }),
    __metadata("design:type", String)
], Contract.prototype, "payFrequency", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'SalaryStructure' }),
    __metadata("design:type", Object)
], Contract.prototype, "salaryStructureId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'WorkingSchedule' }),
    __metadata("design:type", Object)
], Contract.prototype, "scheduleId", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Contract.prototype, "notes", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], Contract.prototype, "isActive", void 0);
exports.Contract = Contract = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Contract);
exports.ContractSchema = mongoose_1.SchemaFactory.createForClass(Contract);
exports.ContractSchema.index({ reference: 1 }, { unique: true });
exports.ContractSchema.index({ employeeId: 1, startDate: 1, endDate: 1 });
exports.ContractSchema.index({ companyId: 1, status: 1 });
exports.ContractSchema.index({ scheduleId: 1 });
exports.ContractSchema.index({ salaryStructureId: 1 });
//# sourceMappingURL=contract.schema.js.map