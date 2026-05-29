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
import { UsuariosService } from './usuarios.service.js';
import { CreateUsuarioDto } from './dto/create-usuario.dto.js';
import { UpdateUsuarioDto } from './dto/update-usuario.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';

@ApiTags('Usuarios')
@ApiBearerAuth('JWT')
@UseGuards(JwtAuthGuard)
@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Get()
  @ApiOperation({ summary: 'Listar todos los usuarios' })
  @ApiResponse({
    status: 200,
    description: 'Lista de usuarios (sin contraseña)',
  })
  findAll() {
    return this.usuariosService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un usuario por ID' })
  @ApiResponse({ status: 200, description: 'Usuario encontrado' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usuariosService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo usuario' })
  @ApiResponse({ status: 201, description: 'Usuario creado' })
  @ApiResponse({ status: 409, description: 'El nombre de usuario ya existe' })
  create(@Body() dto: CreateUsuarioDto) {
    return this.usuariosService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Modificar un usuario' })
  @ApiResponse({ status: 200, description: 'Usuario actualizado' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateUsuarioDto) {
    return this.usuariosService.update(id, dto);
  }

  @Patch(':id/baja')
  @ApiOperation({ summary: 'Dar de baja un usuario' })
  @ApiResponse({ status: 200, description: 'Usuario dado de baja' })
  darBaja(@Param('id', ParseIntPipe) id: number) {
    return this.usuariosService.darBaja(id);
  }
}
