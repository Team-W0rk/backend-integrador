import { Body, Controller, Delete, Param, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { TareasService } from './tareas.service';
import { CreateTareaDto } from './dto/create-tarea.dto';
import { UpdateTareaDto } from './dto/update-tarea.dto';

@ApiBearerAuth()
@ApiTags('Tareas')
@Controller('proyectos/:proyectoId/tareas')
export class TareasController {
  constructor(private readonly tareasService: TareasService) {}

  @Post()
  create(@Param('proyectoId') proyectoId: string, @Body() createTareaDto: CreateTareaDto) {
    return this.tareasService.create(Number(proyectoId), createTareaDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTareaDto: UpdateTareaDto) {
    return this.tareasService.update(Number(id), updateTareaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tareasService.remove(Number(id));
  }
}
