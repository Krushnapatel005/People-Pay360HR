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
exports.AttendanceService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let AttendanceService = class AttendanceService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(employeeId) {
        const where = employeeId ? { employeeId } : {};
        return this.prisma.attendance.findMany({ where, include: { employee: true } });
    }
    async findById(id) {
        const record = await this.prisma.attendance.findUnique({ where: { id }, include: { employee: true } });
        if (!record)
            throw new common_1.NotFoundException('Attendance record not found');
        return record;
    }
    async create(createDto) {
        this.validateAttendance(createDto);
        this.calculateWorkedHours(createDto);
        return this.prisma.attendance.create({ data: createDto });
    }
    async update(id, updateDto) {
        try {
            const existing = await this.findById(id);
            const merged = { ...existing, ...updateDto };
            this.validateAttendance(merged);
            this.calculateWorkedHours(merged);
            return await this.prisma.attendance.update({
                where: { id },
                data: {
                    checkIn: merged.checkIn,
                    checkOut: merged.checkOut,
                    status: merged.status,
                    workedHours: merged.workedHours,
                },
            });
        }
        catch (e) {
            if (e.status === 400)
                throw e;
            throw new common_1.NotFoundException('Attendance record not found');
        }
    }
    async remove(id) {
        try {
            return await this.prisma.attendance.delete({ where: { id } });
        }
        catch {
            throw new common_1.NotFoundException('Attendance record not found');
        }
    }
    validateAttendance(data) {
        if (data.checkIn && data.checkOut) {
            const start = new Date(data.checkIn).getTime();
            const end = new Date(data.checkOut).getTime();
            if (end <= start) {
                throw new common_1.BadRequestException('Check-out time must be after check-in time');
            }
        }
    }
    calculateWorkedHours(data) {
        if (data.checkIn && data.checkOut) {
            const start = new Date(data.checkIn).getTime();
            const end = new Date(data.checkOut).getTime();
            const ms = end - start;
            const hours = ms / (1000 * 60 * 60);
            data.workedHours = hours;
        }
        else {
            data.workedHours = null;
        }
    }
};
exports.AttendanceService = AttendanceService;
exports.AttendanceService = AttendanceService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AttendanceService);
//# sourceMappingURL=attendance.service.js.map