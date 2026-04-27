import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsuariosService } from '../usuarios/usuarios.service';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { EstadoUsuario } from '../../common/enums/estado.enum';

@Injectable()
export class AuthService {
  constructor(
    private readonly usuariosService: UsuariosService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string) {
    const user = await this.usuariosService.findByUsername(username);
    if (!user || user.estado !== EstadoUsuario.ACTIVO) {
      return null;
    }

    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) {
      return null;
    }

    const { password: _password, ...result } = user;
    return result;
  }

  async login(loginDto: LoginDto) {
    const user = await this.usuariosService.findByUsername(loginDto.username);
    if (!user) {
      throw new UnauthorizedException('Usuario o clave inválidos');
    }

    const isValid = await bcrypt.compare(loginDto.password, user.password);
    if (!isValid) {
      throw new UnauthorizedException('Usuario o clave inválidos');
    }

    return {
      access_token: this.jwtService.sign({ username: user.username, sub: user.id }),
    };
  }
}
