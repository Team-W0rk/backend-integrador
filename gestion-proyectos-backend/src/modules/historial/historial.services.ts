import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  Historial,
  EntidadHistorial,
  AccionHistorial,
} from './entities/historial.entity';

interface RegistrarCambioDto {
  entidad: EntidadHistorial;
  entidadId: number;
  accion: AccionHistorial;
  usuarioId?: number;
  datosAnteriores?: Record<string, unknown> | null;
  datosNuevos?: Record<string, unknown> | null;
}

@Injectable()
export class HistorialService {
  constructor(
    @InjectRepository(Historial)
    private readonly historialRepo: Repository<Historial>,
  ) {}

  async registrar(dto: RegistrarCambioDto): Promise<void> {
    const registro = this.historialRepo.create({
      entidad: dto.entidad,
      entidadId: dto.entidadId,
      accion: dto.accion,
      usuarioId: dto.usuarioId ?? null,
      datosAnteriores: dto.datosAnteriores ?? null,
      datosNuevos: dto.datosNuevos ?? null,
    });
    await this.historialRepo.save(registro);
  }

  async findByEntidad(
    entidad: EntidadHistorial,
    entidadId: number,
  ): Promise<Historial[]> {
    return this.historialRepo.find({
      where: { entidad, entidadId },
      relations: ['usuario'],
      order: { creadoEn: 'DESC' },
    });
  }

  async findAll(): Promise<Historial[]> {
    return this.historialRepo.find({
      relations: ['usuario'],
      order: { creadoEn: 'DESC' },
      take: 200,
    });
  }
}
