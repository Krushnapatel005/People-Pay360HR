import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as argon2 from 'argon2';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.user.findMany({ include: { employee: true, roles: { include: { role: true } } } });
  }

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        employee: true,
        roles: { include: { role: { include: { permissions: { include: { permission: true } } } } } },
      },
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email }, include: { employee: true, roles: { include: { role: { include: { permissions: { include: { permission: true } } } } } } } });
  }

  async create(createUserDto: any) {
    const existingUser = await this.findByEmail(createUserDto.email);
    if (existingUser) throw new ConflictException('Email already in use');

    let passwordHash = undefined;
    if (createUserDto.password) {
      passwordHash = await argon2.hash(createUserDto.password);
    }

    return this.prisma.user.create({
      data: {
        email: createUserDto.email,
        passwordHash,
        status: createUserDto.status,
        employeeId: createUserDto.employeeId,
      },
    });
  }

  async update(id: string, updateUserDto: any) {
    try {
      if (updateUserDto.password) {
        updateUserDto.passwordHash = await argon2.hash(updateUserDto.password);
        delete updateUserDto.password;
      }
      return await this.prisma.user.update({
        where: { id },
        data: updateUserDto,
      });
    } catch {
      throw new NotFoundException('User not found');
    }
  }

  async remove(id: string) {
    try {
      return await this.prisma.user.delete({ where: { id } });
    } catch {
      throw new NotFoundException('User not found');
    }
  }

  async setLastLogin(id: string) {
    try {
      return await this.prisma.user.update({
        where: { id },
        data: { lastLogin: new Date() },
      });
    } catch {
      // Ignore if user not found
    }
  }

  async updateRefreshToken(id: string, refreshToken: string | null) {
    try {
      return await this.prisma.user.update({
        where: { id },
        data: { refreshTokenHash: refreshToken },
      });
    } catch {
      // Ignore if user not found
    }
  }
}
