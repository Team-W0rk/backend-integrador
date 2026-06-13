import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  ParseIntPipe,
  UseGuards,
  Delete,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ProyectosService } from './proyectos.service.js';
import { CreateProyectoDto } from './dto/create-proyecto.dto.js';
import { UpdateProyectoDto } from './dto/update-proyecto.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';

@ApiTags('Proyectos')
@ApiBearerAuth('JWT')
@UseGuards(JwtAuthGuard)
@Controller('proyectos')
export class ProyectosController {
  constructor(private readonly proyectosService: ProyectosService) {}

  @Get()
  @ApiOperation({ summary: 'Listar todos los proyectos con cliente y tareas' })
  @ApiResponse({ status: 200, description: 'Lista de proyectos' })
  findAll() {
    return this.proyectosService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un proyecto por ID' })
  @ApiResponse({ status: 200, description: 'Proyecto encontrado' })
  @ApiResponse({ status: 404, description: 'Proyecto no encontrado' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.proyectosService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo proyecto' })
  @ApiResponse({ status: 201, description: 'Proyecto creado' })
  @ApiResponse({ status: 400, description: 'El cliente no está activo' })
  @ApiResponse({ status: 404, description: 'Cliente no encontrado' })
  create(@Body() dto: CreateProyectoDto) {
    return this.proyectosService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Modificar un proyecto (nombre, estado, cliente)' })
  @ApiResponse({ status: 200, description: 'Proyecto actualizado' })
  @ApiResponse({ status: 400, description: 'El cliente no está activo' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProyectoDto,
  ) {
    return this.proyectosService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Dar de baja un proyecto' })
  @ApiResponse({
    status: 200,
    description: 'Proyecto dado de baja',
  })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.proyectosService.remove(id);
  }
}
