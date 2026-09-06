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
exports.SalaryStructureSchema = exports.SalaryStructure = exports.StructureStatus = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
var StructureStatus;
(function (StructureStatus) {
    StructureStatus["DRAFT"] = "DRAFT";
    StructureStatus["ACTIVE"] = "ACTIVE";
    StructureStatus["INACTIVE"] = "INACTIVE";
    StructureStatus["ARCHIVED"] = "ARCHIVED";
})(StructureStatus || (exports.StructureStatus = StructureStatus = {}));
let SalaryStructure = class SalaryStructure {
    name;
    code;
    companyId;
    payFrequency;
    description;
    ruleIds;
    status;
    version;
    effectiveFrom;
    effectiveTo;
};
exports.SalaryStructure = SalaryStructure;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], SalaryStructure.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], SalaryStructure.prototype, "code", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Company', required: true }),
    __metadata("design:type", Object)
], SalaryStructure.prototype, "companyId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], SalaryStructure.prototype, "payFrequency", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], SalaryStructure.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [{ type: mongoose_2.Types.ObjectId, ref: 'SalaryRule' }] }),
    __metadata("design:type", Array)
], SalaryStructure.prototype, "ruleIds", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, enum: StructureStatus, default: StructureStatus.DRAFT }),
    __metadata("design:type", String)
], SalaryStructure.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, default: 1 }),
    __metadata("design:type", Number)
], SalaryStructure.prototype, "version", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], SalaryStructure.prototype, "effectiveFrom", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], SalaryStructure.prototype, "effectiveTo", void 0);
exports.SalaryStructure = SalaryStructure = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], SalaryStructure);
exports.SalaryStructureSchema = mongoose_1.SchemaFactory.createForClass(SalaryStructure);
exports.SalaryStructureSchema.index({ companyId: 1, code: 1 }, { unique: true });
exports.SalaryStructureSchema.index({ companyId: 1, status: 1 });
//# sourceMappingURL=salary-structure.schema.js.map