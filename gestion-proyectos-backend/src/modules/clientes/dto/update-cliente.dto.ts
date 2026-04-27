import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { EstadoCliente } from '../../../common/enums/estado.enum';

export class UpdateClienteDto {
  @ApiPropertyOptional({ example: 'Cliente ABC', description: 'Nombre del cliente' })
  @IsOptional()
  @IsString()
  nombre?: string;

  @ApiPropertyOptional({ enum: EstadoCliente, example: EstadoCliente.ACTIVO })
  @IsOptional()
  @IsEnum(EstadoCliente)
  estado?: EstadoCliente;
}
