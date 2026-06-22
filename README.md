# Laboratorio de Validación de Formularios

> Segundo Proyecto Integrador — IntegrarTEC (Junio 2026)

## Idea Elegida

**Idea 17: Laboratorio de Validación de Formularios**

Herramienta para armar formularios con reglas de validación combinables y ver cómo responden en tiempo real. Ideal para entender validación a fondo en React.

## Integrantes del Grupo

> **Nota:** Completar con los nombres reales antes de la entrega.

| Integrante | Desafío | Responsabilidad |
|-----------|---------|----------------|
| **[I1 - Nombre]** | D1 — Base | Scaffold, creación dinámica de campos, store global, layout |
| **[I2 - Nombre]** | D2 — Motor de reglas | Reglas combinables (requerido, min, max, email, regex). Define el tipo `Rule` que consumen I3 e I4. |
| **[I3 - Nombre]** | D3 — Mensajes de error | Mensajes personalizados según la regla que falla |
| **[I4 - Nombre]** | D4 — Validación en tiempo real | Validación en vivo, estado por campo (válido/inválido/pendiente), resumen de errores |
| **[I5 - Nombre]** | D5 — Galería de formularios | Formularios prearmados (login, signup, checkout) usando el motor de D2 |

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
- Agregar, editar, reordenar (drag & drop) y eliminar campos de un formulario
- Persistencia de formularios en localStorage (vía Zustand persist)
- Motor de reglas de validación combinables por campo (requerido, min, max, email, regex)
- Formularios construidos con **React Hook Form + Zod + `@hookform/resolvers`**
- Mensajes de error personalizados por regla
- Galería con nueve formularios prearmados y reglas configuradas
- Personalización visual del formulario: colores, tipografías, bordes, sombras, fondos, imágenes, emojis y animaciones
- Vista previa ampliada del diseño con tema aplicado
- Página "Mis formularios" para buscar, ordenar y gestionar formularios guardados
- UI con HTML semántico y accesibilidad básica

## Estructura del Proyecto

```
src/
  app/
    router.tsx              # Configuración de rutas (React Router v7)
    providers.tsx           # Providers globales (AppProviders)
    layout.tsx              # Layout con header, nav, main, footer
  features/
    form-lab/               # Dominio: Laboratorio de formularios
      components/           # UI del feature
        HomePage.tsx        # Lista de formularios guardados
        MyFormsPage.tsx     # Gestión de formularios (búsqueda/ordenamiento)
        FormBuilderPage.tsx # Crear/editar formularios
        FormPreviewPage.tsx # Previsualizar y usar formularios
        TemplateGalleryPage.tsx # Galería de formularios prearmados
        FieldList.tsx       # Lista de campos con drag & drop
        FieldItem.tsx       # Item editable de un campo
        FormMetadataCard.tsx # Formulario de nombre/descripción
        RuleEditor.tsx      # Editor de reglas de validación por campo
      hooks/                # Hooks reutilizables del feature
        useFormLab.ts       # Hook para obtener un formulario por id
        useRuleEngine.ts    # Helper para agregar/editar/eliminar reglas
      store.ts              # Estado global con Zustand + persist
      schema.ts             # Esquemas Zod (fuente única de verdad)
      utils.ts              # Lógica pura: motor de reglas, buildFormSchema, helpers
      templates.ts          # Catálogo y creación de formularios desde plantillas
    form-theme/             # Dominio: Personalización visual de formularios
      components/           # UI del feature (ThemeDrawer, preview, pickers)
      hooks/                # useFormTheme
      store.ts              # Estado del tema con Zustand + persist
      schema.ts             # Re-exporta el schema compartido del tema
      utils.ts              # Helpers de tema, presets, mappers visuales
  shared/
    components/ui/          # Primitivas genéricas (Button, Input, Card, Modal)
    hooks/                  # Hooks transversales (useConfirmDialog, useToast)
    lib/                    # Helpers genéricos (cn, storage)
  main.tsx                  # Punto de entrada
  index.css                 # Tailwind CSS v4 + tokens @theme
```

