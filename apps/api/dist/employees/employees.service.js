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
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let EmployeesService = class EmployeesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(skip = 0, take = 50, search, employeeId) {
        const where = {};
        if (search) {
            where.OR = [
                { firstName: { contains: search, mode: 'insensitive' } },
                { lastName: { contains: search, mode: 'insensitive' } },
                { department: { contains: search, mode: 'insensitive' } }
            ];
        }
        if (employeeId) {
            where.id = employeeId;
        }
        return this.prisma.employee.findMany({
            skip,
            take,
            where,
            orderBy: { createdAt: 'desc' }
        });
    }
    async findById(id) {
        const employee = await this.prisma.employee.findUnique({ where: { id } });
        if (!employee)
            throw new common_1.NotFoundException('Employee not found');
        return employee;
    }
    async create(createEmployeeDto) {
        try {
            if (!createEmployeeDto.employeeId) {
                createEmployeeDto.employeeId = `EMP-${Date.now().toString().slice(-6)}`;
            }
            return await this.prisma.employee.create({ data: createEmployeeDto });
        }
        catch (error) {
            if (error.code === 'P2002') {
                throw new common_1.ConflictException('An employee with this email or ID already exists');
            }
            throw error;
        }
    }
    async update(id, updateEmployeeDto) {
        try {
            return await this.prisma.employee.update({
                where: { id },
                data: updateEmployeeDto,
            });
        }
        catch {
            throw new common_1.NotFoundException('Employee not found');
        }
    }
    async remove(id) {
        const payslipCount = await this.prisma.payslip.count({
            where: { employeeId: id }
        });
        if (payslipCount > 0) {
            throw new common_1.ConflictException('Cannot delete employee because they have existing payslips/payroll history. Please archive instead.');
        }
        try {
            return await this.prisma.employee.delete({ where: { id } });
        }
        catch {
            throw new common_1.NotFoundException('Employee not found');
        }
    }
};
exports.EmployeesService = EmployeesService;
exports.EmployeesService = EmployeesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], EmployeesService);
//# sourceMappingURL=employees.service.js.map