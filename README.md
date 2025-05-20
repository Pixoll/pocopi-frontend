# PoCoPI

Proof of Concept of Psycho-Informatics

## Requirements

- Node.js >= `22.0.0`
- pnpm >= `10.8.0`. Install with `npm install -g pnpm`.

Install dependencies with:

```bash
pnpm install
```

## Project structure

```yaml
PoCoPI/
├─ config/
│  ├─ config.yaml           # PoCoPI's configuration file
│  ├─ README.md             # document explaining the structure of the config file
│  └─ images/               # directory with all the images the config references
├─ packages/
│  └─ config/               # package that processes PoCoPI's configuration files
└─ apps/
.  ├─ frontend/             # Web app built with React and Vite
.  │  └─ src/
.  │     ├─ App.tsx         # app's root component
.  │     ├─ main.tsx        # React app entry point
.  │     ├─ assets/         # images, iconos, logos, etc.
.  │     ├─ config/         # configuration files like .env
.  │     ├─ components/     # buttons, cards, modals, etc.
.  │     ├─ contexts/       # global contexts
.  │     ├─ hooks/          # custom hooks
.  │     ├─ pages/          # home, dashboard, tests, etc.
.  │     ├─ services/       # handle HTTP requests
.  │     ├─ types/          # TypeScript types
.  │     └─ utils/          # auxiliary functions, helpers, formatters, etc.
.  │
.  └─ backend/              # API build with Nest.js
.     └─ src/
.        ├─ main.ts         # Nest.js entry point
.        ├─ app.module.ts   # API's root module
.        ├─ exceptions/     # exceptions factory and structure
.        ├─ filters/        # custom exception filters
.        ├─ interceptors/   # custom logging, AOP, etc.
.        ├─ modules/        # API modules like time-log, dashboard, users, etc.
.        └─ pipes/          # custom transformers and validators
```

## Configuration

### Main PoCoPI configuration

Go to [PoCoPI Configuration Documentation](config/README.md) to learn how to configure PoCoPI.

### Environment variables

To modify the environment variables for each app, you should modify `apps/frontend/.env` or `apps/backend/.env`, using
both [apps/frontend/.env.example](apps/frontend/.env.example) and [apps/backend/.env.example](apps/backend/.env.example)
as examples respectively.

## Commands

Run the project while watching for live changes (ideal for development environments):

```bash
# run all projects at once
pnpm dev

# run only the frontend
pnpm dev:frontend

# run only the backend
pnpm dev:backend
```

Build the projects for production:

```bash
# build all projects
pnpm build

# build only the frontend
pnpm build:frontend

# build only the backend
pnpm build:backend
```

Run the projects on production:

```bash
# run all projects
pnpm start

# run only the frontend
pnpm start:frontend

# run only the backend
pnpm start:backend
```

Other commands:

```bash
# run all the tests
pnpm test

# run the linter on all projects
pnpm lint

# run the linter automatic formatting rules
pnpm format

# clean the build directories, useful when experiencing cache problems
pnpm clean
```

## Add new dependencies

```bash
# add dependency to frontend
pnpm --filter ./apps/frontend add pkg-name

# add development dependency to backend
pnpm --filter ./apps/backend add -D pkg-name
```

## Contribute

1. Create a new branch from `main`, and use `scope/feature-name` as your branch name, where scope is either `config`,
   `backend` or `frontend`. `feature-name` should be kept as short as possible, and use dashes (`-`) to separate words.

2. Commit your changes using the Conventional Commits naming convention.

3. Once your changes are published to your branch, create a detailed pull request with your changes.
