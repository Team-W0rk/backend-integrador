import { IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SeedAdminDto {
  @ApiProperty({ example: 'admin' })
  @IsString()
  username: string;

  @ApiProperty({ example: '123456' })
  @IsString()
  @MinLength(4)
  password: string;

  @ApiProperty({ example: 'seed-secret' })
  @IsString()
  secret: string;
}
