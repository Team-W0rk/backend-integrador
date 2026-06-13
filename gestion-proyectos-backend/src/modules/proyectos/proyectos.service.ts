import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere, ILike, FindOptionsOrder } from 'typeorm';
import { CreateProyectoDto } from './dto/create-proyecto.dto.js';
import { UpdateProyectoDto } from './dto/update-proyecto.dto.js';
import {
  EstadoCliente,
  EstadoProyecto,
} from '../../common/enums/estado.enum.js';
import { Proyecto } from './entities/proyectos.entity.js';
import { Cliente } from '../clientes/entities/clientes.entity.js';
import { HistorialService } from '../historial/historial.services.js';
import {
  AccionHistorial,
  EntidadHistorial,
} from '../historial/entities/historial.entity.js';

export interface FiltroProyecto {
  nombre?: string;
  estado?: EstadoProyecto;
  clienteId?: number;
  retrasados?: boolean;
  pagina?: number;
  limite?: number;
  orden?: 'nombre' | 'estado' | 'creadoEn' | 'fechaFin';
  direccion?: 'ASC' | 'DESC';
}

@Injectable()
export class ProyectosService {
  constructor(
    @InjectRepository(Proyecto)
    private readonly proyectosRepo: Repository<Proyecto>,
    @InjectRepository(Cliente)
    private readonly clientesRepo: Repository<Cliente>,
    private readonly historialService: HistorialService,
  ) {}

  async findAll(filtros: FiltroProyecto = {}): Promise<{
    datos: Proyecto[];
    total: number;
    pagina: number;
    totalPaginas: number;
  }> {
    const {
      nombre,
      estado,
      clienteId,
      pagina = 1,
      limite = 10,
      orden = 'creadoEn',
      direccion = 'DESC',
    } = filtros;

    const where: FindOptionsWhere<Proyecto> = {};
    if (nombre) where.nombre = ILike(`%${nombre}%`);
    if (estado) where.estado = estado;
    if (clienteId) where.clienteId = clienteId;

    const orderBy: FindOptionsOrder<Proyecto> = { [orden]: direccion };

    const [datos, total] = await this.proyectosRepo.findAndCount({
      where,
      relations: ['cliente', 'tareas', 'metas'],
      order: orderBy,
      skip: (pagina - 1) * limite,
      take: limite,
    });

    return { datos, total, pagina, totalPaginas: Math.ceil(total / limite) };
  }

  async findOne(
    id: number,
  ): Promise<Proyecto & { retrasado: boolean; diasRestantes: number | null }> {
    const proyecto = await this.proyectosRepo.findOne({
      where: { id },
      relations: ['cliente', 'tareas', 'metas'],
    });
    if (!proyecto) throw new NotFoundException(`Proyecto ${id} no encontrado`);

    const hoy = new Date();
    const retrasado =
      proyecto.fechaFin !== null &&
      new Date(proyecto.fechaFin) < hoy &&
      proyecto.estado === EstadoProyecto.ACTIVO;

    const diasRestantes = proyecto.fechaFin
      ? Math.ceil(
          (new Date(proyecto.fechaFin).getTime() - hoy.getTime()) /
            (1000 * 60 * 60 * 24),
        )
      : null;

    return { ...proyecto, retrasado, diasRestantes };
  }

  async create(dto: CreateProyectoDto, usuarioId?: number): Promise<Proyecto> {
    if (dto.clienteId) await this.validarCliente(dto.clienteId);

    const proyecto = this.proyectosRepo.create({
      nombre: dto.nombre,
      clienteId: dto.clienteId ?? null,
      fechaFin: dto.fechaFin ? new Date(dto.fechaFin) : null,
    });

    const saved = await this.proyectosRepo.save(proyecto);

    await this.historialService.registrar({
      entidad: EntidadHistorial.PROYECTO,
      entidadId: saved.id,
      accion: AccionHistorial.CREAR,
      usuarioId,
      datosNuevos: {
        nombre: saved.nombre,
        clienteId: saved.clienteId,
        fechaFin: saved.fechaFin,
      },
    });

    return saved;
  }

