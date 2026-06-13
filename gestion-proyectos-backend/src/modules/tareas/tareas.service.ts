import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTareaDto } from './dto/create-tarea.dto';
import { UpdateTareaDto } from './dto/update-tarea.dto';
import { Tarea } from './entities/tareas.entity';
import { Proyecto } from '../proyectos/entities/proyectos.entity';

@Injectable()
export class TareasService {
  constructor(
    @InjectRepository(Tarea)
    private readonly tareasRepo: Repository<Tarea>,
    @InjectRepository(Proyecto)
    private readonly proyectosRepo: Repository<Proyecto>,
  ) {}

  async findByProyecto(proyectoId: number): Promise<Tarea[]> {
    const proyecto = await this.proyectosRepo.findOne({
      where: { id: proyectoId },
    });
    if (!proyecto)
      throw new NotFoundException(`Proyecto ${proyectoId} no encontrado`);

    return this.tareasRepo.find({ where: { proyectoId } });
  }

  async findOne(proyectoId: number, id: number): Promise<Tarea> {
    const tarea = await this.tareasRepo.findOne({
      where: { id, proyectoId },
    });
    if (!tarea)
      throw new NotFoundException(
        `Tarea ${id} no encontrada en el proyecto ${proyectoId}`,
      );
    return tarea;
  }

  async create(proyectoId: number, dto: CreateTareaDto): Promise<Tarea> {
    const proyecto = await this.proyectosRepo.findOne({
      where: { id: proyectoId },
    });
    if (!proyecto)
      throw new NotFoundException(`Proyecto ${proyectoId} no encontrado`);

    const tarea = this.tareasRepo.create({ ...dto, proyectoId });
    return this.tareasRepo.save(tarea);
  }

  async update(
    proyectoId: number,
    id: number,
    dto: UpdateTareaDto,
  ): Promise<Tarea> {
    const tarea = await this.findOne(proyectoId, id);
    Object.assign(tarea, dto);
    return this.tareasRepo.save(tarea);
  }

  async remove(proyectoId: number, id: number): Promise<void> {
    const tarea = await this.findOne(proyectoId, id);
    await this.tareasRepo.remove(tarea);
  }
}
