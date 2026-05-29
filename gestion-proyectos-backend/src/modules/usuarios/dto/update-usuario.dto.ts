import { IsString, IsOptional, MinLength, IsEnum } from 'class-validator';
import { EstadoUsuario, RolUsuario } from '../../../common/enums/estado.enum';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUsuarioDto {
  @ApiPropertyOptional({ example: 'nuevo_username' })
  @IsString()
  @IsOptional()
  username?: string;

  @ApiPropertyOptional({ example: 'nuevaPass123', minLength: 6 })
  @IsString()
  @MinLength(6)
  @IsOptional()
  password?: string;

  @ApiPropertyOptional({ enum: EstadoUsuario })
  @IsEnum(EstadoUsuario)
  @IsOptional()
  estado?: EstadoUsuario;

  @ApiPropertyOptional({ enum: RolUsuario })
  @IsEnum(RolUsuario)
  @IsOptional()
  rol?: RolUsuario;
}
