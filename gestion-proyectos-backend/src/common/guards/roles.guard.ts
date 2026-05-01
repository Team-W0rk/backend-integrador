import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RolUsuario } from '../enums/roles.enum';
import { ROLES_KEY } from '../decorators/roles.decorators';

interface JwtUser {
  id: number;
  username: string;
  rol: RolUsuario;
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const rolesRequeridos = this.reflector.getAllAndOverride<RolUsuario[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!rolesRequeridos || rolesRequeridos.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest<{ user: JwtUser }>();
    const user = request.user;

    if (!user || !rolesRequeridos.includes(user.rol)) {
      throw new ForbiddenException(
        'No tenés permisos para realizar esta acción',
      );
    }

    return true;
  }
}
