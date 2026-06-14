import {
  IsString,
  IsOptional,
  IsEnum,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { EstadoCliente } from '../../../common/enums/estado.enum.js';
import { CreateContactoClienteDto } from './CreateContactoClienteDt.js';

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

  @ApiPropertyOptional({
    description: 'Lista de contactos del cliente',
    type: [CreateContactoClienteDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateContactoClienteDto)
  @IsOptional()
  contactos?: CreateContactoClienteDto[];
}
