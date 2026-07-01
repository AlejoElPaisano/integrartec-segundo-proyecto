# FormLab — Laboratorio de Validación de Formularios

> Segundo Proyecto Integrador — IntegrarTEC (Junio 2026)

**Identidad visual:** Lab Nocturno — modo oscuro por defecto, acento cyan reactor (`#06b6d4`), tipografía Space Grotesk + JetBrains Mono, voz rioplatense.

## Idea Elegida

**Idea 17: Laboratorio de Validación de Formularios**

Herramienta para armar formularios con reglas de validación combinables y ver cómo responden en tiempo real. Ideal para entender validación a fondo en React.

## Demo

- **Deploy:** [Pendiente — se configurará antes de la entrega final]
- **Repositorio:** https://github.com/AlejoElPaisano/integrartec-segundo-proyecto

## Integrantes del Grupo

| Integrante | Desafío | Responsabilidad | Email |
|-----------|---------|----------------|-------|
| **Alejo Martínez** | D1 — Base | Scaffold, creación dinámica de campos, store global, layout | alemartinez523123@gmail.com |
| **Luis Ángel Calegari** | D2 — Motor de reglas + D3 — Mensajes | Reglas combinables (requerido, min, max, email, regex) + mensajes personalizados | lcalegari97@gmail.com |
| **Luis Ángel Calegari** | D3 — Mensajes de error | Refinamiento de mensajes según la regla que falla | lcalegari97@gmail.com |
| **Luis Ángel Calegari** | D4 — Validación en tiempo real | Validación en vivo + estado por campo + resumen de errores | lcalegari97@gmail.com |
| **Claudio Emmanuel Britez** | D5 — Galería de formularios | Galería con 20 plantillas prearmadas | britez.claudio97@gmail.com |

> **Nota:** Los D2/D3/D4 fueron implementados en la misma rama por Luis Calegari (ver historial de commits).

## Tecnologías Utilizadas

- **React 19** + **React Compiler** (`babel-plugin-react-compiler`)
- **TypeScript** (strict mode + `noUnusedLocals` + `noUnusedParameters`)
- **Vite 6** (bundler + dev server)
- **React Router v7** (routing SPA, con `lazy` + `Suspense`)
- **Zustand v5** + `persist` (estado global con persistencia en localStorage)
- **Tailwind CSS v4** (estilos con `@theme` en CSS, sin `tailwind.config.js`)
- **Zod 4** (motor de validación + fuente única de verdad de tipos)
- **React Hook Form** + `@hookform/resolvers` (gestión de formularios)
- **date-fns v4** (manejo de fechas, tree-shakeable)
- **@dnd-kit** (drag & drop con soporte de teclado)
- **lucide-react** (íconos)
- **clsx** + **tailwind-merge** (composición de clases condicionales)
- **ESLint 9** (flat config) + **Vitest** (testing)

## Funcionalidades Principales

- Crear formularios dinámicos con campos configurables (label, tipo, placeholder)
- Agregar, editar, reordenar (drag & drop con teclado) y eliminar campos de un formulario
- Persistencia de formularios en localStorage (vía Zustand persist)
- Motor de reglas de validación combinables por campo (requerido, min, max, email, regex)
- Formularios construidos con **React Hook Form + Zod** (schema dinámico a partir de `rules[]`)
- Mensajes de error personalizados por regla
- **Galería con 20 formularios prearmados**: login, signup, checkout, contact, satisfaction, appointment, event-registration, quote-request, job-application, newsletter-subscription, hotel-reservation, course-enrollment, technical-support, claim-warranty, donation, patient-registration, medical-appointment, product-review, service-review, scholarship-application
- Personalización visual completa: colores, tipografías, bordes, sombras, fondos (color/gradiente/imagen), imágenes, emojis, animaciones
- Vista previa en vivo del tema aplicado
- Página "Mis formularios" para buscar, ordenar, etiquetar y gestionar formularios guardados
- Importar/Exportar formularios como JSON
- Compartir formularios por enlace (base64 en query string)
- Atajos de teclado (Ctrl+Z deshacer, Ctrl+S guardar, Ctrl+K paleta de comandos)
- Onboarding tour para usuarios nuevos
- Toasts de feedback
- Tema claro/oscuro/sistema
- UI con HTML semántico, ARIA labels, navegación por teclado, skip-to-content

## Estructura del Proyecto