  async update(
    id: number,
    dto: UpdateProyectoDto,
    usuarioId?: number,
  ): Promise<Proyecto> {
    const proyecto = await this.proyectosRepo.findOne({ where: { id } });
    if (!proyecto) throw new NotFoundException(`Proyecto ${id} no encontrado`);

    const anterior = {
      nombre: proyecto.nombre,
      estado: proyecto.estado,
      clienteId: proyecto.clienteId,
      fechaFin: proyecto.fechaFin,
    };

    if (dto.clienteId !== undefined) {
      if (dto.clienteId !== null) await this.validarCliente(dto.clienteId);
      proyecto.clienteId = dto.clienteId;
    }
    if (dto.nombre !== undefined) proyecto.nombre = dto.nombre;
    if (dto.estado !== undefined) proyecto.estado = dto.estado;
    if (dto.fechaFin !== undefined)
      proyecto.fechaFin = dto.fechaFin ? new Date(dto.fechaFin) : null;

    const saved = await this.proyectosRepo.save(proyecto);

    await this.historialService.registrar({
      entidad: EntidadHistorial.PROYECTO,
      entidadId: id,
      accion:
        dto.estado === EstadoProyecto.BAJA
          ? AccionHistorial.BAJA
          : AccionHistorial.MODIFICAR,
      usuarioId,
      datosAnteriores: anterior,
      datosNuevos: {
        nombre: saved.nombre,
        estado: saved.estado,
        clienteId: saved.clienteId,
        fechaFin: saved.fechaFin,
      },
    });
    return saved;
  }

  async exportarCsv(): Promise<string> {
    const proyectos = await this.proyectosRepo.find({
      relations: ['cliente', 'tareas'],
    });
    const hoy = new Date();
    const cabecera =
      'ID,Nombre,Estado,Cliente,Tareas Totales,Tareas Pendientes,Fecha Fin,Retrasado\n';
    const filas = proyectos.map((p) => {
      const retrasado =
        p.fechaFin &&
        new Date(p.fechaFin) < hoy &&
        p.estado === EstadoProyecto.ACTIVO
          ? 'Sí'
          : 'No';
      const tareasPendientes =
        // eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
        p.tareas?.filter((t) => t.estado === 'pendiente').length ?? 0;
      return [
        p.id,
        `"${p.nombre}"`,
        p.estado,
        p.cliente ? `"${p.cliente.nombre}"` : 'Interno',
        p.tareas?.length ?? 0,
        tareasPendientes,
        p.fechaFin ? new Date(p.fechaFin).toLocaleDateString('es-AR') : '',
        retrasado,
      ].join(',');
    });
    return cabecera + filas.join('\n');
  }

  private async validarCliente(clienteId: number): Promise<void> {
    const cliente = await this.clientesRepo.findOne({
      where: { id: clienteId },
    });
    if (!cliente)
      throw new NotFoundException(`Cliente ${clienteId} no encontrado`);
    if (cliente.estado !== EstadoCliente.ACTIVO)
      throw new BadRequestException(
        'Solo se puede asignar un cliente en estado Activo',
      );
  }

  async remove(id: number, usuarioId?: number): Promise<Proyecto> {
    const proyecto = await this.proyectosRepo.findOne({
      where: { id },
      relations: ['cliente', 'tareas'],
    });

    if (!proyecto) {
      throw new NotFoundException(`Proyecto ${id} no encontrado`);
    }

    if (proyecto.estado === EstadoProyecto.BAJA) {
      throw new BadRequestException('El proyecto ya está dado de baja');
    }

    proyecto.estado = EstadoProyecto.BAJA;

    const saved = await this.proyectosRepo.save(proyecto);

    await this.historialService.registrar({
      entidad: EntidadHistorial.PROYECTO,
      entidadId: id,
      accion: AccionHistorial.BAJA,
      usuarioId,
      datosAnteriores: {
        estado: EstadoProyecto.ACTIVO,
      },
      datosNuevos: {
        estado: EstadoProyecto.BAJA,
      },
    });

    return saved;
  }
}
