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
exports.SalaryRuleSchema = exports.SalaryRule = exports.CalculationMethod = exports.RuleCategory = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
var RuleCategory;
(function (RuleCategory) {
    RuleCategory["BASIC_SALARY"] = "BASIC_SALARY";
    RuleCategory["ALLOWANCE"] = "ALLOWANCE";
    RuleCategory["DEDUCTION"] = "DEDUCTION";
    RuleCategory["TAX"] = "TAX";
    RuleCategory["EMPLOYER_CONTRIBUTION"] = "EMPLOYER_CONTRIBUTION";
    RuleCategory["GROSS"] = "GROSS";
    RuleCategory["NET"] = "NET";
})(RuleCategory || (exports.RuleCategory = RuleCategory = {}));
var CalculationMethod;
(function (CalculationMethod) {
    CalculationMethod["FIXED"] = "FIXED";
    CalculationMethod["PERCENTAGE"] = "PERCENTAGE";
    CalculationMethod["FORMULA"] = "FORMULA";
    CalculationMethod["CONDITIONAL"] = "CONDITIONAL";
})(CalculationMethod || (exports.CalculationMethod = CalculationMethod = {}));
let SalaryRule = class SalaryRule {
    name;
    code;
    companyId;
    category;
    calculationMethod;
    fixedAmount;
    percentage;
    formula;
    baseRuleId;
    sequence;
    conditions;
    dependencyRuleIds;
    isActive;
};
exports.SalaryRule = SalaryRule;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], SalaryRule.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], SalaryRule.prototype, "code", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Company', required: true }),
    __metadata("design:type", Object)
], SalaryRule.prototype, "companyId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, enum: RuleCategory, required: true }),
    __metadata("design:type", String)
], SalaryRule.prototype, "category", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, enum: CalculationMethod, required: true }),
    __metadata("design:type", String)
], SalaryRule.prototype, "calculationMethod", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], SalaryRule.prototype, "fixedAmount", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], SalaryRule.prototype, "percentage", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], SalaryRule.prototype, "formula", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'SalaryRule' }),
    __metadata("design:type", Object)
], SalaryRule.prototype, "baseRuleId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, default: 0 }),
    __metadata("design:type", Number)
], SalaryRule.prototype, "sequence", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object }),
    __metadata("design:type", Object)
], SalaryRule.prototype, "conditions", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [{ type: mongoose_2.Types.ObjectId, ref: 'SalaryRule' }] }),
    __metadata("design:type", Array)
], SalaryRule.prototype, "dependencyRuleIds", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], SalaryRule.prototype, "isActive", void 0);
exports.SalaryRule = SalaryRule = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], SalaryRule);
exports.SalaryRuleSchema = mongoose_1.SchemaFactory.createForClass(SalaryRule);
exports.SalaryRuleSchema.index({ companyId: 1, code: 1 }, { unique: true });
exports.SalaryRuleSchema.index({ companyId: 1, category: 1 });
exports.SalaryRuleSchema.index({ sequence: 1 });
//# sourceMappingURL=salary-rule.schema.js.map