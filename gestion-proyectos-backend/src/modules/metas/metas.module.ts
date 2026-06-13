import { Module } from '@nestjs/common';
import { MetasService } from './metas.service.js';
import { MetasController } from './metas.controller.js';
import { HistorialModule } from '../historial/historial.module.js';
import { Meta } from './entities/metas.entity.js';
import { Proyecto } from '../proyectos/entities/proyectos.entity.js';
import { Tarea } from '../tareas/entities/tareas.entity.js';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Meta, Proyecto, Tarea]), HistorialModule],
  providers: [MetasService],
  controllers: [MetasController],
  exports: [MetasService],
})
export class MetasModule {}
