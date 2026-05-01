import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const JwtGuardBase = AuthGuard('jwt') as any;

@Injectable()
export class JwtAuthGuard extends JwtGuardBase {}