```
src/
  app/
    router.tsx              # Configuración de rutas (React Router v7, lazy + Suspense)
    providers.tsx           # Providers globales (AppProviders + ErrorBoundary + ToastContainer)
    layout.tsx              # Layout con header, nav, main, footer
  features/
    form-lab/               # Dominio: Laboratorio de formularios
      components/           # UI del feature (HomePage, FormBuilder, FormPreview, MyForms, TemplateGallery, modals)
      hooks/                # useFormLab, useRuleEngine, useHistory
      store.ts              # Estado global con Zustand + persist
      schema.ts             # Esquemas Zod (fuente única de verdad)
      utils.ts              # Lógica pura: motor de reglas, buildFormSchema, helpers
      templates.ts          # Catálogo y creación de formularios desde plantillas
      dom-helpers.ts        # Helpers con side effects DOM (downloadTextFile)
    form-theme/             # Dominio: Personalización visual de formularios
      components/           # UI del feature (ThemeDrawer, preview, pickers)
      hooks/                # useFormTheme
      store.ts              # Estado del tema con Zustand + persist
      schema.ts             # Re-exporta el schema compartido del tema
      utils.ts              # Helpers de tema, presets, mappers visuales
      dom-helpers.ts        # applyThemeToCssVars, clearThemeCssVars
      presets/              # Presets de tema predefinidos
    settings/               # Dominio: Configuración de usuario (tema claro/oscuro)
    notifications/          # Dominio: Sistema de toasts
    command-palette/        # Dominio: Paleta de comandos (Ctrl+K)
    onboarding/             # Dominio: Tour guiado de la app
    error-pages/            # Dominio: 404 + ErrorBoundary fallback
  shared/
    components/ui/          # Primitivas genéricas (Button, Input, Card, Modal, ErrorBoundary, EmptyState)
    hooks/                  # Hooks transversales (useConfirmDialog, useKeyboardShortcut, useToast)
    lib/                    # Helpers genéricos (cn, storage)
  main.tsx                  # Punto de entrada
  index.css                 # Tailwind CSS v4 + tokens @theme + clases .form-*
```

> **Nota sobre tipos:** no hay `types.ts` en los features. Los tipos se derivan automáticamente del schema Zod via `z.infer<typeof schema>` (regla de la skill §9). El schema del tema (`FormTheme`) vive en `src/features/form-theme/schema.ts` y `form-lab` lo importa de ahí cuando necesita tipar el campo `theme` del formulario.

## Plantillas Incluidas

La galería ofrece **20 puntos de partida editables**:

| # | Plantilla | Categoría | Complejidad |
|---|-----------|-----------|-------------|
| 1 | Login | cuentas | simple |
| 2 | Registro de usuario | cuentas | intermedia |
| 3 | Checkout | comercio | avanzada |
| 4 | Formulario de contacto | servicios | intermedia |
| 5 | Encuesta de satisfacción | feedback | simple |
| 6 | Reserva de turno | reservas | intermedia |
| 7 | Inscripción a evento | servicios | avanzada |
| 8 | Pedido de presupuesto | servicios | avanzada |
| 9 | Solicitud de empleo | recursos-humanos | avanzada |
| 10 | Suscripción a newsletter | cuentas | simple |
| 11 | Reserva de hotel | reservas | avanzada |
| 12 | Inscripción a curso | educacion | intermedia |
| 13 | Solicitud de soporte técnico | soporte | intermedia |
| 14 | Reclamo o garantía | soporte | intermedia |
| 15 | Donación | servicios | intermedia |
| 16 | Registro de paciente | salud | avanzada |
| 17 | Pedido de turno médico | salud | intermedia |
| 18 | Evaluación de producto | feedback | intermedia |
| 19 | Evaluación de servicio | feedback | intermedia |
| 20 | Solicitud de beca | educacion | avanzada |

Cada plantilla declara sus validaciones mediante el contrato `FieldRule` de
`schema.ts` (tipos: `required`, `min`, `max`, `email`, `regex`). D5 conserva esas
reglas al crear el formulario; la ejecución en la vista previa usa el motor de D2
vía `buildFormSchema()` + Zod + React Hook Form.

## Instrucciones de Uso

```bash
# Instalar dependencias
pnpm install

# Servidor de desarrollo (http://localhost:5173)
pnpm run dev

# Build de producción (TypeScript check + Vite build)
pnpm run build

# Type check standalone
pnpm run typecheck

# Preview del build de producción
pnpm run preview

# Tests (Vitest, 121 tests en 4 archivos)
pnpm test

# Tests en modo UI
pnpm test:ui

# Lint (ESLint 9 flat config)
pnpm run lint
```

### Stack y configuración

