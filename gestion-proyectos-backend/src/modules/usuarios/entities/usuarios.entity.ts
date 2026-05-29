import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EstadoUsuario, RolUsuario } from '../../../common/enums/estado.enum';

@Entity('usuarios')
export class Usuario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: EstadoUsuario,
    enumName: 'estado_usuario_enum',
    default: EstadoUsuario.ACTIVO,
  })
  estado: EstadoUsuario;

  @Column({
    type: 'enum',
    enum: RolUsuario,
    enumName: 'rol_usuario_enum',
    default: RolUsuario.USUARIO,
  })
  rol: RolUsuario;

  @CreateDateColumn({ type: 'timestamp' })
  creadoEn: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  actualizadoEn: Date;
}
