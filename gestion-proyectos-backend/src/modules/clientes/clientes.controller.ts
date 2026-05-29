import {
  Controller,
  Get,
  Post,
  Patch,
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
} from '@nestjs/swagger';
import { ClientesService } from './clientes.service.js';
import { UpdateClienteDto } from './dto/update-cliente.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { CreateClienteDto } from './dto/create-cliente.dto.js';

@ApiTags('Clientes')
@ApiBearerAuth('JWT')
@UseGuards(JwtAuthGuard)
@Controller('clientes')
export class ClientesController {
  constructor(private readonly clientesService: ClientesService) {}

  @Get()
  @ApiOperation({ summary: 'Listar todos los clientes' })
  @ApiResponse({
    status: 200,
    description: 'Lista de clientes con sus proyectos',
  })
  findAll() {
    return this.clientesService.findAll();
  }

  @Get('activos')
  @ApiOperation({
    summary: 'Listar solo clientes activos (para selector en proyectos)',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de clientes en estado Activo',
  })
  findActivos() {
    return this.clientesService.findActivos();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un cliente por ID' })
  @ApiResponse({ status: 200, description: 'Cliente encontrado' })
  @ApiResponse({ status: 404, description: 'Cliente no encontrado' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.clientesService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo cliente' })
  @ApiResponse({ status: 201, description: 'Cliente creado' })
  create(@Body() dto: CreateClienteDto) {
    return this.clientesService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Modificar un cliente' })
  @ApiResponse({ status: 200, description: 'Cliente actualizado' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateClienteDto) {
    return this.clientesService.update(id, dto);
  }

  @Patch(':id/baja')
  @ApiOperation({ summary: 'Dar de baja un cliente' })
  @ApiResponse({ status: 200, description: 'Cliente dado de baja' })
  @ApiResponse({
    status: 400,
    description: 'No se puede dar de baja: tiene proyectos asociados',
  })
  darBaja(@Param('id', ParseIntPipe) id: number) {
    return this.clientesService.darBaja(id);
  }
}
