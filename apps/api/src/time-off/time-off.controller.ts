import { Controller, Get, Post, Body, Param, Patch, Delete, UseGuards, Req, ForbiddenException } from '@nestjs/common';
import { TimeOffService } from './time-off.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { OwnershipGuard } from '../common/guards/ownership.guard';
import { Permissions } from '../common/decorators/permissions.decorator';

@Controller('time-off')
@UseGuards(JwtAuthGuard, PermissionsGuard, OwnershipGuard)
export class TimeOffController {
  constructor(private readonly timeOffService: TimeOffService) {}

  @Post()
  @Permissions('time_off.request')
  create(@Body() createDto: any) {
    return this.timeOffService.create(createDto);
  }

  @Get()
  @Permissions('time_off.read')
  findAll(@Req() req: any) {
    const isOnlyEmployee = req.user.roleIds.every((role: any) => role.code === 'EMPLOYEE');
    const filterEmployeeId = isOnlyEmployee ? req.user.employeeId : undefined;
    return this.timeOffService.findAll(filterEmployeeId);
  }

  @Get(':id')
  @Permissions('time_off.read')
  async findById(@Param('id') id: string, @Req() req: any) {
    const record = await this.timeOffService.findById(id);
    
    // Record-level ownership check
    const isOnlyEmployee = req.user.roleIds.every((role: any) => role.code === 'EMPLOYEE');
    if (isOnlyEmployee && record.employeeId.toString() !== req.user.employeeId.toString()) {
      throw new ForbiddenException('Cannot access time-off records for another employee');
    }

    return record;
  }

  @Patch(':id')
  @Permissions('time_off.request')
  update(@Param('id') id: string, @Body() updateDto: any) {
    return this.timeOffService.update(id, updateDto);
  }

  @Delete(':id')
  @Permissions('time_off.request')
  remove(@Param('id') id: string) {
    return this.timeOffService.remove(id);
  }

  @Patch(':id/approve')
  @Permissions('time_off.approve')
  approve(@Param('id') id: string) {
    return this.timeOffService.approve(id);
  }

  @Patch(':id/refuse')
  @Permissions('time_off.approve')
  refuse(@Param('id') id: string) {
    return this.timeOffService.refuse(id);
  }

  // TimeOffTypes
  @Get('types')
  @Permissions('time_off.read_settings')
  findTypes() { return this.timeOffService.findTypes(); }

  @Post('types')
  @Permissions('time_off.manage_settings')
  createType(@Body() data: any) { return this.timeOffService.createType(data); }

  @Patch('types/:id')
  @Permissions('time_off.manage_settings')
  updateType(@Param('id') id: string, @Body() data: any) { return this.timeOffService.updateType(id, data); }

  @Delete('types/:id')
  @Permissions('time_off.manage_settings')
  removeType(@Param('id') id: string) { return this.timeOffService.removeType(id); }

  // Allocations
  @Get('allocations')
  @Permissions('time_off.read')
  findAllocations(@Req() req: any) {
    const isOnlyEmployee = req.user.roleIds.every((role: any) => role.code === 'EMPLOYEE');
    const filterEmployeeId = isOnlyEmployee ? req.user.employeeId : undefined;
    return this.timeOffService.findAllocations(filterEmployeeId);
  }

  @Post('allocations')
  @Permissions('time_off.manage_allocations')
  createAllocation(@Body() data: any) { return this.timeOffService.createAllocation(data); }

  @Patch('allocations/:id')
  @Permissions('time_off.manage_allocations')
  updateAllocation(@Param('id') id: string, @Body() data: any) { return this.timeOffService.updateAllocation(id, data); }

  @Delete('allocations/:id')
  @Permissions('time_off.manage_allocations')
  removeAllocation(@Param('id') id: string) { return this.timeOffService.removeAllocation(id); }
}
