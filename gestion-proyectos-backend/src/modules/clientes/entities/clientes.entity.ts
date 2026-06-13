import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EstadoCliente } from '../../../common/enums/estado.enum.js';
import { Proyecto } from '../../proyectos/entities/proyectos.entity.js';
import { ContactoCliente } from './contacto-cliente.entity.js';

@Entity('clientes')
export class Cliente {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column({
    type: 'enum',
    enum: EstadoCliente,
    enumName: 'estado_cliente_enum',
    default: EstadoCliente.ACTIVO,
  })
  estado: EstadoCliente;

  @OneToMany(() => Proyecto, (proyecto) => proyecto.cliente)
  proyectos: Proyecto[];

  @OneToMany(() => ContactoCliente, (contacto) => contacto.cliente, {
    cascade: true,
  })
  contactos: ContactoCliente[];

  @CreateDateColumn({ type: 'timestamp' })
  creadoEn: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  actualizadoEn: Date;
}