- **Alias de import:** `@/*` → `src/*` (configurado en `vite.config.ts` y `tsconfig.app.json`)
- **React Compiler:** activado vía `babel-plugin-react-compiler` en `vite.config.ts`
- **Tailwind v4:** configurado con `@tailwindcss/vite`, sin `tailwind.config.js`; tokens en `src/index.css` con `@theme`

## Deploy

- **Deploy funcional:** [Pendiente — se configurará antes de la entrega final]
- **Repositorio:** https://github.com/AlejoElPaisano/integrartec-segundo-proyecto

> **Importante para SPA:** Al desplegar, configurar redirección SPA para que las rutas de React Router funcionen al recargar. En Vercel, agregar `vercel.json` con `rewrites`; en Netlify, un `public/_redirects` con `/* /index.html 200`.

## Cómo Contribuir (para el equipo)

### Convención de ramas

```
feat/d1-polish    # Mejoras de D1 (I1)
feat/d2-rules     # Motor de reglas (I2)
feat/d3-messages  # Mensajes de error (I3)
feat/d4-realtime  # Validación en tiempo real (I4)
feat/d5-gallery   # Galería de formularios (I5)
```

### Convención de commits

Usar [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` — nueva funcionalidad
- `fix:` — corrección de bug
- `refactor:` — refactorización sin cambiar comportamiento
- `docs:` — documentación
- `chore:` — tareas de mantenimiento
- `test:` — tests

**Ejemplo:** `feat(d2): add regex rule validation engine`

> **Tip:** Al integrar PRs a `develop`, usar **squash-merge** para mantener el historial limpio y evitar commits de merge que no siguen Conventional Commits.

### Contratos públicos

Los tipos compartidos entre integrantes están en `src/features/form-lab/schema.ts`:

- `FieldRule` — tipo de una regla de validación
- `FormField` — campo de formulario con su `rules[]`
- `FieldType` — tipos de input (`text`, `email`, `number`, `password`, `textarea`, `date`)

El schema del tema (`FormTheme`) vive en `src/features/form-theme/schema.ts` porque es el dominio de ese feature; `form-lab` lo importa para tipar el campo `theme` del formulario.

**Regla:** no redefinir estos tipos en tu propio archivo. Importalos desde los schemas oficiales.

### Antes de empezar tu desafío

1. Crear tu rama desde `develop`: `git checkout -b feat/dX-tu-desafio`
2. Asegurarte de que `pnpm run lint` y `pnpm run typecheck` pasen limpios antes de commitear
3. Hacer PRs chicos y frecuentes; evitar tocar archivos de otros desafíos

## Desafíos (D1–D5)

| Desafío | Responsable | Descripción | Dependencias | Estado |
|---------|-------------|-------------|--------------|--------|
| D1 | Alejo Martínez | Scaffold + creación dinámica de campos + store global | — | ✅ Completo |
| D2 | Luis Calegari | Motor de reglas combinables por campo | D1 | ✅ Completo |
| D3 | Luis Calegari | Mensajes de error personalizados según la regla que falla | D2 | ✅ Completo |
| D4 | Luis Calegari | Validación en tiempo real + estado por campo + resumen | D2 | ✅ Completo |
| D5 | Claudio Britez | Galería de 20 formularios prearmados | D1 | ✅ Completo |

## Notas para el equipo

- ✅ **D1 está completo.** La base incluye: Vite + React 19 + TypeScript strict + Tailwind v4 + React Compiler, router SPA, store Zustand con persist, CRUD de formularios, drag & drop de campos, HTML semántico, schema Zod v4 como fuente única de verdad, y formularios con React Hook Form + Zod.
- **D2 desbloquea a D3 y D4.** Luis debió definir el tipo `Rule` y el motor de validación `(value, rule) => error | null`. Una vez publicado, D3 y D4 pudieron trabajar en la misma rama.
- **D5 es paralelo a D2–D4** (solo depende de D1), así que Claudio pudo trabajar en su rama desde el inicio.
- **Contrato público:** los tipos `FieldRule`, `FormField`, `FieldType` están en `src/features/form-lab/schema.ts`. No redefinirlos localmente.
- Una rama por desafío (`feat/d1-polish`, `feat/d2-rules`, etc.).
- Commits con **Conventional Commits** (`feat:`, `fix:`, `refactor:`, `docs:`).
- PRs chicos y frecuentes; evitar que todos toquen el mismo archivo.
- **Skill de referencia:** `.opencode/skills/buenas-practicas/SKILL.md` — incluye Idea 17, contratos, stack, y checklist de entrega.
