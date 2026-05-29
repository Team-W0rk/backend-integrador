import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientesService } from './clientes.service';
import { ClientesController } from './clientes.controller';
import { Cliente } from './entities/clientes.entity';
import { HistorialModule } from '../historial/historial.module';

@Module({
  imports: [TypeOrmModule.forFeature([Cliente]), HistorialModule],
  providers: [ClientesService],
  controllers: [ClientesController],
  exports: [ClientesService],
})
export class ClientesModule {}
