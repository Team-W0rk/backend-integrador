import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { EstadoTarea } from '../../../common/enums/estado.enum';

export class UpdateTareaDto {
  @ApiPropertyOptional({ example: 'Investigar requisitos', description: 'Descripción de la tarea' })
  @IsOptional()
  @IsString()
  descripcion?: string;

  @ApiPropertyOptional({ enum: EstadoTarea, example: EstadoTarea.PENDIENTE })
  @IsOptional()
  @IsEnum(EstadoTarea)
  estado?: EstadoTarea;
}
