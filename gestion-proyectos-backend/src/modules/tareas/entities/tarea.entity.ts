import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Proyecto } from '../../proyectos/entities/proyecto.entity';
import { EstadoTarea } from '../../../common/enums/estado.enum';

@Entity('tareas')
export class Tarea {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  descripcion: string;

  @Column({ type: 'enum', enum: EstadoTarea, default: EstadoTarea.PENDIENTE })
  estado: EstadoTarea;

  @ManyToOne(() => Proyecto, (proyecto) => proyecto.tareas, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_proyecto' })
  proyecto: Proyecto;
}
