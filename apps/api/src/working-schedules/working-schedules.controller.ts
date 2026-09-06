import { Controller, Get, Post, Body, Param, Patch, Delete, UseGuards } from '@nestjs/common';
import { WorkingSchedulesService } from './working-schedules.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { Permissions } from '../common/decorators/permissions.decorator';

@Controller('working-schedules')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class WorkingSchedulesController {
  constructor(private readonly workingSchedulesService: WorkingSchedulesService) {}

  @Post()
  @Permissions('working_schedules.create')
  create(@Body() createDto: any) {
    return this.workingSchedulesService.create(createDto);
  }

  @Get()
  @Permissions('working_schedules.read')
  findAll() {
    return this.workingSchedulesService.findAll();
  }

  @Get(':id')
  @Permissions('working_schedules.read')
  findById(@Param('id') id: string) {
    return this.workingSchedulesService.findById(id);
  }

  @Patch(':id')
  @Permissions('working_schedules.update')
  update(@Param('id') id: string, @Body() updateDto: any) {
    return this.workingSchedulesService.update(id, updateDto);
  }

  @Delete(':id')
  @Permissions('working_schedules.archive')
  remove(@Param('id') id: string) {
    return this.workingSchedulesService.remove(id);
  }
}
