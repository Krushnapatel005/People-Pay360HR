import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { WorkingSchedulesController } from './working-schedules.controller';
import { WorkingSchedulesService } from './working-schedules.service';

@Module({
  imports: [PrismaModule],
  controllers: [WorkingSchedulesController],
  providers: [WorkingSchedulesService],
  exports: [WorkingSchedulesService],
})
export class WorkingSchedulesModule {}
