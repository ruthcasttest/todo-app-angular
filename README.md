# ATOM FE CHALLENGE TEMPLATE - ANGULAR

Este proyecto es una plantilla con lo necesario para comenzar a desarrollar el front-end de la aplicación de la prueba técnica de Atom. Se base en Angular con la versión 17.3.6.
Se ha realizado la instalación y configuración de varias dependencias necesarias para el desarrollo de la aplicación, como por ejemplo: Angular Material.

## Instrucciones
Siéntete libre de clonar este repositorio y utilizarlo como base para el desarrollo de la aplicación. Sigue las indicates de la prueba técnica para completar la aplicación y desarrolla como más te sientas cómodo.

De igual manera puedes documentar dentro de este archivo todo lo que deseas contar sobre tu desarrollo, como por ejemplo, decisiones de diseño, problemas encontrados, etc.

## Comentarios sobre el desarrollo

### Arquitectura del Proyecto

Se implementó una **Arquitectura Limpia por Features** que permite una clara separación de responsabilidades y facilita el mantenimiento y escalabilidad del código.

```
src/app/
├── core/                    # Servicios globales, guards e interceptors
│   ├── guards/              # AuthGuard para protección de rutas
│   ├── interceptors/        # HTTP interceptors (auth, error handling)
│   └── services/            # Servicios compartidos (storage, etc.)
│
├── features/                # Módulos de funcionalidad
│   ├── auth/                # Feature de autenticación
│   │   ├── application/     # Servicios y estado
│   │   ├── domain/          # Modelos e interfaces
│   │   ├── infrastructure/  # Adapters (API)
│   │   └── ui/              # Componentes y páginas
│   │
│   └── tasks/               # Feature de tareas
│       ├── application/     # TaskService, TasksState
│       ├── domain/          # Task model, ports
│       ├── infrastructure/  # TaskApiAdapter
│       └── ui/              # Componentes y páginas
│
└── shared/                  # Componentes reutilizables
    └── components/          # ConfirmDialog, Header, etc.
```

### Decisiones Técnicas

#### 1. Gestión de Estado con Signals
Se utilizaron **Angular Signals** (introducidos en Angular 16+) para la gestión del estado reactivo:
- `TasksState`: Maneja el estado de las tareas con signals (`tasks`, `isLoading`, `error`)
- Computed signals para datos derivados (`pendingTasks`, `completedTasks`, `taskCount`)
- Beneficios: mejor rendimiento, código más limpio y detección de cambios granular

#### 2. Componentes Standalone
Todos los componentes utilizan la API de **standalone components** de Angular 17:
- Eliminación de NgModules innecesarios
- Imports declarativos por componente
- Mejor tree-shaking y tiempos de carga

#### 3. Nueva Sintaxis de Control Flow
Se implementó la nueva sintaxis de control de flujo de Angular 17:
- `@if` / `@else` en lugar de `*ngIf`
- `@for` con `track` en lugar de `*ngFor` con `trackBy`
- Mejor legibilidad y rendimiento

#### 4. Patrón Smart/Dumb Components
- **Smart Components (Pages)**: Manejan la lógica de negocio y comunicación con servicios
- **Dumb Components**: Componentes de presentación puros con `@Input()` y `@Output()`

### Funcionalidades Implementadas

| Funcionalidad | Descripción |
|---------------|-------------|
| Autenticación | Login por email con creación automática de usuario |
| CRUD de Tareas | Crear, editar, eliminar y marcar como completadas |
| Filtros | Búsqueda por título/descripción y filtrado por estado |
| Tabs con Contadores | Visualización de tareas por estado (Todas/Pendientes/Completadas) |
| Confirmación | Diálogos de confirmación para acciones destructivas |
| Skeleton Loading | Indicadores de carga con skeleton placeholders |
| Badge de Estado | Indicador visual del estado de cada tarea |
| Diseño Responsive | Adaptación a diferentes tamaños de pantalla |

### Componentes de UI (Angular Material)

- `MatCard`: Contenedor de tareas
- `MatCheckbox`: Toggle de completado
- `MatChip`: Badge de estado (Pendiente/Completada)
- `MatTabs`: Navegación entre filtros
- `MatDialog`: Diálogos de confirmación y edición
- `MatFormField`: Campos de formulario
- `MatMenu`: Menú de opciones por tarea
- `MatIcon`: Iconografía consistente

### Patrones y Buenas Prácticas

- **SOLID**: Separación de responsabilidades en servicios y componentes
- **DRY**: Reutilización de componentes (ConfirmDialog, Header)
- **Reactive Programming**: Uso de RxJS para operaciones asíncronas
- **Type Safety**: Tipado estricto con TypeScript
- **trackBy**: Optimización de renderizado en listas
- **Lazy Loading**: Carga diferida de rutas por feature

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
# todo-app-angular
