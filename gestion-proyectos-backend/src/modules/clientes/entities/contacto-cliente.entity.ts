import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Cliente } from './clientes.entity.js';
import { TipoContacto } from '../../../common/enums/estado.enum.js';

@Entity('contactos_cliente')
export class ContactoCliente {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: TipoContacto,
    enumName: 'tipo_contacto_enum',
  })
  tipo: TipoContacto;

  @Column()
  valor: string;

  @Column({ nullable: true })
  etiqueta?: string;

  @ManyToOne(() => Cliente, (cliente) => cliente.contactos, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'clienteId' })
  cliente: Cliente;

  @Column()
  clienteId: number;

  @CreateDateColumn({ type: 'timestamp' })
  creadoEn: Date;
}
