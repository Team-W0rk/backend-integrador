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
import { EstadoMeta } from '../../../common/enums/estado.enum.js';
import { Proyecto } from '../../proyectos/entities/proyectos.entity.js';
import { Tarea } from '../../tareas/entities/tareas.entity.js';

@Entity('metas')
export class Meta {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column({ nullable: true })
  descripcion?: string;

  @Column({ type: 'date', nullable: true })
  fechaLimite: Date | null;

  @Column({
    type: 'enum',
    enum: EstadoMeta,
    enumName: 'estado_meta_enum',
    default: EstadoMeta.PENDIENTE,
  })
  estado: EstadoMeta;

  @ManyToOne(() => Proyecto, (proyecto) => proyecto.metas, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'proyectoId' })
  proyecto: Proyecto;

  @Column()
  proyectoId: number;

  @OneToMany(() => Tarea, (tarea) => tarea.meta)
  tareas: Tarea[];

  @CreateDateColumn({ type: 'timestamp' })
  creadoEn: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  actualizadoEn: Date;
}
