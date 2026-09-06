import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ContractsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.contract.findMany({ include: { employee: true } });
  }

  async findById(id: string) {
    const contract = await this.prisma.contract.findUnique({ where: { id }, include: { employee: true } });
    if (!contract) throw new NotFoundException('Contract not found');
    return contract;
  }

  async create(createContractDto: any) {
    await this.validateContractDates(createContractDto.employeeId, createContractDto.startDate, createContractDto.endDate);
    return this.prisma.contract.create({ data: createContractDto });
  }

  async update(id: string, updateContractDto: any) {
    try {
      const existing = await this.findById(id);
      
      const newStartDate = updateContractDto.startDate || existing.startDate;
      const newEndDate = updateContractDto.endDate !== undefined ? updateContractDto.endDate : existing.endDate;
      
      await this.validateContractDates(existing.employeeId, newStartDate, newEndDate, id);

      return await this.prisma.contract.update({
        where: { id },
        data: updateContractDto,
      });
    } catch (e: any) {
      if (e.status === 409) throw e;
      throw new NotFoundException('Contract not found');
    }
  }

  async remove(id: string) {
    try {
      return await this.prisma.contract.delete({ where: { id } });
    } catch {
      throw new NotFoundException('Contract not found');
    }
  }

  // P1-1: Contract selection by period
  async findApplicableContract(employeeId: string, periodStart: Date, periodEnd: Date) {
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

  // P1-2: Contract overlap validation
  async validateContractDates(employeeId: string, startDate: string | Date, endDate?: string | Date | null, excludeContractId?: string) {
    // Normalize to UTC midnight to avoid timezone shifting issues
    const normalizeDate = (d: Date | string | number) => {
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
        throw new ConflictException(`Contract dates overlap with existing contract ${contract.reference || contract.id}`);
      }
    }
  }
}
