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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const argon2 = require("argon2");
let UsersService = class UsersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll() {
        return this.prisma.user.findMany({ include: { employee: true, roles: { include: { role: true } } } });
    }
    async findById(id) {
        const user = await this.prisma.user.findUnique({
            where: { id },
            include: {
                employee: true,
                roles: { include: { role: { include: { permissions: { include: { permission: true } } } } } },
            },
        });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        return user;
    }
    async findByEmail(email) {
        return this.prisma.user.findUnique({ where: { email }, include: { employee: true, roles: { include: { role: { include: { permissions: { include: { permission: true } } } } } } } });
    }
    async create(createUserDto) {
        const existingUser = await this.findByEmail(createUserDto.email);
        if (existingUser)
            throw new common_1.ConflictException('Email already in use');
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
    async update(id, updateUserDto) {
        try {
            if (updateUserDto.password) {
                updateUserDto.passwordHash = await argon2.hash(updateUserDto.password);
                delete updateUserDto.password;
            }
            return await this.prisma.user.update({
                where: { id },
                data: updateUserDto,
            });
        }
        catch {
            throw new common_1.NotFoundException('User not found');
        }
    }
    async remove(id) {
        try {
            return await this.prisma.user.delete({ where: { id } });
        }
        catch {
            throw new common_1.NotFoundException('User not found');
        }
    }
    async setLastLogin(id) {
        try {
            return await this.prisma.user.update({
                where: { id },
                data: { lastLogin: new Date() },
            });
        }
        catch {
        }
    }
    async updateRefreshToken(id, refreshToken) {
        try {
            return await this.prisma.user.update({
                where: { id },
                data: { refreshTokenHash: refreshToken },
            });
        }
        catch {
        }
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UsersService);
//# sourceMappingURL=users.service.js.map