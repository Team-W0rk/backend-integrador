import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EstadoTarea } from '../../../common/enums/estado.enum';
import { Proyecto } from '../../proyectos/entities/proyectos.entity';
import { Meta } from '../../metas/entities/metas.entity';

@Entity('tareas')
export class Tarea {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  descripcion: string;

  @Column({
    type: 'enum',
    enum: EstadoTarea,
    enumName: 'estado_tarea_enum',
    default: EstadoTarea.PENDIENTE,
  })
  estado: EstadoTarea;

  @ManyToOne(() => Proyecto, (proyecto) => proyecto.tareas, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'proyectoId' })
  proyecto: Proyecto;

  @Column()
  proyectoId: number;

  @ManyToOne(() => Meta, (meta) => meta.tareas, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'metaId' })
  meta: Meta | null;

  @Column({ nullable: true })
  metaId: number | null;

  @CreateDateColumn({ type: 'timestamp' })
  creadoEn: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  actualizadoEn: Date;
}
