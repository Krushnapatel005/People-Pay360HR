import { Controller, Get, Post, Body, Param, Patch, Delete, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { Permissions } from '../common/decorators/permissions.decorator';

@Controller('users')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Permissions('users.read')
  findAll() {
    return this.usersService.findAll(); // Requires implementing findAll in UsersService
  }

  @Get(':id')
  @Permissions('users.read')
  findById(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @Post()
  @Permissions('users.create')
  create(@Body() createDto: any) {
    return this.usersService.create(createDto); // Requires implementing create in UsersService
  }

  @Patch(':id')
  @Permissions('users.update')
  update(@Param('id') id: string, @Body() updateDto: any) {
    return this.usersService.update(id, updateDto); // Requires implementing update in UsersService
  }

  @Delete(':id')
  @Permissions('users.deactivate')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id); // Requires implementing remove in UsersService
  }
}
