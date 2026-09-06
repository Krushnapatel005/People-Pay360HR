import { Controller, Get, Post, Body, Param, Patch, Delete, UseGuards } from '@nestjs/common';
import { RolesService } from './roles.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { Permissions } from '../common/decorators/permissions.decorator';

@Controller('roles')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  @Permissions('roles.manage')
  create(@Body() createDto: any) {
    return this.rolesService.create(createDto);
  }

  @Get()
  @Permissions('roles.read')
  findAll() {
    return this.rolesService.findAll();
  }

  @Get(':id')
  @Permissions('roles.read')
  findById(@Param('id') id: string) {
    return this.rolesService.findById(id);
  }

  @Patch(':id')
  @Permissions('roles.manage')
  update(@Param('id') id: string, @Body() updateDto: any) {
    return this.rolesService.update(id, updateDto);
  }

  @Delete(':id')
  @Permissions('roles.manage')
  remove(@Param('id') id: string) {
    return this.rolesService.remove(id);
  }
}
