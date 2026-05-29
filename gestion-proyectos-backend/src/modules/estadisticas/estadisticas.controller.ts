import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { EstadisticasService } from './estadisticas.service.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';

@ApiTags('Estadísticas')
@ApiBearerAuth('JWT')
@UseGuards(JwtAuthGuard)
@Controller('estadisticas')
export class EstadisticasController {
  constructor(private readonly estadisticasService: EstadisticasService) {}

  @Get('resumen')
  @ApiOperation({
    summary: 'Resumen general: proyectos, tareas, clientes y usuarios',
  })
  getResumen() {
    return this.estadisticasService.getResumen();
  }

  @Get('proyectos-por-cliente')
  @ApiOperation({ summary: 'Cantidad de proyectos agrupados por cliente' })
  getProyectosPorCliente() {
    return this.estadisticasService.getProyectosPorCliente();
  }

  @Get('tareas-por-proyecto')
  @ApiOperation({
    summary: 'Cantidad de tareas por proyecto con desglose por estado',
  })
  getTareasPorProyecto() {
    return this.estadisticasService.getTareasPorProyecto();
  }

  @Get('proyectos-retrasados')
  @ApiOperation({
    summary: 'Proyectos activos que superaron su fecha de finalización',
  })
  getProyectosRetrasados() {
    return this.estadisticasService.getProyectosRetrasados();
  }
}
