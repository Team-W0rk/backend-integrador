import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EstadoProyecto } from '../../../common/enums/estado.enum.js';
import { Cliente } from '../../clientes/entities/clientes.entity.js';
import { Tarea } from '../../tareas/entities/tareas.entity.js';
import { Meta } from '../../metas/entities/metas.entity.js';

@Entity('proyectos')
export class Proyecto {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column({
    type: 'enum',
    enum: EstadoProyecto,
    enumName: 'estado_proyecto_enum',
    default: EstadoProyecto.ACTIVO,
  })
  estado: EstadoProyecto;

  @Column({ type: 'date', nullable: true })
  fechaFin: Date | null;

  @ManyToOne(() => Cliente, (cliente) => cliente.proyectos, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'clienteId' })
  cliente: Cliente | null;

  @Column({ nullable: true })
  clienteId: number | null;

  @OneToMany(() => Tarea, (tarea) => tarea.proyecto, { cascade: true })
  tareas: Tarea[];

  @OneToMany(() => Meta, (meta) => meta.proyecto, { cascade: true })
  metas: Meta[];

  @CreateDateColumn({ type: 'timestamp' })
  creadoEn: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  actualizadoEn: Date;
}
