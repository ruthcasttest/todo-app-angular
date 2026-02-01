# Task Manager - Implementación Frontend Angular 17

## Resumen

Aplicación de gestión de tareas implementada con Angular 17 siguiendo arquitectura hexagonal y principios SOLID.

## Arquitectura Implementada

### Estructura de Carpetas

```
src/app/
├── core/                              # Servicios singleton
│   ├── guards/
│   │   └── auth.guard.ts              # authGuard y noAuthGuard
│   ├── interceptors/
│   │   ├── http-error.interceptor.ts  # Manejo global de errores HTTP
│   │   └── auth.interceptor.ts        # Headers de autenticación
│   └── services/
│       └── storage.service.ts         # Abstracción de localStorage
│
├── shared/                            # Componentes compartidos
│   └── components/
│       ├── confirm-dialog/            # Diálogo de confirmación genérico
│       └── header/                    # Header con logout
│
├── features/
│   ├── auth/                          # Feature de autenticación
│   │   ├── domain/
│   │   │   ├── models/user.model.ts
│   │   │   └── ports/user.repository.port.ts
│   │   ├── application/
│   │   │   ├── services/auth.service.ts
│   │   │   └── state/auth.state.ts
│   │   ├── infrastructure/
│   │   │   └── adapters/user-api.repository.ts
│   │   └── ui/
│   │       ├── pages/login/
│   │       └── components/create-user-dialog/
│   │
│   └── tasks/                         # Feature de tareas
│       ├── domain/
│       │   ├── models/task.model.ts
│       │   └── ports/task.repository.port.ts
│       ├── application/
│       │   ├── services/task.service.ts
│       │   └── state/tasks.state.ts
│       ├── infrastructure/
│       │   └── adapters/task-api.repository.ts
│       └── ui/
│           ├── pages/tasks-page/
│           └── components/
│               ├── task-form/
│               ├── task-list/
│               ├── task-item/
│               └── task-edit-dialog/
│
└── environments/
    ├── environment.ts
    └── environment.prod.ts
```

## Tecnologías y Patrones

### Principales Características

- ✅ **Angular 17** con standalone components
- ✅ **Arquitectura Hexagonal** (Domain, Application, Infrastructure, UI)
- ✅ **Signal-based State Management** (sin NgRx)
- ✅ **Repository Pattern** con dependency injection
- ✅ **Guards** para protección de rutas
- ✅ **HTTP Interceptors** para autenticación y manejo de errores
- ✅ **Reactive Forms** con validaciones
- ✅ **Angular Material** para UI components
- ✅ **Lazy Loading** de componentes
- ✅ **Responsive Design** con SCSS
- ✅ **TypeScript Strict Mode**

### Principios SOLID Aplicados

1. **Single Responsibility**: Cada servicio, componente y clase tiene una única responsabilidad
2. **Open/Closed**: Uso de abstract classes (ports) permite extensión sin modificación
3. **Liskov Substitution**: Los adapters implementan los ports correctamente
4. **Interface Segregation**: Interfaces específicas por dominio
5. **Dependency Inversion**: Dependencia en abstracciones (ports) no en implementaciones

## Componentes Principales

### Auth Feature

- **LoginComponent**: Formulario de login con validación de email
- **CreateUserDialogComponent**: Diálogo para confirmar creación de usuario
- **AuthService**: Lógica de negocio de autenticación
- **AuthState**: Estado reactivo con signals
- **UserApiRepository**: Adaptador HTTP para usuarios

### Tasks Feature

- **TasksPageComponent**: Página principal con lista de tareas
- **TaskFormComponent**: Formulario para agregar tareas
- **TaskListComponent**: Lista de tareas con filtro por pendientes
- **TaskItemComponent**: Card individual de tarea con acciones
- **TaskEditDialogComponent**: Diálogo para editar tareas
- **TaskService**: Lógica de negocio de tareas
- **TasksState**: Estado reactivo con computed signals
- **TaskApiRepository**: Adaptador HTTP para tareas

### Shared Components

- **HeaderComponent**: Toolbar con email de usuario y logout
- **ConfirmDialogComponent**: Diálogo reutilizable de confirmación

## Rutas

| Path | Componente | Guard | Descripción |
|------|------------|-------|-------------|
| `/` | - | - | Redirect a `/login` |
| `/login` | LoginComponent | noAuthGuard | Página de login |
| `/tasks` | TasksPageComponent | authGuard | Página principal de tareas |
| `**` | - | - | Redirect a `/login` |

## Estado de la Aplicación

### AuthState (Signal-based)

```typescript
- currentUser: Signal<User | null>
- isLoading: Signal<boolean>
- isAuthenticated: ComputedSignal<boolean>
- userEmail: ComputedSignal<string>
- userId: ComputedSignal<string | null>
```

### TasksState (Signal-based)

```typescript
- tasks: Signal<Task[]>
- isLoading: Signal<boolean>
- pendingTasks: ComputedSignal<Task[]> // Ordenadas por fecha
- completedTasks: ComputedSignal<Task[]>
- taskCount: ComputedSignal<number>
```

## API Endpoints Esperados

### Users

- `GET /api/users/check?email=xxx` - Verificar si usuario existe
- `POST /api/users` - Crear nuevo usuario

### Tasks

- `GET /api/tasks?userId=xxx` - Obtener tareas del usuario
- `POST /api/tasks` - Crear nueva tarea
- `PUT /api/tasks/:id` - Actualizar tarea
- `DELETE /api/tasks/:id` - Eliminar tarea

## Configuración

### Environment

```typescript
// src/environments/environment.ts
export const environment = {
    production: false,
    apiUrl: "http://localhost:3000/api"
};
```

### App Config

Los interceptors y repositories están configurados en [app.config.ts](src/app/app.config.ts):

```typescript
- HttpClient con interceptors
- authInterceptor: Agrega headers de usuario
- httpErrorInterceptor: Muestra errores con snackbar
- Dependency Injection de repositories
```

## Estilos y Responsividad

- **Mobile-first approach**
- Breakpoints: xs(0), sm(576px), md(768px), lg(992px), xl(1200px)
- Mixin `respond-to()` para media queries
- Login: Card centrada, full-width en mobile
- Tasks: Lista vertical, cards con sombra
- Angular Material theme customizado (orange/blue)

## Comandos

```bash
# Desarrollo
npm start

# Build
npm run build

# Lint
npm run lint

# Tests
npm test
```

## Notas Importantes

### Versión de Node.js

⚠️ **Requisito**: Node.js >= v18.13.0

La versión actual (v18.12.0) es ligeramente inferior a la requerida por Angular CLI 17. Actualizar Node.js a v18.13+ o superior.

### Cambiar URL del API

Editar [src/environments/environment.ts](src/environments/environment.ts) y actualizar `apiUrl` con la URL real del backend.

### Persistencia de Sesión

El usuario se guarda en `localStorage` para mantener la sesión entre recargas de página.

## Mejoras Futuras

- Agregar tests unitarios e integración
- Implementar paginación en lista de tareas
- Agregar filtros y búsqueda
- Categorías de tareas
- Fechas de vencimiento
- Prioridades
- CI/CD pipeline

## Autor

Implementado siguiendo el challenge técnico Fullstack Developer.
