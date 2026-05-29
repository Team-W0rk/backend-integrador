import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMetaDto } from './dto/create-meta.dto.js';
import { UpdateMetaDto } from './dto/update-meta.dto.js';
import { Meta } from './entities/metas.entity.js';
import { Proyecto } from '../proyectos/entities/proyectos.entity.js';
import { Tarea } from '../tareas/entities/tareas.entity.js';
import { HistorialService } from '../historial/historial.services.js';
import {
  AccionHistorial,
  EntidadHistorial,
} from '../historial/entities/historial.entity.js';

@Injectable()
export class MetasService {
  constructor(
    @InjectRepository(Meta)
    private readonly metasRepo: Repository<Meta>,
    @InjectRepository(Proyecto)
    private readonly proyectosRepo: Repository<Proyecto>,
    @InjectRepository(Tarea)
    private readonly tareasRepo: Repository<Tarea>,
    private readonly historialService: HistorialService,
  ) {}

  async findByProyecto(proyectoId: number): Promise<Meta[]> {
    const proyecto = await this.proyectosRepo.findOne({
      where: { id: proyectoId },
    });
    if (!proyecto)
      throw new NotFoundException(`Proyecto ${proyectoId} no encontrado`);

    return this.metasRepo.find({
      where: { proyectoId },
      relations: ['tareas'],
      order: { creadoEn: 'ASC' },
    });
  }

  async findOne(proyectoId: number, id: number): Promise<Meta> {
    const meta = await this.metasRepo.findOne({
      where: { id, proyectoId },
      relations: ['tareas'],
    });
    if (!meta)
      throw new NotFoundException(
        `Meta ${id} no encontrada en el proyecto ${proyectoId}`,
      );
    return meta;
  }

  async create(
    proyectoId: number,
    dto: CreateMetaDto,
    usuarioId?: number,
  ): Promise<Meta> {
    const proyecto = await this.proyectosRepo.findOne({
      where: { id: proyectoId },
    });
    if (!proyecto)
      throw new NotFoundException(`Proyecto ${proyectoId} no encontrado`);

    const meta = this.metasRepo.create({
      nombre: dto.nombre,
      descripcion: dto.descripcion,
      fechaLimite: dto.fechaLimite ? new Date(dto.fechaLimite) : null,
      proyectoId,
    });

    const saved = await this.metasRepo.save(meta);

    await this.historialService.registrar({
      entidad: EntidadHistorial.META,
      entidadId: saved.id,
      accion: AccionHistorial.CREAR,
      usuarioId,
      datosNuevos: { nombre: saved.nombre, proyectoId },
    });

    return saved;
  }

  async update(
    proyectoId: number,
    id: number,
    dto: UpdateMetaDto,
    usuarioId?: number,
  ): Promise<Meta> {
    const meta = await this.findOne(proyectoId, id);
    const anterior = {
      nombre: meta.nombre,
      estado: meta.estado,
      fechaLimite: meta.fechaLimite,
    };

    if (dto.nombre !== undefined) meta.nombre = dto.nombre;
    if (dto.descripcion !== undefined) meta.descripcion = dto.descripcion;
    if (dto.estado !== undefined) meta.estado = dto.estado;
    if (dto.fechaLimite !== undefined)
      meta.fechaLimite = dto.fechaLimite ? new Date(dto.fechaLimite) : null;

    const saved = await this.metasRepo.save(meta);

    await this.historialService.registrar({
      entidad: EntidadHistorial.META,
      entidadId: id,
      accion: AccionHistorial.MODIFICAR,
      usuarioId,
      datosAnteriores: anterior,
      datosNuevos: {
        nombre: saved.nombre,
        estado: saved.estado,
        fechaLimite: saved.fechaLimite,
      },
    });

    return saved;
  }

  async remove(
    proyectoId: number,
    id: number,
    usuarioId?: number,
  ): Promise<void> {
    const meta = await this.findOne(proyectoId, id);
    await this.metasRepo.remove(meta);

    await this.historialService.registrar({
      entidad: EntidadHistorial.META,
      entidadId: id,
      accion: AccionHistorial.ELIMINAR,
      usuarioId,
      datosAnteriores: { nombre: meta.nombre, proyectoId },
    });
  }

  async asignarTarea(
    proyectoId: number,
    metaId: number,
    tareaId: number,
  ): Promise<Tarea> {
    await this.findOne(proyectoId, metaId);
    const tarea = await this.tareasRepo.findOne({
      where: { id: tareaId, proyectoId },
    });
    if (!tarea)
      throw new NotFoundException(
        `Tarea ${tareaId} no encontrada en el proyecto`,
      );

    tarea.metaId = metaId;
    return this.tareasRepo.save(tarea);
  }

  async desasignarTarea(
    proyectoId: number,
    metaId: number,
    tareaId: number,
  ): Promise<Tarea> {
    await this.findOne(proyectoId, metaId);
    const tarea = await this.tareasRepo.findOne({
      where: { id: tareaId, proyectoId, metaId },
    });
    if (!tarea)
      throw new NotFoundException(
        `Tarea ${tareaId} no pertenece a la meta ${metaId}`,
      );

    tarea.metaId = null;
    return this.tareasRepo.save(tarea);
  }
}
