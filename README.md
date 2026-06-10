# Laboratorio de Validación de Formularios

> Segundo Proyecto Integrador — IntegrarTEC (Junio 2026)

## Idea Elegida

**Idea 17: Laboratorio de Validación de Formularios**

Herramienta para armar formularios con reglas de validación combinables y ver cómo responden en tiempo real. Ideal para entender validación a fondo en React.

## Integrantes del Grupo

- **Integrante 1 (D1 — Base):** [Tu nombre] — Scaffold, creación dinámica de campos, store global
- Integrante 2 (D2 — Motor de reglas):* [Nombre] — Reglas combinables (requerido, min, max, email, regex)
- Integrante 3 (D3 — Mensajes de error):* [Nombre] — Mensajes personalizados según la regla que falla
- Integrante 4 (D4 — Validación en tiempo real):* [Nombre] — Validación en vivo, estado por campo, resumen de errores
- Integrante 5 (D5 — Galería de formularios):* [Nombre] — Formularios prearmados (login, signup, checkout)

\* *Completar con los nombres reales del equipo.*

## Tecnologías Utilizadas

- **React 19** (con React Compiler)
- **TypeScript** (strict mode)
- **Vite** (bundler + dev server)
- **React Router v7** (routing SPA)
- **Zustand v5** + `persist` (estado global con persistencia)
- **Tailwind CSS v4** (estilos)
- **Zod** (motor de validación / fuente única de verdad)
- **React Hook Form** + `@hookform/resolvers` (gestión de formularios)
- **date-fns** (manejo de fechas)
- **@dnd-kit** (drag & drop)
- **lucide-react** (íconos)
- **clsx** + **tailwind-merge** (clases condicionales)

## Funcionalidades Principales

- Crear formularios dinámicos con campos configurables (label, tipo, placeholder)
- Agregar, editar y eliminar campos de un formulario
- Persistencia de formularios en localStorage (vía Zustand persist)
- Motor de reglas de validación combinables por campo
- Validación en tiempo real con estados visuales (válido, inválido, pendiente)
- Mensajes de error personalizados por regla
- Galería de formularios prearmados (login, registro, checkout)
- UI con HTML semántico y accesibilidad básica

## Estructura del Proyecto

```
src/
  app/
    router.tsx              # Configuración de rutas (React Router v7)
    providers.tsx           # Providers globales
  features/
    form-lab/               # Dominio: Laboratorio de formularios
      components/           # UI del feature
      hooks/                # Hooks reutilizables del feature
      store.ts              # Estado global con Zustand + persist
      schema.ts             # Esquemas Zod (fuente única de verdad)
      utils.ts              # Lógica pura (cálculos, formato, helpers)
      types.ts              # Tipos/interfaces del feature
  shared/
    components/ui/          # Primitivas genéricas (Button, Input, Card)
    hooks/                  # Hooks transversales
    lib/                    # Helpers genéricos
  main.tsx                  # Punto de entrada
  index.css                 # Tailwind CSS + tokens @theme
```

## Instrucciones de Uso

```bash
# Instalar dependencias
pnpm install

# Servidor de desarrollo
pnpm run dev

# Build de producción
pnpm run build

# Preview del build
pnpm run preview

# Lint
pnpm run lint
```

## Deploy

- **Deploy funcional:** [Link a Vercel/Netlify/GitHub Pages]
- **Repositorio:** [Link al repo de GitHub]

## Desafíos (D1–D5)

| Desafío | Responsable | Descripción | Dependencias |
|---------|-------------|-------------|--------------|
| D1 | Integrante 1 | Scaffold + creación dinámica de campos + store global | — |
| D2 | Integrante 2 | Motor de reglas combinables por campo | D1 |
| D3 | Integrante 3 | Mensajes de error personalizados según la regla que falla | D2 |
| D4 | Integrante 4 | Validación en tiempo real + estado por campo + resumen de errores | D2 |
| D5 | Integrante 5 | Galería de formularios prearmados (login, signup, checkout) | D1 |

## Notas para el equipo

- **D1 desbloquea a D2, D3, D4 y D5.** El integrante 1 debe levantar la base primero.
- **D2 define el tipo `Rule`**, que consumen I3 (D3) e I4 (D4). Acordar la interfaz antes de empezar.
- **D5 es paralelo a D2–D4** (solo depende de D1), así que I5 puede trabajar en su rama desde el inicio.
- Una rama por desafío (`feat/d1-base`, `feat/d2-rules`, etc.).
- Commits con **Conventional Commits** (`feat:`, `fix:`, `refactor:`, `docs:`).
- PRs chicos y frecuentes; evitar que todos toquen el mismo archivo.
