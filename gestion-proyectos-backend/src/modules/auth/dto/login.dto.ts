import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'usuario1', description: 'Nombre de usuario válido' })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ example: 'MiClaveSegura123', description: 'Contraseña del usuario' })
  @IsString()
  @IsNotEmpty()
  password: string;
}
