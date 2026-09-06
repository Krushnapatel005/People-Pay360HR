import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EmployeesService {
  constructor(private prisma: PrismaService) {}

  async findAll(skip: number = 0, take: number = 50, search?: string, employeeId?: string) {
    const where: any = {};
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

  async findById(id: string) {
    const employee = await this.prisma.employee.findUnique({ where: { id } });
    if (!employee) throw new NotFoundException('Employee not found');
    return employee;
  }

  async create(createEmployeeDto: any) {
    try {
      if (!createEmployeeDto.employeeId) {
        // Generate a simple ID if not provided
        createEmployeeDto.employeeId = `EMP-${Date.now().toString().slice(-6)}`;
      }
      return await this.prisma.employee.create({ data: createEmployeeDto });
    } catch (error: any) {
      if (error.code === 'P2002') {
        throw new ConflictException('An employee with this email or ID already exists');
      }
      throw error;
    }
  }

  async update(id: string, updateEmployeeDto: any) {
    try {
      return await this.prisma.employee.update({
        where: { id },
        data: updateEmployeeDto,
      });
    } catch {
      throw new NotFoundException('Employee not found');
    }
  }

  async remove(id: string) {
    const payslipCount = await this.prisma.payslip.count({
      where: { employeeId: id }
    });

    if (payslipCount > 0) {
      throw new ConflictException('Cannot delete employee because they have existing payslips/payroll history. Please archive instead.');
    }

    try {
      return await this.prisma.employee.delete({ where: { id } });
    } catch {
      throw new NotFoundException('Employee not found');
    }
  }
}
