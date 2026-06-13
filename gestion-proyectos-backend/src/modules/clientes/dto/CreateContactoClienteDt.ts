import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { TipoContacto } from '../../../common/enums/estado.enum';

export class CreateContactoClienteDto {
  @IsEnum(TipoContacto)
  tipo: TipoContacto;

  @IsString()
  @IsNotEmpty()
  valor: string;

  @IsString()
  @IsOptional()
  etiqueta?: string;
}
