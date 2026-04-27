import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { EstadoUsuario } from '../../../common/enums/estado.enum';

export class UpdateUsuarioDto {
  @ApiPropertyOptional({ example: 'usuario1', description: 'Nombre de usuario' })
  @IsOptional()
  @IsString()
  username?: string;

  @ApiPropertyOptional({ example: 'NuevaClave123', description: 'Contraseña nueva' })
  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;

  @ApiPropertyOptional({ enum: EstadoUsuario, example: EstadoUsuario.ACTIVO })
  @IsOptional()
  @IsEnum(EstadoUsuario)
  estado?: EstadoUsuario;
}
