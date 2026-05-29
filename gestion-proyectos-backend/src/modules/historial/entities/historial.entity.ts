import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Usuario } from '../../usuarios/entities/usuarios.entity.js';
import { EntidadHistorial } from '../../../common/enums/historial.enum.js';

export enum AccionHistorial {
  CREAR = 'crear',
  MODIFICAR = 'modificar',
  BAJA = 'baja',
  ELIMINAR = 'eliminar',
}

@Entity('historial')
export class Historial {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: EntidadHistorial,
    enumName: 'entidad_historial_enum',
  })
  entidad: EntidadHistorial;

  @Column()
  entidadId: number;

  @Column({
    type: 'enum',
    enum: AccionHistorial,
    enumName: 'accion_historial_enum',
  })
  accion: AccionHistorial;

  @Column({ type: 'jsonb', nullable: true })
  datosAnteriores: Record<string, unknown> | null;

  @Column({ type: 'jsonb', nullable: true })
  datosNuevos: Record<string, unknown> | null;

  @ManyToOne(() => Usuario, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'usuarioId' })
  usuario: Usuario | null;

  @Column({ nullable: true })
  usuarioId: number | null;

  @CreateDateColumn({ type: 'timestamp' })
  creadoEn: Date;
}

export { EntidadHistorial };
