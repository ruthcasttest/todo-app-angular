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

### Pruebas Unitarias

El proyecto incluye una suite completa de pruebas unitarias con **89 tests** que cubren:

| Archivo | Cobertura |
|---------|-----------|
| `TasksState` | Estado reactivo, CRUD de tareas, computed signals |
| `TaskService` | Operaciones CRUD, manejo de errores, estados de carga |
| `TaskListComponent` | Filtrado, búsqueda, interacción con tareas |
| `TaskItemComponent` | Toggle, edición, eliminación, diálogos |
| `LoginComponent` | Validación de formularios, autenticación |

---

## Configuración del Proyecto

### Requisitos Previos

- **Node.js**: v18.19.0 o superior
- **npm**: v10.x o superior
- **Angular CLI**: v17.x

### Instalación

```bash
# Clonar el repositorio
git clone <repository-url>
cd challenge-ruth-reyes-frontend

# Instalar dependencias
npm install
```

### Variables de Entorno

El proyecto utiliza archivos de entorno para configurar la URL del API:

```typescript
// src/environments/environment.ts (desarrollo)
export const environment = {
  production: false,
  apiUrl: 'http://localhost:5001/your-project/us-central1/api'
};

// src/environments/environment.prod.ts (producción)
export const environment = {
  production: true,
  apiUrl: 'https://us-central1-your-project.cloudfunctions.net/api'
};
```

---

## Scripts Disponibles

| Comando | Descripción |
|---------|-------------|
| `npm start` | Inicia servidor de desarrollo en `http://localhost:4200` |
| `npm run build` | Build de producción con optimizaciones |
| `npm test` | Ejecuta pruebas unitarias con Karma |
| `npm run lint` | Ejecuta ESLint para análisis de código |
| `npm run watch` | Build en modo watch para desarrollo |

---

## Build de Producción

### Optimizaciones Incluidas

El build de producción (`npm run build`) incluye las siguientes optimizaciones:

| Optimización | Descripción |
|--------------|-------------|
| **Tree Shaking** | Eliminación automática de código no utilizado |
| **Minificación** | Compresión de JavaScript, CSS y HTML |
| **AOT Compilation** | Compilación Ahead-of-Time para mejor rendimiento |
| **Source Maps** | Deshabilitados en producción para menor tamaño |
| **Output Hashing** | Cache busting con hashes en nombres de archivos |
| **Subresource Integrity** | Verificación de integridad de recursos |
| **License Extraction** | Extracción de licencias a archivo separado |
| **Bundle Budgets** | Alertas si el bundle excede límites definidos |

### Ejecutar Build

```bash
# Build de producción
npm run build

# Build con análisis de bundle (opcional)
npm run build -- --stats-json
```

Los artefactos se generan en `dist/atom-challenge-fe-template/browser/`

---

## CI/CD con GitHub Actions

El proyecto incluye un pipeline de CI/CD configurado en `.github/workflows/ci-cd.yml`:

### Pipeline de Integración Continua

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│    TEST     │────▶│    BUILD    │────▶│   DEPLOY    │
│  - Lint     │     │  - Compile  │     │  - Firebase │
│  - Unit     │     │  - Optimize │     │    Hosting  │
│    Tests    │     │             │     │             │
└─────────────┘     └─────────────┘     └─────────────┘
```

### Flujo del Pipeline

1. **Test**: Se ejecuta en cada push y PR
   - Lint con ESLint
   - Pruebas unitarias con cobertura
   - Genera reporte de cobertura

2. **Build**: Se ejecuta después de tests exitosos
   - Compila aplicación para producción
   - Genera artefactos optimizados

3. **Deploy**: Solo en push a `main`/`master`
   - Despliega automáticamente a Firebase Hosting

### Configuración de Secrets

Para habilitar el despliegue automático, configura los siguientes secrets en GitHub:

1. **FIREBASE_SERVICE_ACCOUNT**: JSON de cuenta de servicio de Firebase
   ```bash
   # Generar cuenta de servicio
   firebase login:ci
   ```

2. Actualiza `projectId` en el workflow con tu ID de proyecto Firebase

---

## Despliegue Manual a Firebase

### Configuración Inicial

```bash
# Instalar Firebase CLI
npm install -g firebase-tools

# Autenticarse
firebase login

# Inicializar proyecto (si no está configurado)
firebase init hosting
```

### Desplegar

```bash
# Build de producción
npm run build

# Desplegar a Firebase Hosting
firebase deploy --only hosting
```

### Configuración de Firebase (`firebase.json`)

```json
{
  "hosting": {
    "public": "dist/atom-challenge-fe-template/browser",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [
      { "source": "/api/**", "function": "api" },
      { "source": "**", "destination": "/index.html" }
    ]
  }
}
```

---

## Estructura de Archivos Clave

```
├── .github/
│   └── workflows/
│       └── ci-cd.yml          # Pipeline CI/CD
├── src/
│   ├── environments/
│   │   ├── environment.ts     # Config desarrollo
│   │   └── environment.prod.ts # Config producción
│   └── app/
│       ├── features/          # Módulos por feature
│       ├── core/              # Servicios globales
│       └── shared/            # Componentes compartidos
├── angular.json               # Config Angular con optimizaciones
├── firebase.json              # Config Firebase Hosting
└── package.json               # Scripts y dependencias
```

---

## Tecnologías Utilizadas

| Categoría | Tecnología |
|-----------|------------|
| Framework | Angular 17.3.6 |
| UI Library | Angular Material |
| State | Angular Signals |
| HTTP | HttpClient + RxJS |
| Testing | Karma + Jasmine |
| Linting | ESLint |
| CI/CD | GitHub Actions |
| Hosting | Firebase Hosting |
| Backend | Firebase Cloud Functions |
| Database | Firebase Firestore |
