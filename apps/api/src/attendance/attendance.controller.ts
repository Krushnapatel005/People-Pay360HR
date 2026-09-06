import { Controller, Get, Post, Body, Param, Patch, Delete, UseGuards, Req, ForbiddenException } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { OwnershipGuard } from '../common/guards/ownership.guard';
import { Permissions } from '../common/decorators/permissions.decorator';

@Controller('attendance')
@UseGuards(JwtAuthGuard, PermissionsGuard, OwnershipGuard)
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post()
  @Permissions('attendance.create')
  create(@Body() createDto: any) {
    return this.attendanceService.create(createDto);
  }

  @Get()
  @Permissions('attendance.read')
  findAll(@Req() req: any) {
    const isOnlyEmployee = req.user.roleIds.every((role: any) => role.code === 'EMPLOYEE');
    const filterEmployeeId = isOnlyEmployee ? req.user.employeeId : undefined;
    return this.attendanceService.findAll(filterEmployeeId);
  }

  @Get(':id')
  @Permissions('attendance.read')
  async findById(@Param('id') id: string, @Req() req: any) {
    const record = await this.attendanceService.findById(id);
    
    // Record-level ownership check
    const isOnlyEmployee = req.user.roleIds.every((role: any) => role.code === 'EMPLOYEE');
    if (isOnlyEmployee && record.employeeId.toString() !== req.user.employeeId.toString()) {
      throw new ForbiddenException('Cannot access attendance records for another employee');
    }

    return record;
  }

  @Patch(':id')
  @Permissions('attendance.update')
  update(@Param('id') id: string, @Body() updateDto: any) {
    return this.attendanceService.update(id, updateDto);
  }

  @Delete(':id')
  @Permissions('attendance.approve')
  remove(@Param('id') id: string) {
    return this.attendanceService.remove(id);
  }
}