> **Nota sobre tipos:** no hay `types.ts` en los features. Los tipos se derivan automáticamente del schema Zod via `z.infer<typeof schema>` (regla de la skill §9). El schema del tema (`FormTheme`) vive en `src/features/form-theme/schema.ts` y `form-lab` lo importa de ahí cuando necesita tipar el campo `theme` del formulario.

## Plantillas Incluidas

La galería ofrece nueve puntos de partida editables: login, registro de
usuario, checkout, contacto, encuesta de satisfacción, reserva de turno,
inscripción a evento, pedido de presupuesto y solicitud de empleo.

Cada plantilla declara sus validaciones mediante el contrato `FieldRule` de
`schema.ts`. D5 conserva esas reglas al crear el formulario; su ejecución en
la vista previa depende de la integración del motor correspondiente a D2.

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

- **Deploy funcional:** [Pendiente — configurar en Vercel/Netlify/GitHub Pages]
- **Repositorio:** [Link al repo de GitHub]

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

### Contratos públicos

Los tipos compartidos entre integrantes están en `src/features/form-lab/schema.ts`:

- `FieldRule` — tipo de una regla de validación
- `FormField` — campo de formulario con su `rules[]`
- `FieldType` — tipos de input (`text`, `email`, `number`, `password`, `textarea`, `date`)

El schema del tema (`FormTheme`) vive en `src/features/form-theme/schema.ts` porque es el dominio de ese feature; `form-lab` lo importa para tipar el campo `theme` del formulario.

**Regla:** no redefinir estos tipos en tu propio archivo. Importalos desde los schemas oficiales.

### Antes de empezar tu desafío

1. Crear tu rama desde `develop`: `git checkout -b feat/dX-tu-desafio`
2. Asegurarte de que `tsc -b --noEmit` pase limpio antes de commitear
3. Hacer PRs chicos y frecuentes; evitar tocar archivos de otros desafíos

## Desafíos (D1–D5)

| Desafío | Responsable | Descripción | Dependencias |
|---------|-------------|-------------|--------------|
| D1 | Integrante 1 | Scaffold + creación dinámica de campos + store global | — |
| D2 | Integrante 2 | Motor de reglas combinables por campo | D1 |
| D3 | Integrante 3 | Mensajes de error personalizados según la regla que falla | D2 |
| D4 | Integrante 4 | Validación en tiempo real + estado por campo + resumen de errores | D2 |
| D5 | Integrante 5 | Galería de formularios prearmados (login, signup, checkout) | D1 |

## Notas para el equipo

- ✅ **D1 está completo.** La base incluye: Vite + React 19 + TypeScript strict + Tailwind v4 + React Compiler, router SPA, store Zustand con persist, CRUD de formularios, drag & drop de campos, HTML semántico, schema Zod v4 como fuente única de verdad, y formularios con React Hook Form + Zod.
- **D2 desbloquea a D3 y D4.** I2 debe definir el tipo `Rule` y el motor de validación `(value, rule) => error \| null`. Una vez publicado, I3 e I4 pueden trabajar en paralelo.
- **Límites de responsabilidad:** las páginas de previsualización (`FormPreviewPage`, `ThemePreviewModal`) validan **solo al enviar** y no muestran estados visuales por campo en tiempo real. La validación en vivo, el resumen de errores y los mensajes personalizados avanzados corresponden a D3/D4.
- **D5 es paralelo a D2–D4** (solo depende de D1), así que I5 puede trabajar en su rama desde el inicio.
- **Contrato público:** los tipos `FieldRule`, `FormField`, `FieldType` están en `src/features/form-lab/schema.ts`. No redefinirlos localmente.
- Una rama por desafío (`feat/d1-polish`, `feat/d2-rules`, etc.).
- Commits con **Conventional Commits** (`feat:`, `fix:`, `refactor:`, `docs:`).
- PRs chicos y frecuentes; evitar que todos toquen el mismo archivo.
- **Skill de referencia:** `.opencode/skills/buenas-practicas/SKILL.md` — incluye Idea 17, contratos, stack, y checklist de entrega.
