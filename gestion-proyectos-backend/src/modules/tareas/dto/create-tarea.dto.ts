import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { EstadoTarea } from '../../../common/enums/estado.enum';

export class CreateTareaDto {
  @ApiProperty({ example: 'Investigar requisitos', description: 'Descripción de la tarea' })
  @IsString()
  @IsNotEmpty()
  descripcion: string;

  @ApiProperty({ enum: EstadoTarea, example: EstadoTarea.PENDIENTE })
  @IsEnum(EstadoTarea)
  estado: EstadoTarea;
}
