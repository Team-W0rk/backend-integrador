import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HistorialController } from './historial.controller.js';
import { HistorialService } from './historial.services.js';
import { Historial } from './entities/historial.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([Historial])],
  providers: [HistorialService],
  controllers: [HistorialController],
  exports: [HistorialService],
})
export class HistorialModule {}
