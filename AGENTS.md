# AGENTS.md — Contexto del Proyecto para Agentes de IA

> Este archivo es leído automáticamente por opencode y otros agentes de IA al iniciar una sesión en este proyecto. Proporciona contexto técnico, arquitectura y reglas de codificación obligatorias.

---

## Proyecto

**Nombre:** Segundo Proyecto Integrador — Módulo de React  
**Institución:** IntegrarTEC  
**Modalidad:** Grupos de 5 estudiantes, una idea por grupo, 5 desafíos (D1–D5)  
**Duración:** Junio 2026 (aproximadamente 1 mes)  
**Tipo:** Single Page Application (SPA) funcional, navegable e interactiva  
**Ambiente:** Cliente únicamente (sin API propia ni base de datos)  

---

## Stack Tecnológico Obligatorio

| Rol | Tecnología | Nota |
|-----|-----------|------|
| Bundler / Dev | **Vite** + `@vitejs/plugin-react` | `index.html` en raíz, `main.tsx` punto de entrada |
| UI | **React 19** + **TypeScript** (`strict: true`) | React Compiler activado vía `babel-plugin-react-compiler` |
| Routing | **React Router v7** (`react-router-dom`) | Modo SPA; redirección SPA obligatoria en deploy |
| Estado global | **Zustand v5** + middleware `persist` | Solo para estado que cruza rutas o componentes lejanos |
| Estilos | **Tailwind CSS v4** (`@tailwindcss/vite`) | Tokens vía `@theme` en CSS; **prohibido** `tailwind.config.js` |
| Íconos | `lucide-react` | Única librería de íconos permitida |
| Formularios | **React Hook Form** + **Zod** + `@hookform/resolvers` | Zod es la fuente de verdad de tipos y reglas |
| Fechas | `date-fns` v4 | Tree-shakeable, TS-first; **prohibido** Moment.js |
| Drag & drop | `@dnd-kit` | `react-beautiful-dnd` está discontinuado |
| IDs | `crypto.randomUUID()` | Nativo del navegador; sin librerías externas |
| Clases CSS | `clsx` + `tailwind-merge` | Opcional pero recomendado |
| Linter | ESLint 9 (flat config) o Biome | Recomendado pero no obligatorio |

> **Regla estricta:** No debe tener API propia ni base de datos. Todo vive en el cliente.

---

## Arquitectura Feature-First (Obligatoria)

El código se organiza **por dominio funcional**, no por tipo técnico. El proyecto debe "gritar" lo que hace (ej: `wardrobe/`, `expenses/`), no las tecnologías que usa.

### Estructura de carpetas

```
src/
  app/
    router.tsx              # Rutas (React Router v7)
    providers.tsx           # Providers globales (AppProviders + PropsWithChildren)
  features/
    <feature>/              # Una carpeta por dominio de negocio
      components/           # UI propia del feature
      hooks/                # Hooks reutilizables del feature
      store.ts              # Slice de Zustand (si aplica)
      schema.ts             # Esquemas Zod del feature
      utils.ts              # Lógica pura: cálculos, formato, helpers
      types.ts              # Tipos e interfaces del feature
  shared/
    components/ui/          # Primitivas genéricas (Button, Input, Card)
    hooks/                  # Hooks transversales (solo si se reusan de verdad)
    lib/                    # Helpers genéricos (storage, fechas)
  main.tsx
  index.css                 # @import "tailwindcss"; + @theme tokens
```

### Antipatrones prohibidos

- **❌ Carpetas globales** a nivel raíz de `src/`: `src/components/`, `src/hooks/`, `src/types/`, `src/services/`, `src/utils/`.
- **❌ `shared/` como cajón de sastre**: solo se usa cuando algo se reutiliza de verdad en múltiples features.
- **❌ Acoplar features entre sí**: cada feature debe ser lo más autocontenido posible.

> **Principio de colocación:** "Colocá lo que cambia junto" — componente, hook, store, schema y utils del mismo feature, juntos.

---

## Reglas de Codificación Clave

