import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { EstadoCliente } from '../../../common/enums/estado.enum';

export class CreateClienteDto {
  @ApiProperty({ example: 'Cliente ABC', description: 'Nombre del cliente' })
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @ApiProperty({ enum: EstadoCliente, example: EstadoCliente.ACTIVO })
  @IsEnum(EstadoCliente)
  estado: EstadoCliente;
}
