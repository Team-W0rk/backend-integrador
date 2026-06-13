import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProyectosService } from './proyectos.service';
import { ProyectosController } from './proyectos.controller';
import { Proyecto } from './entities/proyectos.entity';
import { Cliente } from '../clientes/entities/clientes.entity';
import { HistorialModule } from '../historial/historial.module';

@Module({
  imports: [TypeOrmModule.forFeature([Proyecto, Cliente]), HistorialModule],
  providers: [ProyectosService],
  controllers: [ProyectosController],
  exports: [ProyectosService],
})
export class ProyectosModule {}
