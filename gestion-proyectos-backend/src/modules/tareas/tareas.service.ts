import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTareaDto } from './dto/create-tarea.dto';
import { UpdateTareaDto } from './dto/update-tarea.dto';
import { Tarea } from './entities/tarea.entity';
import { Proyecto } from '../proyectos/entities/proyecto.entity';

@Injectable()
export class TareasService {
  constructor(
    @InjectRepository(Tarea)
    private readonly tareaRepository: Repository<Tarea>,
    @InjectRepository(Proyecto)
    private readonly proyectoRepository: Repository<Proyecto>,
  ) {}

  async create(proyectoId: number, createTareaDto: CreateTareaDto): Promise<Tarea> {
    const proyecto = await this.proyectoRepository.findOne({ where: { id: proyectoId } });
    if (!proyecto) {
      throw new NotFoundException('Proyecto no encontrado');
    }
    const tarea = this.tareaRepository.create({
      descripcion: createTareaDto.descripcion,
      estado: createTareaDto.estado,
      proyecto,
    });
    return this.tareaRepository.save(tarea);
  }

  async update(id: number, updateTareaDto: UpdateTareaDto): Promise<Tarea> {
    const tarea = await this.tareaRepository.findOne({ where: { id } });
    if (!tarea) {
      throw new NotFoundException('Tarea no encontrada');
    }
    Object.assign(tarea, updateTareaDto);
    return this.tareaRepository.save(tarea);
  }

  async remove(id: number): Promise<void> {
    const tarea = await this.tareaRepository.findOne({ where: { id } });
    if (!tarea) {
      throw new NotFoundException('Tarea no encontrada');
    }
    await this.tareaRepository.remove(tarea);
  }
}
