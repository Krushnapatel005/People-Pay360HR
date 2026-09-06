import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WorkingSchedulesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.workingSchedule.findMany({ include: { days: true } });
  }

  async findById(id: string) {
    const schedule = await this.prisma.workingSchedule.findUnique({ where: { id }, include: { days: true } });
    if (!schedule) throw new NotFoundException('Working Schedule not found');
    return schedule;
  }

  private calculateWeeklyHours(days: any[] = []): number {
    let totalMinutes = 0;
    for (const day of days) {
      if (!day.startTime || !day.endTime) continue;
      const [startH, startM] = day.startTime.split(':').map(Number);
      const [endH, endM] = day.endTime.split(':').map(Number);
      const startTotal = startH * 60 + startM;
      let endTotal = endH * 60 + endM;
      if (endTotal < startTotal) {
        endTotal += 24 * 60; // Handle overnight shift
      }
      const worked = endTotal - startTotal - (day.breakMinutes || 0);
      if (worked > 0) totalMinutes += worked;
    }
    return totalMinutes / 60;
  }

  async create(createDto: any) {
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

  async update(id: string, updateDto: any) {
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
    } catch {
      throw new NotFoundException('Working Schedule not found');
    }
  }

  async remove(id: string) {
    try {
      return await this.prisma.workingSchedule.delete({ where: { id } });
    } catch {
      throw new NotFoundException('Working Schedule not found');
    }
  }
}
