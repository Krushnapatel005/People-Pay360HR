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
exports.EmployeeSchema = exports.Employee = exports.EmploymentStatus = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
var EmploymentStatus;
(function (EmploymentStatus) {
    EmploymentStatus["ACTIVE"] = "ACTIVE";
    EmploymentStatus["ON_LEAVE"] = "ON_LEAVE";
    EmploymentStatus["INACTIVE"] = "INACTIVE";
    EmploymentStatus["TERMINATED"] = "TERMINATED";
})(EmploymentStatus || (exports.EmploymentStatus = EmploymentStatus = {}));
let Employee = class Employee {
    employeeNumber;
    firstName;
    lastName;
    preferredName;
    workEmail;
    personalEmail;
    phone;
    dateOfBirth;
    address;
    jobTitle;
    departmentId;
    managerEmployeeId;
    companyId;
    employmentStatus;
    startDate;
    endDate;
    scheduleId;
    userId;
    isActive;
};
exports.Employee = Employee;
__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true }),
    __metadata("design:type", String)
], Employee.prototype, "employeeNumber", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Employee.prototype, "firstName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Employee.prototype, "lastName", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Employee.prototype, "preferredName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true }),
    __metadata("design:type", String)
], Employee.prototype, "workEmail", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Employee.prototype, "personalEmail", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Employee.prototype, "phone", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Employee.prototype, "dateOfBirth", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Employee.prototype, "address", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Employee.prototype, "jobTitle", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Department' }),
    __metadata("design:type", Object)
], Employee.prototype, "departmentId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Employee' }),
    __metadata("design:type", Object)
], Employee.prototype, "managerEmployeeId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Company' }),
    __metadata("design:type", Object)
], Employee.prototype, "companyId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, enum: EmploymentStatus, default: EmploymentStatus.ACTIVE }),
    __metadata("design:type", String)
], Employee.prototype, "employmentStatus", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Date)
], Employee.prototype, "startDate", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Employee.prototype, "endDate", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'WorkingSchedule' }),
    __metadata("design:type", typeof (_d = typeof mongoose_2.Types !== "undefined" && mongoose_2.Types.ObjectId) === "function" ? _d : Object)
], Employee.prototype, "scheduleId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User' }),
    __metadata("design:type", Object)
], Employee.prototype, "userId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], Employee.prototype, "isActive", void 0);
exports.Employee = Employee = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Employee);
exports.EmployeeSchema = mongoose_1.SchemaFactory.createForClass(Employee);
exports.EmployeeSchema.index({ companyId: 1, departmentId: 1 });
exports.EmployeeSchema.index({ managerEmployeeId: 1 });
exports.EmployeeSchema.index({ employmentStatus: 1 });
exports.EmployeeSchema.index({ scheduleId: 1 });
//# sourceMappingURL=employee.schema.js.map