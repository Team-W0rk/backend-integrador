import { SetMetadata } from '@nestjs/common';
import { RolUsuario } from '../enums/roles.enum';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: RolUsuario[]) => SetMetadata(ROLES_KEY, roles);
