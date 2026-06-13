import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { UsuariosModule } from './modules/usuarios/usuarios.module';
import { ClientesModule } from './modules/clientes/clientes.module';
import { ProyectosModule } from './modules/proyectos/proyectos.module';
import { TareasModule } from './modules/tareas/tareas.module';
import { HistorialModule } from './modules/historial/historial.module';
import { MetasModule } from './modules/metas/metas.module';
import { EstadisticasModule } from './modules/estadisticas/estadisticas.module';
import { getDatabaseConfig } from './config/Database.config';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(getDatabaseConfig()),
    AuthModule,
    UsuariosModule,
    ClientesModule,
    ProyectosModule,
    TareasModule,
    HistorialModule,
    MetasModule,
    EstadisticasModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
