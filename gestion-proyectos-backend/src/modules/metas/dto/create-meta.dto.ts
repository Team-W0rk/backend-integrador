import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsDateString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateMetaDto {
  @ApiProperty({
    example: 'MVP funcional',
    description: 'Nombre de la meta intermedia',
  })
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @ApiPropertyOptional({ example: 'Tener el núcleo del sistema funcionando' })
  @IsString()
  @IsOptional()
  descripcion?: string;

  @ApiPropertyOptional({
    example: '2026-09-01',
    description: 'Fecha límite objetivo (YYYY-MM-DD)',
  })
  @IsDateString()
  @IsOptional()
  fechaLimite?: string | null;
}
