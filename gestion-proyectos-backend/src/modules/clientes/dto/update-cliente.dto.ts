import { IsString, IsOptional, IsEnum } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { EstadoCliente } from '../../../common/enums/estado.enum.js';

export class UpdateClienteDto {
  @ApiPropertyOptional({
    example: 'Empresa XYZ',
    description: 'Nuevo nombre del cliente',
  })
  @IsString()
  @IsOptional()
  nombre?: string;

  @ApiPropertyOptional({
    enum: EstadoCliente,
    description: 'Nuevo estado del cliente',
  })
  @IsEnum(EstadoCliente)
  @IsOptional()
  estado?: EstadoCliente;
}
