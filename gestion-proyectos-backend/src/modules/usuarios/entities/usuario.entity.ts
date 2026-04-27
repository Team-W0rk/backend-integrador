import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { EstadoUsuario } from '../../../common/enums/estado.enum';

@Entity('usuarios')
export class Usuario {
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * DEFAULT en BD: synchronize puede hacer ADD COLUMN NOT NULL; sin esto, filas viejas quedan sin valor y Postgres falla.
   */
  @Column({ name: 'nombre', type: 'varchar', unique: true })
  username: string;

  @Column({ name: 'clave', type: 'varchar' })
  password: string;

  @Column({ type: 'enum', enum: EstadoUsuario, default: EstadoUsuario.ACTIVO })
  estado: EstadoUsuario;
}
