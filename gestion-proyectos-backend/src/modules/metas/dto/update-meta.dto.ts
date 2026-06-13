import { IsString, IsOptional, IsEnum, IsDateString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { EstadoMeta } from '../../../common/enums/estado.enum';

export class UpdateMetaDto {
  @ApiPropertyOptional({ example: 'Nuevo nombre de la meta' })
  @IsString()
  @IsOptional()
  nombre?: string;

  @ApiPropertyOptional({ example: 'Nueva descripción' })
  @IsString()
  @IsOptional()
  descripcion?: string;

  @ApiPropertyOptional({ enum: EstadoMeta })
  @IsEnum(EstadoMeta)
  @IsOptional()
  estado?: EstadoMeta;

  @ApiPropertyOptional({ example: '2026-10-01', nullable: true })
  @IsDateString()
  @IsOptional()
  fechaLimite?: string | null;
}
