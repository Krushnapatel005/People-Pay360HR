import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TimeOffService {
  constructor(private prisma: PrismaService) {}

  async findAll(employeeId?: string) {
    const where = employeeId ? { employeeId } : {};
    return this.prisma.timeOffRequest.findMany({ where, include: { employee: true, timeOffType: true } });
  }

  async findById(id: string) {
    const record = await this.prisma.timeOffRequest.findUnique({ where: { id }, include: { employee: true, timeOffType: true } });
    if (!record) throw new NotFoundException('Time off request not found');
    return record;
  }

  async create(createDto: any) {
    if (createDto.startDate && createDto.endDate) {
      const start = new Date(createDto.startDate).getTime();
      const end = new Date(createDto.endDate).getTime();
      if (end < start) {
        throw new BadRequestException('End date must be after start date');
      }
      // Simple duration calculation for MVP (1 day = 24 hours). 
      // In a full implementation, we'd iterate over WorkingSchedule days.
      const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
      createDto.duration = days;
    }
    return this.prisma.timeOffRequest.create({ data: createDto });
  }

  async update(id: string, updateDto: any) {
    try {
      return await this.prisma.timeOffRequest.update({
        where: { id },
        data: updateDto,
      });
    } catch {
      throw new NotFoundException('Time off request not found');
    }
  }

  async approve(id: string) {
    return this.prisma.$transaction(async (tx) => {
      const request = await tx.timeOffRequest.findUnique({ where: { id } });
      if (!request) throw new NotFoundException('Request not found');
      if (request.status === 'APPROVED') {
        throw new ConflictException('Request is already approved');
      }

      if (request.leaveAllocationId) {
        const allocation = await tx.leaveAllocation.findUnique({ where: { id: request.leaveAllocationId } });
        if (allocation) {
          const reqDuration = Number(request.duration);
          const remaining = Number(allocation.remainingAmount);
          if (remaining < reqDuration) {
            throw new BadRequestException('Insufficient leave balance');
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
        throw new ConflictException('Request is already approved or no longer available');
      }

      return tx.timeOffRequest.findUnique({ where: { id } });
    });
  }

  async refuse(id: string) {
    const request = await this.prisma.timeOffRequest.findUnique({ where: { id } });
    if (!request) throw new NotFoundException('Request not found');
    
    // If we're refusing an already approved request, we'd need to refund balance.
    // For now, assume we only refuse pending requests (or if approved, we refund).
    if (request.status === 'APPROVED' && request.leaveAllocationId) {
      await this.prisma.$transaction(async (tx) => {
        const allocation = await tx.leaveAllocation.findUnique({ where: { id: request.leaveAllocationId! } });
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

  async remove(id: string) {
    try {
      return await this.prisma.timeOffRequest.delete({ where: { id } });
    } catch {
      throw new NotFoundException('Time off request not found');
    }
  }

  // Types
  async findTypes() { return this.prisma.timeOffType.findMany(); }
  async createType(data: any) { return this.prisma.timeOffType.create({ data }); }
  async updateType(id: string, data: any) { return this.prisma.timeOffType.update({ where: { id }, data }); }
  async removeType(id: string) { return this.prisma.timeOffType.delete({ where: { id } }); }

  // Allocations
  async findAllocations(employeeId?: string) {
    const where = employeeId ? { employeeId } : {};
    return this.prisma.leaveAllocation.findMany({ where, include: { timeOffType: true, employee: true } });
  }
  async createAllocation(data: any) { return this.prisma.leaveAllocation.create({ data }); }
  async updateAllocation(id: string, data: any) { return this.prisma.leaveAllocation.update({ where: { id }, data }); }
  async removeAllocation(id: string) { return this.prisma.leaveAllocation.delete({ where: { id } }); }
}
