import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Proyecto } from '../proyectos/entities/proyectos.entity';
import { Tarea } from '../tareas/entities/tareas.entity';
import { Cliente } from '../clientes/entities/clientes.entity';
import { Usuario } from '../usuarios/entities/usuarios.entity';
import {
  EstadoCliente,
  EstadoProyecto,
  EstadoTarea,
  EstadoUsuario,
} from '../../common/enums/estado.enum';

@Injectable()
export class EstadisticasService {
  constructor(
    @InjectRepository(Proyecto)
    private readonly proyectosRepo: Repository<Proyecto>,
    @InjectRepository(Tarea) private readonly tareasRepo: Repository<Tarea>,
    @InjectRepository(Cliente)
    private readonly clientesRepo: Repository<Cliente>,
    @InjectRepository(Usuario)
    private readonly usuariosRepo: Repository<Usuario>,
  ) {}

  async getResumen() {
    const hoy = new Date();

    const [
      totalProyectos,
      proyectosActivos,
      proyectosFinalizados,
      proyectosBaja,
      totalTareas,
      tareasPendientes,
      tareasFinalizadas,
      totalClientes,
      clientesActivos,
      totalUsuarios,
      usuariosActivos,
    ] = await Promise.all([
      this.proyectosRepo.count(),
      this.proyectosRepo.count({ where: { estado: EstadoProyecto.ACTIVO } }),
      this.proyectosRepo.count({
        where: { estado: EstadoProyecto.FINALIZADO },
      }),
      this.proyectosRepo.count({ where: { estado: EstadoProyecto.BAJA } }),
      this.tareasRepo.count(),
      this.tareasRepo.count({ where: { estado: EstadoTarea.PENDIENTE } }),
      this.tareasRepo.count({ where: { estado: EstadoTarea.FINALIZADO } }),
      this.clientesRepo.count(),
      this.clientesRepo.count({ where: { estado: EstadoCliente.ACTIVO } }),
      this.usuariosRepo.count(),
      this.usuariosRepo.count({ where: { estado: EstadoUsuario.ACTIVO } }),
    ]);

    // Proyectos retrasados
    const proyectosConFecha = await this.proyectosRepo.find({
      where: { estado: EstadoProyecto.ACTIVO },
      select: ['id', 'nombre', 'fechaFin'],
    });
    const proyectosRetrasados = proyectosConFecha.filter(
      (p) => p.fechaFin && new Date(p.fechaFin) < hoy,
    ).length;

    return {
      proyectos: {
        total: totalProyectos,
        activos: proyectosActivos,
        finalizados: proyectosFinalizados,
        baja: proyectosBaja,
        retrasados: proyectosRetrasados,
      },
      tareas: {
        total: totalTareas,
        pendientes: tareasPendientes,
        finalizadas: tareasFinalizadas,
        baja: totalTareas - tareasPendientes - tareasFinalizadas,
      },
      clientes: {
        total: totalClientes,
        activos: clientesActivos,
        baja: totalClientes - clientesActivos,
      },
      usuarios: {
        total: totalUsuarios,
        activos: usuariosActivos,
      },
    };
  }

  async getProyectosPorCliente() {
    return this.proyectosRepo
      .createQueryBuilder('p')
      .leftJoin('p.cliente', 'c')
      .select([
        "COALESCE(c.nombre, 'Interno') AS cliente",
        'COUNT(p.id) AS total',
        `SUM(CASE WHEN p.estado = '${EstadoProyecto.ACTIVO}' THEN 1 ELSE 0 END) AS activos`,
        `SUM(CASE WHEN p.estado = '${EstadoProyecto.FINALIZADO}' THEN 1 ELSE 0 END) AS finalizados`,
      ])
      .groupBy('c.nombre')
      .orderBy('total', 'DESC')
      .getRawMany();
  }

  async getTareasPorProyecto() {
    return this.tareasRepo
      .createQueryBuilder('t')
      .innerJoin('t.proyecto', 'p')
      .select([
        'p.id AS proyectoId',
        'p.nombre AS proyecto',
        'COUNT(t.id) AS total',
        `SUM(CASE WHEN t.estado = '${EstadoTarea.PENDIENTE}' THEN 1 ELSE 0 END) AS pendientes`,
        `SUM(CASE WHEN t.estado = '${EstadoTarea.FINALIZADO}' THEN 1 ELSE 0 END) AS finalizadas`,
      ])
      .groupBy('p.id, p.nombre')
      .orderBy('total', 'DESC')
      .getRawMany();
  }

  async getProyectosRetrasados() {
    const hoy = new Date();
    const proyectos = await this.proyectosRepo.find({
      where: { estado: EstadoProyecto.ACTIVO },
      relations: ['cliente'],
      select: ['id', 'nombre', 'fechaFin', 'estado'],
    });

    return proyectos
      .filter((p) => p.fechaFin && new Date(p.fechaFin) < hoy)
      .map((p) => ({
        id: p.id,
        nombre: p.nombre,
        cliente: p.cliente?.nombre ?? 'Interno',
        fechaFin: p.fechaFin,
        diasRetraso: Math.floor(
          (hoy.getTime() - new Date(p.fechaFin).getTime()) /
            (1000 * 60 * 60 * 24),
        ),
      }));
  }
}
