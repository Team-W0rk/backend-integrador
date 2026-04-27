# Gestión de Proyectos — Backend

Backend del sistema de gestión de proyectos desarrollado como Trabajo Final Integrador de la **Tecnicatura Universitaria en Desarrollo Web — UNER**.

Desarrollado con **NestJS**, **TypeORM** y **MySQL**.

---

## Tecnologías

| Tecnología | Versión | Uso |
|---|---|---|
| NestJS | ^10 | Framework principal |
| TypeORM | ^0.3 | ORM para base de datos |
| MySQL | 8.0 | Base de datos |
| JWT + Passport | — | Autenticación |
| Swagger | ^7 | Documentación de API |
| Compodoc | ^1.1 | Documentación del código |
| class-validator | ^0.14 | Validación de DTOs |

---

## Requisitos previos

- Node.js 18 o superior
- MySQL 8.0
- npm

---

## Instalación y configuración

### 1. Clonar el repositorio

```bash
git clone <url-del-repositorio>
cd gestion-proyectos-backend
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Crear la base de datos en MySQL

```sql
CREATE DATABASE gestion_proyectos;
```

### 4. Configurar variables de entorno

Crear un archivo `.env` en la raíz del proyecto:

```env
DB_HOST=localhost
DB_PORT=tu_puerto_de_base_de_datos
DB_USER=tu_usuario_de_base_de_datos
DB_PASS=tu_contraseña_de_base_de_datos
DB_NAME=gestion_proyectos

JWT_SECRET=un_string_largo_y_secreto
```

### 5. Levantar el servidor

```bash
npm run start:dev
```

El servidor queda disponible en `http://localhost:3000`.

---

## Primer uso

Al levantar el servidor por primera vez, TypeORM crea todas las tablas automáticamente gracias a `synchronize: true`.

Para crear el usuario administrador inicial, usar la ruta pública `POST /api/usuarios`:

```json
{
  "username": "admin",
  "password": "admin123",
  "rol": "admin"
}
```

Luego iniciar sesión en `POST /api/auth/login` para obtener el token JWT y usarlo en el resto de los endpoints.

---

## Documentación

### Swagger (documentación de la API)

Disponible en: `http://localhost:3000/docs`

Permite probar todos los endpoints directamente desde el navegador. Para endpoints protegidos, hacer click en **Authorize** e ingresar el token obtenido del login con el formato:

```
Bearer <token>
```

### Compodoc (documentación del código)

```bash
# Levantar servidor de documentación en http://localhost:8080
npm run compodoc

# O generar archivos estáticos en /documentation
npm run compodoc:build
```

---

## Estructura del proyecto

```
src/
├── config/
│   └── database.config.ts        # Configuración de la base de datos
├── modules/
│   ├── auth/                     # Autenticación JWT
│   │   ├── guards/
│   │   └── dto/
│   ├── usuarios/                 # Gestión de usuarios
│   │   ├── entities/
│   │   └── dto/
│   ├── clientes/                 # Gestión de clientes y contactos
│   │   ├── entities/
│   │   └── dto/
│   ├── proyectos/                # Gestión de proyectos
│   │   ├── entities/
│   │   └── dto/
│   ├── tareas/                   # Gestión de tareas
│   │   ├── entities/
│   │   └── dto/
│   └── common/                   # Enums, guards y decoradores compartidos
│       ├── enums/
│       ├── guards/
│       └── decorators/
├── app.module.ts
└── main.ts
```

---

## Endpoints principales

### Auth
| Método | Ruta | Descripción | Auth |
|---|---|---|---|
| POST | `/api/auth/login` | Iniciar sesión, obtiene token JWT | No |

### Usuarios
| Método | Ruta | Descripción | Auth |
|---|---|---|---|
| GET | `/api/usuarios` | Listar usuarios | Sí |
| GET | `/api/usuarios/:id` | Obtener usuario | Sí |
| POST | `/api/usuarios` | Crear usuario | No* |
| PATCH | `/api/usuarios/:id` | Modificar usuario | Sí |
| PATCH | `/api/usuarios/:id/baja` | Dar de baja usuario | Sí |

*Solo el primer usuario puede crearse sin autenticación.

### Clientes
| Método | Ruta | Descripción | Auth |
|---|---|---|---|
| GET | `/api/clientes` | Listar clientes (con filtros y paginación) | Sí |
| GET | `/api/clientes/activos` | Solo clientes activos | Sí |
| GET | `/api/clientes/exportar/csv` | Exportar a CSV | Sí |
| GET | `/api/clientes/:id` | Obtener cliente | Sí |
| POST | `/api/clientes` | Crear cliente | Sí |
| PATCH | `/api/clientes/:id` | Modificar cliente | Sí |
| PATCH | `/api/clientes/:id/baja` | Dar de baja (solo ADMIN) | Sí |
| POST | `/api/clientes/:id/contactos` | Agregar teléfono o email | Sí |
| DELETE | `/api/clientes/:id/contactos/:contactoId` | Eliminar contacto | Sí |

### Proyectos
| Método | Ruta | Descripción | Auth |
|---|---|---|---|
| GET | `/api/proyectos` | Listar proyectos (con filtros y paginación) | Sí |
| GET | `/api/proyectos/exportar/csv` | Exportar a CSV | Sí |
| GET | `/api/proyectos/:id` | Obtener proyecto (incluye retrasado y días restantes) | Sí |
| POST | `/api/proyectos` | Crear proyecto | Sí |
| PATCH | `/api/proyectos/:id` | Modificar proyecto | Sí |
| PATCH | `/api/proyectos/:id/baja` | Dar de baja (solo ADMIN) | Sí |

### Tareas
| Método | Ruta | Descripción | Auth |
|---|---|---|---|
| GET | `/api/proyectos/:id/tareas` | Listar tareas del proyecto | Sí |
| GET | `/api/proyectos/:id/tareas/:tareaId` | Obtener tarea | Sí |
| POST | `/api/proyectos/:id/tareas` | Crear tarea | Sí |
| PATCH | `/api/proyectos/:id/tareas/:tareaId` | Modificar tarea | Sí |
| DELETE | `/api/proyectos/:id/tareas/:tareaId` | Eliminar tarea (solo ADMIN) | Sí |

--

## Roles de usuario

| Rol | Descripción |
|---|---|
| `admin` | Acceso completo. Puede dar de baja proyectos, clientes y eliminar tareas. |
| `usuario` | Acceso estándar. Puede crear y modificar, pero no dar de baja ni eliminar. |

---

## Funcionalidades adicionales implementadas

- **Historial de cambios** — cada modificación queda registrada con usuario y fecha
- **Roles** — `admin` y `usuario` con restricciones en operaciones sensibles
- **Búsqueda avanzada** — filtros por nombre, estado y cliente con paginación y ordenamiento
- **Exportación CSV** — descarga de proyectos y clientes en formato CSV
- **Estadísticas** — métricas de proyectos, tareas y clientes
- **Fecha de finalización** — cada proyecto puede tener fecha objetivo con indicador de retraso
- **Contactos de clientes** — teléfonos y emails asociados a cada cliente
- **Metas intermedias** — hitos dentro de un proyecto con tareas asociadas

---

## Scripts disponibles

```bash
npm run start:dev      # Desarrollo con hot reload
npm run build          # Compilar para producción
npm run start:prod     # Correr versión compilada
npm run compodoc       # Documentación del código en http://localhost:8080
npm run compodoc:build # Generar documentación estática
```
