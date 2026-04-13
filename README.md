# PoCoPI frontend

Proof of Concept of Psycho-Informatics

## Requirements

- Node.js >= `22.0.0`

Install dependencies with:

```bash
npm install
```

## Project structure

```yaml
pocopi-frontend/
├─ config/            # old infrastructure configuration
└─ src/
.  ├─ api/            # HTTP client used for API calls
.  ├─ assets/         # images, iconos, logos, etc.
.  ├─ components/     # buttons, cards, modals, etc.
.  ├─ contexts/       # global contexts
.  ├─ hooks/          # custom hooks
.  ├─ pages/          # home, dashboard, tests, etc.
.  ├─ styles/         # CSS files
.  ├─ utils/          # auxiliary functions, helpers, formatters, etc.
.  ├─ App.tsx         # app's root component
.  └─ main.tsx        # React app entry point
```

## Configuration

Copy the corresponding `.env.example` file, rename it to `.env`, and fill it with the proper values for your
environment.

## Commands

Run the project while watching for live changes (ideal for development environments):

```bash
npm dev
```

Build the app for production:

```bash
npm build
```

Other commands:

```bash
# run the linter on all files
npm lint

# run the linter automatic fixes where possible
npm lint:fix

# clean the build directories, useful when experiencing cache problems
npm clean
```

## Contribute

1. Create a new branch from `main`, and use `scope/name` as your branch name, where scope should be `feat`, `fix` or
   something like that. `name` should be kept as short as possible, and use dashes (`-`) to separate words.

2. Commit your changes using the Conventional Commits naming convention.

3. Once your changes are published to your branch, create a detailed pull request with your changes.
