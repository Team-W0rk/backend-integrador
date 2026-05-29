import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsInt,
  IsDateString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProyectoDto {
  @ApiProperty({
    example: 'Rediseño web corporativo',
    description: 'Nombre del proyecto',
  })
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @ApiPropertyOptional({
    example: 1,
    description: 'ID del cliente activo. Omitir si es proyecto interno.',
  })
  @IsInt()
  @IsOptional()
  clienteId?: number | null;

  @ApiPropertyOptional({
    example: '2024-12-31',
    description:
      'Fecha de finalización del proyecto (YYYY-MM-DD). Omitir si no tiene fecha de fin.',
  })
  @IsDateString()
  @IsOptional()
  fechaFin?: string | null;
}
