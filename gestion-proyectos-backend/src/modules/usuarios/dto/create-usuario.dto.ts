import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  MinLength,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { RolUsuario } from '../../../common/enums/estado.enum';

export class CreateUsuarioDto {
  @ApiProperty({ example: 'jperez' })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ example: 'miPass123', minLength: 6 })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiPropertyOptional({ enum: RolUsuario, default: RolUsuario.USUARIO })
  @IsEnum(RolUsuario)
  @IsOptional()
  rol?: RolUsuario;
}
