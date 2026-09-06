import { Controller, Get, Post, Body, Param, Patch, Delete, UseGuards } from '@nestjs/common';
import { ContractsService } from './contracts.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { Permissions } from '../common/decorators/permissions.decorator';

@Controller('contracts')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class ContractsController {
  constructor(private readonly contractsService: ContractsService) {}

  @Post()
  @Permissions('contracts.create')
  create(@Body() createDto: any) {
    return this.contractsService.create(createDto);
  }

  @Get()
  @Permissions('contracts.read')
  findAll() {
    return this.contractsService.findAll();
  }

  @Get(':id')
  @Permissions('contracts.read')
  findById(@Param('id') id: string) {
    return this.contractsService.findById(id);
  }

  @Patch(':id')
  @Permissions('contracts.update')
  update(@Param('id') id: string, @Body() updateDto: any) {
    return this.contractsService.update(id, updateDto);
  }

  @Delete(':id')
  @Permissions('contracts.archive')
  remove(@Param('id') id: string) {
    return this.contractsService.remove(id);
  }
}
