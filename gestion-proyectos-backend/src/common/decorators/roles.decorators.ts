import { SetMetadata } from '@nestjs/common';
import { RolUsuario } from '../enums/estado.enum.js';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: RolUsuario[]) => SetMetadata(ROLES_KEY, roles);
