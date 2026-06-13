import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EstadisticasService } from './estadisticas.service.js';
import { EstadisticasController } from './estadisticas.controller.js';
import { Proyecto } from '../proyectos/entities/proyectos.entity.js';
import { Tarea } from '../tareas/entities/tareas.entity.js';
import { Cliente } from '../clientes/entities/clientes.entity.js';
import { Usuario } from '../usuarios/entities/usuarios.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([Proyecto, Tarea, Cliente, Usuario])],
  providers: [EstadisticasService],
  controllers: [EstadisticasController],
})
export class EstadisticasModule {}