1. **Lógica pura en `utils.ts`**: cualquier función sin side effects, sin dependencia de React/DOM, con output determinístico, debe ir en `utils.ts` de su feature.
2. **Inmutabilidad de estado**: nunca mutar directamente (`tasks.push()`). Usar spread, filter, map.
3. **Zod como fuente única de verdad**: derivar tipos con `z.infer<typeof schema>`. No crear interfaces manuales para datos validados por Zod.
4. **HTML semántico**: usar `<header>`, `<nav>`, `<main>`, `<article>`, `<section>`, `<footer>`. Prohibido el "div soup".
5. **CSS para estilos, JS para estados**: JavaScript agrega/quita clases; CSS define cómo se ve. Prohibido `element.style.backgroundColor = "blue"`.
6. **Componentes con responsabilidad única (SRP)**: cada componente hace UNA sola cosa.
7. **Nombres descriptivos**: `calculateResult()`, `ProductCard` — nunca `doStuff()` o `Card` genérico.
8. **Composición sobre herencia**: "tiene un" → composición; "es un" → herencia.
9. **Inyección de dependencias**: inyectar abstracciones (interfaces), no implementaciones concretas.
10. **Jerarquía de estado**: una pantalla → `useState`/`useReducer`/`useContext`; cruzar rutas → Zustand.
11. **Persistencia**: exclusivamente via Zustand `persist`. Prohibido `localStorage.setItem` disperso.
12. **React 19**: `ref` como prop normal (sin `forwardRef`), React Compiler activado (sin `useMemo`/`useCallback` innecesarios), metadata directa en JSX (sin `react-helmet`).
13. **Hooks**: `useEffect` solo para sincronizar con sistemas externos (con cleanup obligatorio). No para estado derivado ni filtrados locales.

---

## Git, GitHub y Deploy

- **Repo público** en GitHub.
- **Una rama por feature/desafío** (D1–D5).
- **PRs chicos y frecuentes**; prohibido que 5 personas toquen el mismo archivo.
- **Conventional Commits** obligatorios (`feat:`, `fix:`, `refactor:`, `docs:`). Prohibidos mensajes genéricos (`"cambios"`, `"avance"`, `"arreglos"`).
- **Deploy funcional** en Vercel, Netlify o GitHub Pages con redirección SPA.
- **README.md completo** con nombre, descripción, integrantes, idea elegida, tecnologías, funcionalidades, links a deploy y repo, instrucciones de uso, estructura del proyecto.

---

## Modalidad de Equipo

- **5 integrantes exactos**, una idea por grupo.
- **D1 es la base**: un integrante levanta el proyecto primero (Vite + router + store global + modelo de datos + layout base). Desbloquea al resto.
- **D2–D5** cuelgan de la base; cada integrante trabaja en su propia rama en paralelo.
- Si un desafío depende de otro que no sea D1, los integrantes acuerdan la interfaz (tipos/props) ANTES de empezar y trabajan en paralelo contra ese contrato.

---

## Comandos del Proyecto

```bash
# Instalar dependencias
pnpm install

# Servidor de desarrollo
pnpm run dev

# Build de producción
pnpm run build

# Preview del build
pnpm run preview

# Lint (si está configurado)
pnpm run lint
```

---

## Criterios de Aprobación

1. SPA funcional en React 19 + TypeScript + Vite.
2. Ruteo entre vistas con React Router v7.
3. Estado global con Zustand/Context donde corresponda.
4. Persistencia real en localStorage vía Zustand persist.
5. Arquitectura feature-first y lógica pura en `utils.ts`.
6. Los 5 desafíos (D1–D5) resueltos e integrados.
7. Repo público con trabajo colaborativo en GitHub.
8. Deploy funcional y README completo.

> El equipo evaluador analizará la **coherencia general** entre arquitectura, estado, funcionalidades y proceso de trabajo documentado.

---

## Recursos Adicionales

- **Skill de buenas prácticas:** `.opencode/skills/buenas-practicas/SKILL.md` — reglas detalladas, ejemplos de código, checklist completo.
- **Documento oficial del proyecto:** Consultar en NotebookLM (notebook ID: `cf57e109-d59a-454f-879f-4a657a3cb385`).
- **17 clases de PDFs:** Cargados en el notebook de NotebookLM mencionado arriba.

---

## Notas para el Agente

- Siempre verificar que cualquier código nuevo respete la arquitectura feature-first.
- Antes de sugerir cambios, revisar si la lógica propuesta es pura (si es pura, debe ir en `utils.ts` del feature correspondiente).
- Priorizar `interface` para props de componentes y formas de objetos; `type` para uniones y tuplas.
- Evitar `React.FC`, `forwardRef`, `useMemo`/`useCallback` innecesarios, y `localStorage.setItem` directo.
- Al proponer formularios, usar React Hook Form + Zod + `@hookform/resolvers`.
- Sugerir nombres descriptivos y HTML semántico en todo momento.
