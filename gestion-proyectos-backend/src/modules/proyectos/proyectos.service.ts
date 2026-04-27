import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProyectoDto } from './dto/create-proyecto.dto';
import { UpdateProyectoDto } from './dto/update-proyecto.dto';
import { Proyecto } from './entities/proyecto.entity';
import { Cliente } from '../clientes/entities/cliente.entity';
import { EstadoCliente } from '../../common/enums/estado.enum';

@Injectable()
export class ProyectosService {
  constructor(
    @InjectRepository(Proyecto)
    private readonly proyectoRepository: Repository<Proyecto>,
    @InjectRepository(Cliente)
    private readonly clienteRepository: Repository<Cliente>,
  ) {}

  async create(createProyectoDto: CreateProyectoDto): Promise<Proyecto> {
    const proyecto = this.proyectoRepository.create({
      nombre: createProyectoDto.nombre,
      estado: createProyectoDto.estado,
    });

    if (createProyectoDto.id_cliente) {
      const cliente = await this.clienteRepository.findOne({
        where: { id: createProyectoDto.id_cliente, estado: EstadoCliente.ACTIVO },
      });
      if (!cliente) {
        throw new BadRequestException('Cliente activo no encontrado');
      }
      proyecto.cliente = cliente;
    }

    return this.proyectoRepository.save(proyecto);
  }

  async findAll(): Promise<Proyecto[]> {
    return this.proyectoRepository.find({ relations: ['cliente', 'tareas'] });
  }

  async findOne(id: number): Promise<Proyecto> {
    const proyecto = await this.proyectoRepository.findOne({
      where: { id },
      relations: ['cliente', 'tareas'],
    });
    if (!proyecto) {
      throw new NotFoundException('Proyecto no encontrado');
    }
    return proyecto;
  }

  async update(id: number, updateProyectoDto: UpdateProyectoDto): Promise<Proyecto> {
    const proyecto = await this.findOne(id);
    if (updateProyectoDto.id_cliente !== undefined) {
      if (updateProyectoDto.id_cliente === null) {
        proyecto.cliente = null;
      } else {
        const cliente = await this.clienteRepository.findOne({
          where: { id: updateProyectoDto.id_cliente, estado: EstadoCliente.ACTIVO },
        });
        if (!cliente) {
          throw new BadRequestException('Cliente activo no encontrado');
        }
        proyecto.cliente = cliente;
      }
    }
    Object.assign(proyecto, {
      nombre: updateProyectoDto.nombre ?? proyecto.nombre,
      estado: updateProyectoDto.estado ?? proyecto.estado,
    });
    return this.proyectoRepository.save(proyecto);
  }
}
