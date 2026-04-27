import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { Cliente } from './entities/cliente.entity';
import { Proyecto } from '../proyectos/entities/proyecto.entity';
import { EstadoCliente, EstadoProyecto } from '../../common/enums/estado.enum';

@Injectable()
export class ClientesService {
  constructor(
    @InjectRepository(Cliente)
    private readonly clienteRepository: Repository<Cliente>,
    @InjectRepository(Proyecto)
    private readonly proyectoRepository: Repository<Proyecto>,
  ) {}

  async create(createClienteDto: CreateClienteDto): Promise<Cliente> {
    const cliente = this.clienteRepository.create(createClienteDto);
    return this.clienteRepository.save(cliente);
  }

  async findAll(): Promise<Cliente[]> {
    return this.clienteRepository.find();
  }

  async findOne(id: number): Promise<Cliente> {
    const cliente = await this.clienteRepository.findOne({ where: { id } });
    if (!cliente) {
      throw new NotFoundException('Cliente no encontrado');
    }
    return cliente;
  }

  async update(id: number, updateClienteDto: UpdateClienteDto): Promise<Cliente> {
    const cliente = await this.findOne(id);
    if (updateClienteDto.estado === EstadoCliente.BAJA) {
      const proyectosActivos = await this.proyectoRepository.count({
        where: { cliente: { id }, estado: EstadoProyecto.ACTIVO },
      });
      if (proyectosActivos > 0) {
        throw new BadRequestException(
          'No se puede dar de baja a un cliente con proyectos activos',
        );
      }
    }
    Object.assign(cliente, updateClienteDto);
    return this.clienteRepository.save(cliente);
  }
}
