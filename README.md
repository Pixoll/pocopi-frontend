# PoCoPI

Proof of Concept of Psycho-Informatics

## 📋 Requisitos previos

- Node.js >= 20.0.0
- PNPM >= 8.0.0

Para instalar PNPM:

```bash
npm install -g pnpm
```

## 🚀 Primeros pasos

### Clonar el repositorio

```bash
git clone https://github.com/Pixoll/PoCoPI.git
cd mi-monorepo
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
    │   ├── src/
    │   └── ... otros archivos
    └── backend/                # API con Node.js/Express/TypeScript
        ├── package.json
        ├── src/
        └── ... otros archivos
```

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

```
PORT=3000
NODE_ENV=development
```

## 🧩 Añadir nuevos paquetes

Para añadir dependencias a un proyecto específico:

```bash
# Añadir una dependencia al frontend
pnpm --filter @pocopi/frontend add nombre-del-paquete

# Añadir una dependencia de desarrollo al backend
pnpm --filter @pocopi/backend add -D nombre-del-paquete
```

## 🤝 Contribuir al proyecto

1. Crea una nueva rama desde `main`:

   ```bash
   git checkout -b feature/nombre-caracteristica
   ```

2. Realiza tus cambios y haz commit:

   ```bash
   git commit -m "Descripción de los cambios"
   ```

3. Envía tu rama al repositorio:

   ```bash
   git push origin feature/nombre-caracteristica
   ```

4. Abre un Pull Request en GitHub.

## ⚠️ Solución de problemas comunes

```

## 📝 Notas adicionales

- Este monorepo utiliza pnpm workspaces para gestionar múltiples paquetes
- El frontend está construido con Vite para un desarrollo más rápido
- El backend utiliza pkgroll para la compilación
- Todas las aplicaciones usan TypeScript para type-safety

```
