import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProyectosController } from './proyectos.controller';
import { ProyectosService } from './proyectos.service';
import { Proyecto } from './entities/proyecto.entity';
import { Cliente } from '../clientes/entities/cliente.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Proyecto, Cliente])],
  controllers: [ProyectosController],
  providers: [ProyectosService],
  exports: [ProyectosService],
})
export class ProyectosModule {}
