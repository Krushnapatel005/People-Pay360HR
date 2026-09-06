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
exports.TimeOffService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let TimeOffService = class TimeOffService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(employeeId) {
        const where = employeeId ? { employeeId } : {};
        return this.prisma.timeOffRequest.findMany({ where, include: { employee: true, timeOffType: true } });
    }
    async findById(id) {
        const record = await this.prisma.timeOffRequest.findUnique({ where: { id }, include: { employee: true, timeOffType: true } });
        if (!record)
            throw new common_1.NotFoundException('Time off request not found');
        return record;
    }
    async create(createDto) {
        if (createDto.startDate && createDto.endDate) {
            const start = new Date(createDto.startDate).getTime();
            const end = new Date(createDto.endDate).getTime();
            if (end < start) {
                throw new common_1.BadRequestException('End date must be after start date');
            }
            const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
            createDto.duration = days;
        }
        return this.prisma.timeOffRequest.create({ data: createDto });
    }
    async update(id, updateDto) {
        try {
            return await this.prisma.timeOffRequest.update({
                where: { id },
                data: updateDto,
            });
        }
        catch {
            throw new common_1.NotFoundException('Time off request not found');
        }
    }
    async approve(id) {
        return this.prisma.$transaction(async (tx) => {
            const request = await tx.timeOffRequest.findUnique({ where: { id } });
            if (!request)
                throw new common_1.NotFoundException('Request not found');
            if (request.status === 'APPROVED') {
                throw new common_1.ConflictException('Request is already approved');
            }
            if (request.leaveAllocationId) {
                const allocation = await tx.leaveAllocation.findUnique({ where: { id: request.leaveAllocationId } });
                if (allocation) {
                    const reqDuration = Number(request.duration);
                    const remaining = Number(allocation.remainingAmount);
                    if (remaining < reqDuration) {
                        throw new common_1.BadRequestException('Insufficient leave balance');
                    }
                    await tx.leaveAllocation.update({
                        where: { id: allocation.id },
                        data: {
                            takenAmount: Number(allocation.takenAmount) + reqDuration,
                            remainingAmount: remaining - reqDuration
                        }
                    });
                }
            }
            const updateResult = await tx.timeOffRequest.updateMany({
                where: { id, status: { not: 'APPROVED' } },
                data: { status: 'APPROVED' }
            });
            if (updateResult.count === 0) {
                throw new common_1.ConflictException('Request is already approved or no longer available');
            }
            return tx.timeOffRequest.findUnique({ where: { id } });
        });
    }
    async refuse(id) {
        const request = await this.prisma.timeOffRequest.findUnique({ where: { id } });
        if (!request)
            throw new common_1.NotFoundException('Request not found');
        if (request.status === 'APPROVED' && request.leaveAllocationId) {
            await this.prisma.$transaction(async (tx) => {
                const allocation = await tx.leaveAllocation.findUnique({ where: { id: request.leaveAllocationId } });
                if (allocation) {
                    await tx.leaveAllocation.update({
                        where: { id: allocation.id },
                        data: {
                            takenAmount: Number(allocation.takenAmount) - Number(request.duration),
                            remainingAmount: Number(allocation.remainingAmount) + Number(request.duration)
                        }
                    });
                }
                await tx.timeOffRequest.update({ where: { id }, data: { status: 'REJECTED' } });
            });
            return;
        }
        return this.prisma.timeOffRequest.update({
            where: { id },
            data: { status: 'REJECTED' }
        });
    }
    async remove(id) {
        try {
            return await this.prisma.timeOffRequest.delete({ where: { id } });
        }
        catch {
            throw new common_1.NotFoundException('Time off request not found');
        }
    }
    async findTypes() { return this.prisma.timeOffType.findMany(); }
    async createType(data) { return this.prisma.timeOffType.create({ data }); }
    async updateType(id, data) { return this.prisma.timeOffType.update({ where: { id }, data }); }
    async removeType(id) { return this.prisma.timeOffType.delete({ where: { id } }); }
    async findAllocations(employeeId) {
        const where = employeeId ? { employeeId } : {};
        return this.prisma.leaveAllocation.findMany({ where, include: { timeOffType: true, employee: true } });
    }
    async createAllocation(data) { return this.prisma.leaveAllocation.create({ data }); }
    async updateAllocation(id, data) { return this.prisma.leaveAllocation.update({ where: { id }, data }); }
    async removeAllocation(id) { return this.prisma.leaveAllocation.delete({ where: { id } }); }
};
exports.TimeOffService = TimeOffService;
exports.TimeOffService = TimeOffService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TimeOffService);
//# sourceMappingURL=time-off.service.js.map