import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';

/** Marca un handler o controller como accesible sin JWT (login, registro, health, etc.). */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
