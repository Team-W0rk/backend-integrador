import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Cliente } from '../../clientes/entities/cliente.entity';
import { Tarea } from '../../tareas/entities/tarea.entity';
import { EstadoProyecto } from '../../../common/enums/estado.enum';

@Entity('proyectos')
export class Proyecto {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column({ type: 'enum', enum: EstadoProyecto, default: EstadoProyecto.ACTIVO })
  estado: EstadoProyecto;

  @ManyToOne(() => Cliente, (cliente) => cliente.proyectos, { nullable: true })
  @JoinColumn({ name: 'id_cliente' })
  cliente: Cliente | null;

  @OneToMany(() => Tarea, (tarea) => tarea.proyecto, { cascade: true })
  tareas: Tarea[];
}
