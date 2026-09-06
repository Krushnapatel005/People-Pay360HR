import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RolesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.role.findMany({ include: { permissions: { include: { permission: true } } } });
  }

  async findById(id: string) {
    const record = await this.prisma.role.findUnique({ where: { id }, include: { permissions: { include: { permission: true } } } });
    if (!record) throw new NotFoundException('Role not found');
    return record;
  }

  async create(createDto: any) {
    return this.prisma.role.create({ data: createDto });
  }

  async update(id: string, updateDto: any) {
    try {
      return await this.prisma.role.update({
        where: { id },
        data: updateDto,
      });
    } catch {
      throw new NotFoundException('Role not found');
    }
  }

  async remove(id: string) {
    try {
      return await this.prisma.role.delete({ where: { id } });
    } catch {
      throw new NotFoundException('Role not found');
    }
  }
}
