import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { HistorialService } from './historial.services.js';
import { EntidadHistorial } from '../../common/enums/historial.enum.js';

@ApiTags('Historial')
@ApiBearerAuth('JWT')
@UseGuards(JwtAuthGuard)
@Controller('historial')
export class HistorialController {
  constructor(private readonly historialService: HistorialService) {}

  @Get()
  @ApiOperation({
    summary: 'Obtener historial completo (últimos 200 registros)',
  })
  findAll() {
    return this.historialService.findAll();
  }

  @Get(':entidad/:id')
  @ApiOperation({ summary: 'Obtener historial de una entidad específica' })
  @ApiQuery({ name: 'entidad', enum: EntidadHistorial })
  findByEntidad(
    @Param('entidad') entidad: EntidadHistorial,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.historialService.findByEntidad(entidad, id);
  }
}
