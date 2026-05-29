import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TipoContacto } from '../../../common/enums/estado.enum';

export class CreateContactoDto {
  @ApiProperty({ enum: TipoContacto, example: TipoContacto.EMAIL })
  @IsEnum(TipoContacto)
  tipo: TipoContacto;

  @ApiProperty({ example: 'ventas@empresa.com' })
  @IsString()
  @IsNotEmpty()
  valor: string;

  @ApiPropertyOptional({ example: 'Ventas' })
  @IsString()
  @IsOptional()
  etiqueta?: string;
}
