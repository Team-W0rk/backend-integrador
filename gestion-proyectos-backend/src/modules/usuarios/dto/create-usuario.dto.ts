import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { EstadoUsuario } from '../../../common/enums/estado.enum';

export class CreateUsuarioDto {
  @ApiProperty({ example: 'usuario1', description: 'Nombre de usuario único' })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ example: 'MiClaveSegura123', description: 'Contraseña con al menos 6 caracteres' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ enum: EstadoUsuario, example: EstadoUsuario.ACTIVO })
  @IsEnum(EstadoUsuario)
  estado: EstadoUsuario;
}
