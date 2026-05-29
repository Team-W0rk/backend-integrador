import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateClienteDto {
  @ApiProperty({ example: 'Empresa ABC', description: 'Nombre del cliente' })
  @IsString()
  @IsNotEmpty()
  nombre: string;
}
