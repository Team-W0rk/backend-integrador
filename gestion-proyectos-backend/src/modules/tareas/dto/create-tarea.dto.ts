import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTareaDto {
  @ApiProperty({
    example: 'Diseñar mockups de la pantalla principal',
    description: 'Descripción de la tarea',
  })
  @IsString()
  @IsNotEmpty()
  descripcion: string;
}
