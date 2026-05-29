import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TareasService } from './tareas.service';
import { TareasController } from './tareas.controller';
import { Tarea } from './entities/tareas.entity';
import { Proyecto } from '../proyectos/entities/proyectos.entity';
import { HistorialModule } from '../historial/historial.module';

@Module({
  imports: [TypeOrmModule.forFeature([Tarea, Proyecto]), HistorialModule],
  providers: [TareasService],
  controllers: [TareasController],
  exports: [TareasService],
})
export class TareasModule {}
