import { Controller, Post, Body, ForbiddenException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service.js';
import { LoginDto } from './dto/login.dto.js';
import { SeedAdminDto } from './dto/seed-admin.dto.js';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Iniciar sesión y obtener token JWT' })
  @ApiResponse({
    status: 200,
    description: 'Login exitoso, devuelve access_token',
  })
  @ApiResponse({
    status: 401,
    description: 'Credenciales incorrectas o usuario inactivo',
  })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  // SEED ADMIN (solo setup inicial)
  @Post('seed-admin')
  @ApiOperation({ summary: 'Crear admin inicial (solo desarrollo)' })
  seedAdmin(@Body() dto: SeedAdminDto) {
    if (dto.secret !== process.env.SEED_SECRET) {
      throw new ForbiddenException('No autorizado');
    }

    return this.authService.createAdmin(dto);
  }
}
