import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Integración de Endpoints con DB (e2e)', () => {
  let app: INestApplication;
  let jwtToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    // Configuramos el prefijo global 'api' igual que en src/main.ts
    app.setGlobalPrefix('api');
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/api/auth/login (POST) - Debería iniciar sesión y retornar token', async () => {
    // Usa las credenciales del usuario admin que insertamos por SQL
    const response = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ username: 'admin', password: 'admin123' });
      
    // Dependiendo de tu config, Nest puede devolver 200 o 201 en POST
    expect([200, 201]).toContain(response.status);
    
    // Guarda el token para las siguientes peticiones
    jwtToken = response.body.access_token || response.body.token;
    expect(jwtToken).toBeDefined();
  });

  it('/api/clientes (GET) - Debería retornar todos los clientes', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/clientes')
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
    // Verifica que Acme Corp exista gracias a nuestra data
    expect(response.body.some((c: any) => c.nombre === 'Acme Corp')).toBe(true);
  });

  it('/api/clientes/activos (GET) - Debería retornar sólo los activos', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/clientes/activos')
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(200);

    const nombresClientes = response.body.map((c: any) => c.nombre);
    // Debe incluir activos
    expect(nombresClientes).toContain('Acme Corp');
    // No debe incluir a los dados de baja
    expect(nombresClientes).not.toContain('Stark Industries');
  });

  it('/api/proyectos (GET) - Debería retornar los proyectos', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/proyectos')
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });
});
