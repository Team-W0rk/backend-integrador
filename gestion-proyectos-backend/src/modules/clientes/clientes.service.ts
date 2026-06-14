import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { EstadoCliente } from '../../common/enums/estado.enum';
import { Cliente } from './entities/clientes.entity';
import { ContactoCliente } from './entities/contacto-cliente.entity';

@Injectable()
export class ClientesService {
  constructor(
    @InjectRepository(Cliente)
    private readonly clientesRepo: Repository<Cliente>,
  ) {}

  async findAll(): Promise<Cliente[]> {
    return this.clientesRepo.find({
      relations: ['proyectos', 'contactos'],
    });
  }

  async findActivos(): Promise<Cliente[]> {
    return this.clientesRepo.find({
      where: { estado: EstadoCliente.ACTIVO },
    });
  }

  async findOne(id: number): Promise<Cliente> {
    const cliente = await this.clientesRepo.findOne({
      where: { id },
      relations: ['proyectos', 'contactos'],
    });
    if (!cliente) {
      throw new NotFoundException(`Cliente ${id} no encontrado`);
    }
    return cliente;
  }

  async create(dto: CreateClienteDto): Promise<Cliente> {
    const { contactos, ...clienteData } = dto;
    const cliente = this.clientesRepo.create(clienteData);
    const savedCliente = await this.clientesRepo.save(cliente);
    if (contactos?.length) {
      const contactosRepo =
        this.clientesRepo.manager.getRepository(ContactoCliente);
      const contactosEntities = contactos.map((c) =>
        contactosRepo.create({
          ...c,
          clienteId: savedCliente.id,
        }),
      );
      await contactosRepo.save(contactosEntities);
    }
    return this.findOne(savedCliente.id);
  }

  async update(id: number, dto: UpdateClienteDto): Promise<Cliente> {
    const { contactos, ...clienteData } = dto;
    const cliente = await this.findOne(id);
    Object.assign(cliente, clienteData);
    await this.clientesRepo.save(cliente);
    if (contactos) {
      const contactosRepo =
        this.clientesRepo.manager.getRepository(ContactoCliente);

      await contactosRepo.delete({ clienteId: id });
      const nuevosContactos = contactos.map((c) =>
        contactosRepo.create({
          ...c,
          clienteId: id,
        }),
      );
      await contactosRepo.save(nuevosContactos);
    }
    return this.findOne(id);
  }

  async darBaja(id: number): Promise<Cliente> {
    const cliente = await this.clientesRepo.findOne({
      where: { id },
      relations: ['proyectos'],
    });
    if (!cliente) throw new NotFoundException(`Cliente ${id} no encontrado`);

    // Verificar que no esté en ningún proyecto
    const tieneProyectos = cliente.proyectos && cliente.proyectos.length > 0;
    if (tieneProyectos) {
      throw new BadRequestException(
        'No se puede dar de baja un cliente que tiene proyectos asociados',
      );
    }

    cliente.estado = EstadoCliente.BAJA;
    return this.clientesRepo.save(cliente);
  }
}
