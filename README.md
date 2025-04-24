# PoCoPI

Proof of Concept of Psycho-Informatics

## 📋 Requisitos previos

- Node.js >= 22.0.0
- PNPM >= 8.0.0

Para instalar PNPM:

```bash
npm install -g pnpm
```

## 🚀 Primeros pasos

### Clonar el repositorio

```bash
git clone https://github.com/Pixoll/PoCoPI.git
cd PoCoPI
```

### Instalar dependencias

```bash
pnpm install
```

Este comando instalará todas las dependencias para todos los proyectos en el monorepo.

## 📦 Estructura del proyecto

```
mi-monorepo/
├── package.json                # Configuración principal del monorepo
├── pnpm-workspace.yaml         # Configuración de PNPM Workspaces
└── apps/
    ├── frontend/               # Aplicación React/TypeScript con Vite
    │   ├── index.html
    │   ├── package.json
    │   ├── tsconfig.json
    │   ├── vite.config.ts
    │   └── src/
    │       ├── App.tsx                 # Componente raíz de la aplicación
    │       ├── main.tsx                # Punto de entrada que renderiza App.tsx
    │       ├── index.css               # Estilos globales
    │       ├── assets/                 # Imágenes, íconos, logos, etc.
    │       ├── components/             # Componentes reutilizables (ej: botones, cards)
    │       ├── pages/                  # Vistas principales (ej: Home, Dashboard)
    │       ├── contexts/               # Contextos globales usando React Context API
    │       │   └── AuthContext.tsx     # Ejemplo: manejo de autenticación global
    │       ├── hooks/                  # Hooks personalizados (ej: useFetch, useAuth)
    │       ├── routes/                 # Definición de rutas de la app (React Router)
    │       ├── services/               # Lógica para llamadas HTTP a APIs (ej: authService, userService)
    │       ├── types/                  # Archivos de definición de tipos TypeScript
    │       └── utils/                  # Funciones auxiliares, helpers, formatters
    └── backend/                # API con Node.js/Express/TypeScript
        ├── package.json
        ├── tsconfig.json
        └── src/
```

### 🧭 Flujo de datos en el frontend

- **`main.tsx`**: es el archivo donde se monta la aplicación React usando `ReactDOM.createRoot`. Aquí también se pueden envolver los componentes globales, como `AuthProvider` o `BrowserRouter`.

- **`App.tsx`**: define la estructura principal de la aplicación, donde se incluyen las rutas (`<Routes>`) y componentes base.

- **`contexts/`**: contiene estados compartidos globalmente, como la sesión de usuario, tema o configuraciones generales.

- **`pages/`**: contiene las pantallas o páginas de la aplicación que se renderizan desde las rutas, como el Home, Login o Dashboard.

- **`components/`**: aquí se almacenan componentes reutilizables, como botones personalizados, inputs, modales, etc.

- **`hooks/`**: almacena lógica reutilizable en forma de hooks personalizados (`useAuth`, `useTheme`, `useFetch`, etc).

- **`routes/`**: configura las rutas de la app (React Router), conectando componentes con URLs específicas.
- `services/`: Contiene módulos responsables de conectarse con el backend o servicios externos. Aquí se define la lógica para obtener, enviar y actualizar datos a través de HTTP. Ejemplos: `authService.ts`, `userService.ts`, `productionService.ts`, etc.

- **`types/`**: aquí defines tipos TypeScript comunes que se usan en múltiples archivos, como interfaces para usuarios, datos de API, etc.

- **`utils/`**: contiene funciones auxiliares como `formatearFecha`, `validarEmail`, etc.

---

## 💻 Comandos disponibles

### Desarrollo

Para ejecutar ambos proyectos en modo desarrollo:

```bash
pnpm dev
```

Para ejecutar solo el frontend:

```bash
pnpm dev:frontend
```

Para ejecutar solo el backend:

```bash
pnpm dev:backend
```

### Construcción

Para construir ambos proyectos:

```bash
pnpm build
```

Para construir proyectos individualmente:

```bash
# Frontend
pnpm build:frontend

# Backend
pnpm build:backend
```

### Inicio en producción

Para iniciar el backend en modo producción (después de construirlo):

```bash
pnpm start:backend
```

### Lint

Para ejecutar el linter en todos los proyectos:

```bash
pnpm lint
```

## 🔗 Conexión entre proyectos

- El frontend se ejecuta en: http://localhost:5173
- El backend se ejecuta en: http://localhost:3000
- El frontend está configurado para hacer peticiones a la API mediante proxy a `/api/*`

## 🔧 Configuración del entorno

### Variables de entorno

#### Backend (.env)

```env
PORT=3000
NODE_ENV=development
```

## 🧩 Añadir nuevos paquetes

Para añadir dependencias a un proyecto específico:

```bash
# Añadir una dependencia al frontend
pnpm --filter ./apps/frontend add nombre-del-paquete

# Añadir una dependencia de desarrollo al backend
pnpm --filter ./apps/backend add -D nombre-del-paquete
```

## 🤝 Contribuir al proyecto

1. Crea una nueva rama desde `main`:

   ```bash
   git switch -c feature/nombre-caracteristica
   ```

2. Realiza tus cambios y haz commit:

   ```bash
   git commit -m "Descripción de los cambios"
   ```

3. Envía tu rama al repositorio:

   ```bash
   git push origin feature/nombre-caracteristica
   ```

## 📝 Notas adicionales

- Este monorepo utiliza pnpm workspaces para gestionar múltiples paquetes
- El frontend está construido con Vite para un desarrollo más rápido
- Todas las aplicaciones usan TypeScript para type-safety
