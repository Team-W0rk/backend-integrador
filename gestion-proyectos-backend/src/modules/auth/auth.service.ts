import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { SeedAdminDto } from './dto/seed-admin.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usuariosService: UsuariosService,
    private readonly jwtService: JwtService,
  ) {}

  async login(dto: LoginDto): Promise<{ access_token: string }> {
    const usuario = await this.usuariosService.findByUsername(dto.username);

    if (!usuario) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    if (usuario.estado !== EstadoUsuario.ACTIVO) {
      throw new UnauthorizedException('Usuario inactivo');
    }

    const passwordOk = await bcrypt.compare(dto.password, usuario.password);
    if (!passwordOk) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    const payload = {
      sub: usuario.id,
      username: usuario.username,
      rol: usuario.rol,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async createAdmin(dto: SeedAdminDto) {
    const exists = await this.usuariosService.findByUsername(dto.username);

    if (exists) {
      throw new Error('El admin ya existe');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    return this.usuariosService.create({
      username: dto.username,
      password: hashedPassword,
      rol: RolUsuario.ADMIN,
    });
  }
}
