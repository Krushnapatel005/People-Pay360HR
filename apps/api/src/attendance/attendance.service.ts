import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AttendanceService {
  constructor(private prisma: PrismaService) {}

  async findAll(employeeId?: string) {
    const where = employeeId ? { employeeId } : {};
    return this.prisma.attendance.findMany({ where, include: { employee: true } });
  }

  async findById(id: string) {
    const record = await this.prisma.attendance.findUnique({ where: { id }, include: { employee: true } });
    if (!record) throw new NotFoundException('Attendance record not found');
    return record;
  }

  async create(createDto: any) {
    this.validateAttendance(createDto);
    this.calculateWorkedHours(createDto);
    return this.prisma.attendance.create({ data: createDto });
  }

  async update(id: string, updateDto: any) {
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
    } catch (e: any) {
      if (e.status === 400) throw e;
      throw new NotFoundException('Attendance record not found');
    }
  }

  async remove(id: string) {
    try {
      return await this.prisma.attendance.delete({ where: { id } });
    } catch {
      throw new NotFoundException('Attendance record not found');
    }
  }

  private validateAttendance(data: any) {
    if (data.checkIn && data.checkOut) {
      const start = new Date(data.checkIn).getTime();
      const end = new Date(data.checkOut).getTime();
      if (end <= start) {
        throw new BadRequestException('Check-out time must be after check-in time');
      }
    }
  }

  private calculateWorkedHours(data: any) {
    if (data.checkIn && data.checkOut) {
      const start = new Date(data.checkIn).getTime();
      const end = new Date(data.checkOut).getTime();
      const ms = end - start;
      const hours = ms / (1000 * 60 * 60);
      data.workedHours = hours;
    } else {
      data.workedHours = null;
    }
  }
}
