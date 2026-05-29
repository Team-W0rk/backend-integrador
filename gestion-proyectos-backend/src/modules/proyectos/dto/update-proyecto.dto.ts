import {
  IsString,
  IsOptional,
  IsEnum,
  IsInt,
  IsDateString,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { EstadoProyecto } from '../../../common/enums/estado.enum.js';

export class UpdateProyectoDto {
  @ApiPropertyOptional({
    example: 'Nuevo nombre',
    description: 'Nombre del proyecto',
  })
  @IsString()
  @IsOptional()
  nombre?: string;

  @ApiPropertyOptional({
    enum: EstadoProyecto,
    description: 'Estado del proyecto',
  })
  @IsEnum(EstadoProyecto)
  @IsOptional()
  estado?: EstadoProyecto;

  @ApiPropertyOptional({
    example: 2,
    nullable: true,
    description: 'ID del cliente activo. Enviar null para quitar el cliente.',
  })
  @IsInt()
  @IsOptional()
  clienteId?: number | null;

  @ApiPropertyOptional({
    example: '2024-12-31',
    nullable: true,
  })
  @IsDateString()
  @IsOptional()
  fechaFin?: string | null;
}
