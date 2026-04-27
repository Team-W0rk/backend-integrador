import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { EstadoProyecto } from '../../../common/enums/estado.enum';

export class UpdateProyectoDto {
  @ApiPropertyOptional({ example: 'Proyecto Integrador', description: 'Nombre del proyecto' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  nombre?: string;

  @ApiPropertyOptional({ enum: EstadoProyecto, example: EstadoProyecto.ACTIVO })
  @IsOptional()
  @IsEnum(EstadoProyecto)
  estado?: EstadoProyecto;

  @ApiPropertyOptional({ type: Number, example: 1, description: 'ID de cliente activo asociado, o null para proyecto interno' })
  @IsOptional()
  id_cliente?: number | null;
}
