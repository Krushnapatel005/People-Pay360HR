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
exports.ContractsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ContractsService = class ContractsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll() {
        return this.prisma.contract.findMany({ include: { employee: true } });
    }
    async findById(id) {
        const contract = await this.prisma.contract.findUnique({ where: { id }, include: { employee: true } });
        if (!contract)
            throw new common_1.NotFoundException('Contract not found');
        return contract;
    }
    async create(createContractDto) {
        await this.validateContractDates(createContractDto.employeeId, createContractDto.startDate, createContractDto.endDate);
        return this.prisma.contract.create({ data: createContractDto });
    }
    async update(id, updateContractDto) {
        try {
            const existing = await this.findById(id);
            const newStartDate = updateContractDto.startDate || existing.startDate;
            const newEndDate = updateContractDto.endDate !== undefined ? updateContractDto.endDate : existing.endDate;
            await this.validateContractDates(existing.employeeId, newStartDate, newEndDate, id);
            return await this.prisma.contract.update({
                where: { id },
                data: updateContractDto,
            });
        }
        catch (e) {
            if (e.status === 409)
                throw e;
            throw new common_1.NotFoundException('Contract not found');
        }
    }
    async remove(id) {
        try {
            return await this.prisma.contract.delete({ where: { id } });
        }
        catch {
            throw new common_1.NotFoundException('Contract not found');
        }
    }
    async findApplicableContract(employeeId, periodStart, periodEnd) {
        const contracts = await this.prisma.contract.findMany({
            where: {
                employeeId,
                startDate: { lte: periodEnd },
                OR: [
                    { endDate: null },
                    { endDate: { gte: periodStart } }
                ]
            }
        });
        if (contracts.length === 0) {
            return null;
        }
        if (contracts.length > 1) {
            throw new Error(`Multiple active contracts found for employee ${employeeId} in period ${periodStart} to ${periodEnd}`);
        }
        return contracts[0];
    }
    async validateContractDates(employeeId, startDate, endDate, excludeContractId) {
        const normalizeDate = (d) => {
            const date = new Date(d);
            return Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
        };
        const existingContracts = await this.prisma.contract.findMany({
            where: {
                employeeId,
                id: excludeContractId ? { not: excludeContractId } : undefined
            }
        });
        const sDateMs = normalizeDate(startDate);
        const eDateMs = endDate ? normalizeDate(endDate) : Infinity;
        for (const contract of existingContracts) {
            const aStart = normalizeDate(contract.startDate);
            const aEnd = contract.endDate ? normalizeDate(contract.endDate) : Infinity;
            if (aStart <= eDateMs && aEnd >= sDateMs) {
                throw new common_1.ConflictException(`Contract dates overlap with existing contract ${contract.reference || contract.id}`);
            }
        }
    }
};
exports.ContractsService = ContractsService;
exports.ContractsService = ContractsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ContractsService);
//# sourceMappingURL=contracts.service.js.map