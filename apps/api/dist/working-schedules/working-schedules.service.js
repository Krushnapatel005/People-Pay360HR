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
exports.WorkingSchedulesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let WorkingSchedulesService = class WorkingSchedulesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll() {
        return this.prisma.workingSchedule.findMany({ include: { days: true } });
    }
    async findById(id) {
        const schedule = await this.prisma.workingSchedule.findUnique({ where: { id }, include: { days: true } });
        if (!schedule)
            throw new common_1.NotFoundException('Working Schedule not found');
        return schedule;
    }
    calculateWeeklyHours(days = []) {
        let totalMinutes = 0;
        for (const day of days) {
            if (!day.startTime || !day.endTime)
                continue;
            const [startH, startM] = day.startTime.split(':').map(Number);
            const [endH, endM] = day.endTime.split(':').map(Number);
            const startTotal = startH * 60 + startM;
            let endTotal = endH * 60 + endM;
            if (endTotal < startTotal) {
                endTotal += 24 * 60;
            }
            const worked = endTotal - startTotal - (day.breakMinutes || 0);
            if (worked > 0)
                totalMinutes += worked;
        }
        return totalMinutes / 60;
    }
    async create(createDto) {
        if (createDto.days) {
            createDto.weeklyHours = this.calculateWeeklyHours(createDto.days);
            const days = createDto.days;
            delete createDto.days;
            return this.prisma.workingSchedule.create({
                data: {
                    ...createDto,
                    days: { create: days },
                },
            });
        }
        return this.prisma.workingSchedule.create({ data: createDto });
    }
    async update(id, updateDto) {
        try {
            if (updateDto.days) {
                updateDto.weeklyHours = this.calculateWeeklyHours(updateDto.days);
                const days = updateDto.days;
                delete updateDto.days;
                return await this.prisma.workingSchedule.update({
                    where: { id },
                    data: {
                        ...updateDto,
                        days: {
                            deleteMany: {},
                            create: days,
                        },
                    },
                });
            }
            return await this.prisma.workingSchedule.update({
                where: { id },
                data: updateDto,
            });
        }
        catch {
            throw new common_1.NotFoundException('Working Schedule not found');
        }
    }
    async remove(id) {
        try {
            return await this.prisma.workingSchedule.delete({ where: { id } });
        }
        catch {
            throw new common_1.NotFoundException('Working Schedule not found');
        }
    }
};
exports.WorkingSchedulesService = WorkingSchedulesService;
exports.WorkingSchedulesService = WorkingSchedulesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], WorkingSchedulesService);
//# sourceMappingURL=working-schedules.service.js.map