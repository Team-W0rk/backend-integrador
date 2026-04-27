import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { EstadoProyecto } from '../../../common/enums/estado.enum';

export class CreateProyectoDto {
  @ApiProperty({ example: 'Proyecto Integrador', description: 'Nombre del proyecto' })
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @ApiProperty({ enum: EstadoProyecto, example: EstadoProyecto.ACTIVO })
  @IsEnum(EstadoProyecto)
  estado: EstadoProyecto;

  @ApiPropertyOptional({ type: Number, example: 1, description: 'ID de cliente activo asociado (opcional)' })
  @IsOptional()
  id_cliente?: number;
}
