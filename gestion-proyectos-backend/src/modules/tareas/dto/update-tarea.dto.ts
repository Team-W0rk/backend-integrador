import { IsString, IsOptional, IsEnum } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { EstadoTarea } from '../../../common/enums/estado.enum.js';

export class UpdateTareaDto {
  @ApiPropertyOptional({
    example: 'Nueva descripción de la tarea',
    description: 'Descripción de la tarea',
  })
  @IsString()
  @IsOptional()
  descripcion?: string;

  @ApiPropertyOptional({ enum: EstadoTarea, description: 'Estado de la tarea' })
  @IsEnum(EstadoTarea)
  @IsOptional()
  estado?: EstadoTarea;
}
