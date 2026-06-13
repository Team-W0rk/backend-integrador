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
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { MetasService } from './metas.service.js';
import { CreateMetaDto } from './dto/create-meta.dto.js';
import { UpdateMetaDto } from './dto/update-meta.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../../common/guards/roles.guard.js';

@ApiTags('Metas')
@ApiBearerAuth('JWT')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('proyectos/:proyectoId/metas')
export class MetasController {
  constructor(private readonly metasService: MetasService) {}

  @Get()
  @ApiOperation({ summary: 'Listar metas de un proyecto' })
  @ApiParam({ name: 'proyectoId' })
  findAll(@Param('proyectoId', ParseIntPipe) proyectoId: number) {
    return this.metasService.findByProyecto(proyectoId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una meta por ID' })
  @ApiParam({ name: 'proyectoId' })
  findOne(
    @Param('proyectoId', ParseIntPipe) proyectoId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.metasService.findOne(proyectoId, id);
  }

  @Post()
  @ApiOperation({ summary: 'Crear una meta en un proyecto' })
  @ApiParam({ name: 'proyectoId' })
  create(
    @Param('proyectoId', ParseIntPipe) proyectoId: number,
    @Body() dto: CreateMetaDto,
  ) {
    return this.metasService.create(proyectoId, dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Modificar una meta' })
  @ApiParam({ name: 'proyectoId' })
  update(
    @Param('proyectoId', ParseIntPipe) proyectoId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateMetaDto,
  ) {
    return this.metasService.update(proyectoId, id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una meta' })
  @ApiParam({ name: 'proyectoId' })
  remove(
    @Param('proyectoId', ParseIntPipe) proyectoId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.metasService.remove(proyectoId, id);
  }

  @Post(':id/tareas/:tareaId')
  @ApiOperation({ summary: 'Asignar una tarea a una meta' })
  @ApiParam({ name: 'proyectoId' })
  @ApiParam({ name: 'id', description: 'ID de la meta' })
  @ApiParam({ name: 'tareaId' })
  asignarTarea(
    @Param('proyectoId', ParseIntPipe) proyectoId: number,
    @Param('id', ParseIntPipe) metaId: number,
    @Param('tareaId', ParseIntPipe) tareaId: number,
  ) {
    return this.metasService.asignarTarea(proyectoId, metaId, tareaId);
  }

  @Delete(':id/tareas/:tareaId')
  @ApiOperation({ summary: 'Quitar una tarea de una meta' })
  @ApiParam({ name: 'proyectoId' })
  @ApiParam({ name: 'id', description: 'ID de la meta' })
  @ApiParam({ name: 'tareaId' })
  desasignarTarea(
    @Param('proyectoId', ParseIntPipe) proyectoId: number,
    @Param('id', ParseIntPipe) metaId: number,
    @Param('tareaId', ParseIntPipe) tareaId: number,
  ) {
    return this.metasService.desasignarTarea(proyectoId, metaId, tareaId);
  }
}
