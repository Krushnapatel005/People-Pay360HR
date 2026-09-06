import { Controller, Get, Post, Body, Param, Patch, Delete, UseGuards, Query, Req } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { OwnershipGuard } from '../common/guards/ownership.guard';
import { Permissions } from '../common/decorators/permissions.decorator';

@Controller('employees')
@UseGuards(JwtAuthGuard, PermissionsGuard, OwnershipGuard)
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Post()
  @Permissions('employees.create')
  create(@Body() createEmployeeDto: any) {
    return this.employeesService.create(createEmployeeDto);
  }

  @Get()
  @Permissions('employees.read')
  findAll(
    @Req() req: any,
    @Query('skip') skip?: string,
    @Query('take') take?: string,
    @Query('search') search?: string
  ) {
    const isOnlyEmployee = req.user.roleIds.every((role: any) => role.code === 'EMPLOYEE');
    const filterEmployeeId = isOnlyEmployee ? req.user.employeeId : undefined;
    
    return this.employeesService.findAll(
      skip ? parseInt(skip) : 0,
      take ? parseInt(take) : 50,
      search,
      filterEmployeeId
    );
  }

  @Get(':id')
  @Permissions('employees.read')
  findById(@Param('id') id: string) {
    return this.employeesService.findById(id);
  }

  @Patch(':id')
  @Permissions('employees.update')
  update(@Param('id') id: string, @Body() updateEmployeeDto: any) {
    return this.employeesService.update(id, updateEmployeeDto);
  }

  @Delete(':id')
  @Permissions('employees.archive')
  remove(@Param('id') id: string) {
    return this.employeesService.remove(id);
  }
}
