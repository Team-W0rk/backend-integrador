import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { TareasService } from './tareas.service.js';
import { CreateTareaDto } from './dto/create-tarea.dto.js';
import { UpdateTareaDto } from './dto/update-tarea.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';

@ApiTags('Tareas')
@ApiBearerAuth('JWT')
@UseGuards(JwtAuthGuard)
@Controller('proyectos/:proyectoId/tareas')
export class TareasController {
  constructor(private readonly tareasService: TareasService) {}

  @Get()
  @ApiOperation({ summary: 'Listar todas las tareas de un proyecto' })
  @ApiParam({ name: 'proyectoId', description: 'ID del proyecto' })
  @ApiResponse({ status: 200, description: 'Lista de tareas del proyecto' })
  @ApiResponse({ status: 404, description: 'Proyecto no encontrado' })
  findAll(@Param('proyectoId', ParseIntPipe) proyectoId: number) {
    return this.tareasService.findByProyecto(proyectoId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una tarea por ID dentro de un proyecto' })
  @ApiParam({ name: 'proyectoId', description: 'ID del proyecto' })
  @ApiParam({ name: 'id', description: 'ID de la tarea' })
  @ApiResponse({ status: 200, description: 'Tarea encontrada' })
  @ApiResponse({ status: 404, description: 'Tarea o proyecto no encontrado' })
  findOne(
    @Param('proyectoId', ParseIntPipe) proyectoId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.tareasService.findOne(proyectoId, id);
  }

  @Post()
  @ApiOperation({ summary: 'Agregar una tarea a un proyecto' })
  @ApiParam({ name: 'proyectoId', description: 'ID del proyecto' })
  @ApiResponse({ status: 201, description: 'Tarea creada' })
  @ApiResponse({ status: 404, description: 'Proyecto no encontrado' })
  create(
    @Param('proyectoId', ParseIntPipe) proyectoId: number,
    @Body() dto: CreateTareaDto,
  ) {
    return this.tareasService.create(proyectoId, dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Modificar una tarea (descripción o estado)' })
  @ApiParam({ name: 'proyectoId', description: 'ID del proyecto' })
  @ApiParam({ name: 'id', description: 'ID de la tarea' })
  @ApiResponse({ status: 200, description: 'Tarea actualizada' })
  update(
    @Param('proyectoId', ParseIntPipe) proyectoId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTareaDto,
  ) {
    return this.tareasService.update(proyectoId, id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una tarea de un proyecto' })
  @ApiParam({ name: 'proyectoId', description: 'ID del proyecto' })
  @ApiParam({ name: 'id', description: 'ID de la tarea' })
  @ApiResponse({ status: 200, description: 'Tarea eliminada' })
  @ApiResponse({ status: 404, description: 'Tarea no encontrada' })
  remove(
    @Param('proyectoId', ParseIntPipe) proyectoId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.tareasService.remove(proyectoId, id);
  }
}
