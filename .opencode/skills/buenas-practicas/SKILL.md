---
name: buenas-practicas
description: Use ONLY when developing, reviewing, or modifying code for the IntegrarTEC Proyecto2 React SPA. Enforces the exact tech stack (React 19, TypeScript, Vite, Zustand v5, Tailwind v4, React Router v7), mandatory feature-first architecture, pure logic separation in utils.ts, Git/GitHub conventions, and all coding standards extracted from the 17 class PDFs and the official project brief.
---

# Buenas Prácticas - Proyecto Integrador React (IntegrarTEC)

> **Ámbito:** Esta skill aplica EXCLUSIVAMENTE al desarrollo del Segundo Proyecto Integrador del módulo de React (junio 2026). Todas las reglas son obligatorias salvo que se indique "recomendado".

---

## 0. Idea Elegida y Contexto del Grupo

> Esta sección define QUÉ estamos construyendo. El resto de la skill define CÓMO. Cualquier duda de implementación debe verificarse primero contra esta sección.

### Idea 17 — Laboratorio de Validación de Formularios

**Dificultad:** alta (4/4)

**Descripción:** Herramienta para armar formularios con reglas de validación combinables y ver cómo responden en tiempo real. Ideal para entender validación a fondo.

**Conceptos que ejercita:** formularios dinámicos, motor de reglas, validación en tiempo real, estado por campo.

**Librerías del proyecto (recomendadas):**
- **Zod 4** como motor de reglas.
- **React Hook Form** (con `@hookform/resolvers`) para el estado y la validación en tiempo real.

> Zod NO es solo "la librería de validación de formularios": en este proyecto Zod es el **corazón** del motor de reglas. Los schemas se construyen dinámicamente a partir de una `rules[]` declarada por el usuario, y se resuelven con RHF para alimentar la UI en tiempo real.

### Recomendaciones de Diseño e Implementación

- **Campo configurable:** cada campo expone `label`, `type` y `rules[]` (requerido, min, max, email, regex) con su mensaje.
- **Validación como funciones puras:** pensar la validación como `(value, rule) => error | null` para combinar reglas fácilmente. Toda esa lógica va en `utils.ts` del feature.
- **Estado por campo visible:** mostrar en la UI si el campo está `valid`, `invalid` o `pending` (sin mezclarlo con la lógica de validación).

### Desafíos y Reparto (5 integrantes)

| Desafío | Responsabilidad | Depende de |
|---------|-----------------|-----------|
| **D1 — Base** | Scaffold + creación dinámica de campos + store del formulario | base |
| **D2 — Motor de reglas** | Reglas combinables por campo (requerido, min, max, email, regex) | D1 |
| **D3 — Mensajes personalizados** | Mensajes de error personalizados según la regla que falla | D2 |
| **D4 — Validación en tiempo real** | Estado por campo + resumen de errores activos | D2 |
| **D5 — Galería de formularios** | Formularios prearmados (login, signup, checkout) usando el motor | D1 |

### Reparto Sugerido

- **I1 · D1 (Base):** scaffold, creación dinámica de campos, store.
- **I2 · D2:** motor de reglas. **Define el tipo `Rule` que consumen I3 e I4.** Contrato público obligatorio.
- **I3 · D3:** mensajes de error personalizados.
- **I4 · D4:** validación en tiempo real + resumen.
- **I5 · D5:** galería de formularios de ejemplo (trabaja en paralelo sobre D1, no sobre D2).

---

## 1. Stack Tecnológico Obligatorio

| Tecnología | Versión / Configuración | Notas |
|-----------|------------------------|-------|
| **React** | 19 (con React Compiler) | Usar `@vitejs/plugin-react` con `babel-plugin-react-compiler` en `vite.config.ts` |
| **TypeScript** | Strict mode (`strict: true`) | `tsconfig.json` obligatorio con `strict: true` |
| **Vite** | Latest | `index.html` en raíz, `main.tsx` punto de entrada. NO usar Create React App (deprecado) |
| **React Router** | v7 (`react-router-dom`) | Modo SPA |
| **Zustand** | v5 + middleware `persist` | Para estado global que cruza rutas o componentes lejanos |
| **Tailwind CSS** | v4 (`@tailwindcss/vite`) | **Prohibido** `tailwind.config.js`. Tokens vía `@theme` en CSS |
| **Íconos** | `lucide-react` | Única librería de íconos permitida |
| **Generación de IDs** | `crypto.randomUUID()` | Nativo del navegador. **Prohibido** instalar librerías externas para esto |
| **Formularios + validación** | React Hook Form + Zod 4 + `@hookform/resolvers` | Zod es la fuente de verdad de tipos y reglas. En la Idea 17, Zod es además el **motor de reglas dinámicas** (ver §0). |
| **Fechas** | `date-fns` v4 | Tree-shakeable, TS-first. **Prohibido** Moment.js |
| **Drag & drop** | `@dnd-kit` | `react-beautiful-dnd` está discontinuado |
| **Clases condicionales** | `clsx` + `tailwind-merge` | Opcional pero recomendado para manejo limpio de clases CSS |

> **Regla estricta:** No debe tener API propia ni base de datos. Todo vive en el cliente.
> **Nota sobre routing:** Aunque existe TanStack Router v1 como alternativa tipada fuerte, este proyecto exige **React Router v7** (`react-router-dom`) en modo librería SPA.

---

## 2. Configuración Base del Proyecto

### 2.1 `vite.config.ts`

Configuración obligatoria:

```ts
import path from "path";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [["babel-plugin-react-compiler", {}]],
      },
    }),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
```

- Plugin de React con **React Compiler** activado via `babel-plugin-react-compiler`.
- Plugin de **Tailwind CSS v4** (`@tailwindcss/vite`).
- Alias `@/` apuntando a `src/` (convención obligatoria para todas las importaciones internas).

### 2.2 `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "strict": true,
    "esModuleInterop": true,
    "jsx": "react-jsx"
  }
}
```

- **`strict: true`** es obligatorio y no negociable.

### 2.3 `src/app/providers.tsx`

```tsx
import type { PropsWithChildren } from "react";

export function AppProviders({ children }: PropsWithChildren) {
  return children; // Envolver con theme providers, toasts, etc. según necesidad
}
```

- Ubicación obligatoria: `src/app/providers.tsx`.
- Exportar función `AppProviders` que reciba `children` tipado con `PropsWithChildren`.
- En `main.tsx` debe envolver al `<RouterProvider router={router} />`.

---

## 3. Arquitectura Feature-First (Obligatoria)

La organización del código debe ser **por dominio funcional**, no por tipo técnico. El proyecto debe "gritar" lo que hace (ej: `wardrobe/`, `expenses/`), no las tecnologías que usa.

### 3.1 Estructura de Carpetas Obligatoria

```
src/
  app/
    router.tsx              # Rutas (React Router v7)
    providers.tsx           # Providers globales
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

### 3.2 Qué NO se debe hacer (Antipatrones Prohibidos)

- **❌ Carpetas globales por tipo técnico** a nivel raíz de `src/`:
  - `src/components/` (mezclando botones genéricos con tarjetas de productos)
  - `src/hooks/` (mezclando lógica de auth con carritos)
  - `src/types/`, `src/services/`, `src/utils/` globales
- **❌ `shared/` como cajón de sastre**: Solo se usa cuando algo se reutiliza de verdad en múltiples features.
- **❌ Acoplar features entre sí**: Cada feature debe ser lo más autocontenido posible.

### 3.3 Principio de Colocación

> **"Colocá lo que cambia junto"**: componente, hook, store, schema y utils del mismo feature, juntos en la misma carpeta.

Esto permite que el equipo de 5 integrantes trabaje en paralelo en distintas ramas (D2–D5), aislando sus cambios a su propia carpeta de feature y previniendo conflictos.

---

## 4. Separación de Lógica Pura en `utils.ts` (Regla Obligatoria)

Toda la **lógica pura** (cálculos matemáticos, balances, manipulación de fechas, formateo, contraste, validaciones auxiliares) debe vivir **fuera de los componentes de React**, específicamente como **funciones puras** dentro del archivo `utils.ts` de cada feature.

### 4.1 Criterio para identificar lógica pura

Si una función:
- No depende de React (`useState`, `useEffect`, hooks)
- No depende del DOM
- No tiene side effects
- Dados los mismos inputs, siempre devuelve el mismo output

→ **Debe ir en `utils.ts`**

### 4.2 Ejemplos de lo que va en `utils.ts`

- Cálculo de balances, totales, promedios
- Formateo de fechas y monedas
- Funciones de filtrado/ordenamiento puras
- Validaciones auxiliares (no las de Zod, esas van en `schema.ts`)
- Generación de datos derivados

### 4.3 Qué NO va en `utils.ts`

- Llamadas a `localStorage` directas (usar Zustand persist)
- Hooks personalizados (van en `hooks/`)
- JSX o lógica de UI
- Efectos secundarios

---

## 5. Reglas de Estado y Persistencia

### 4.1 Jerarquía de Estado

| Alcance | Solución | Ejemplo |
|---------|----------|---------|
| Una sola pantalla / componente | `useState`, `useReducer`, `useContext` | Formulario simple, toggle |
| Cruza rutas o componentes lejanos | Zustand + `persist` middleware | Carrito global, usuario logueado |

> **Regla:** No uses Zustand "porque sí". Resérvalo para estado que cruza rutas o componentes lejanos.

### 4.2 Persistencia Obligatoria

- La persistencia de datos debe hacerse exclusivamente a través de **Zustand persist**.
- **Estrictamente prohibido** tener código disperso usando `localStorage.setItem` por la aplicación.

### 4.3 Inmutabilidad del Estado

- **NUNCA mutar el estado directamente** (ej: `tasks.push(newTask)`).
- Siempre crear una copia inmutable usando el setter correspondiente:
  ```ts
  // ❌ Prohibido
  tasks.push(newTask);
  setTasks(tasks);

  // ✅ Obligatorio
  setTasks((prev: Task[]) => [...prev, newTask]);
  setTasks((prev: Task[]) => prev.filter((t) => t.id !== id));
  ```

---

## 6. Reglas de React 19

### 5.1 React Compiler y Memorización

- React 19 memoriza automáticamente componentes y valores derivados.
- **En la gran mayoría de los casos ya NO hace falta usar `useMemo` o `useCallback`**.
- Solo usarlos si hay una razón de performance medible y documentada.

### 5.2 `forwardRef` → `ref` como prop

- En React 19, `ref` pasa a ser una prop normal.
- **No usar `forwardRef`**. Pasar refs directamente:
  ```tsx
  interface InputProps {
    placeholder?: string;
    ref?: React.Ref<HTMLInputElement>;
  }
  function MyInput({ placeholder, ref }: InputProps) {
    return <input ref={ref} placeholder={placeholder} />;
  }
  ```

### 5.3 Ref Callbacks con Cleanup

- Los ref callbacks ahora permiten devolver una función de limpieza al desmontarse:
  ```tsx
  <div ref={(node) => {
    if (!node) return;
    const observer = new ResizeObserver(() => { ... });
    observer.observe(node);
    return () => observer.disconnect(); // Cleanup al desmontar
  }} />
  ```

### 5.4 Nuevos Hooks de React 19

| Hook | Uso |
|------|-----|
| `use` | Consumir promesas y leer contextos condicionalmente (después de un `if`) |
| `useActionState` | Ciclo de vida de formularios (pending/error/success) |
| `useOptimistic` | Actualizaciones optimistas de UI |

### 5.5 Metadata en JSX

- Se pueden escribir etiquetas de metadata (`<title>`, `<meta>`) directamente en los componentes.
- **Prohibido** usar `react-helmet`.

---

## 7. Reglas de Hooks y Efectos

### 6.1 `useEffect` — Sincronización con el Exterior

- `useEffect` debe usarse **SOLO** para sincronizar el componente con sistemas externos:
  - APIs externas
  - DOM (event listeners, timers)
  - WebSockets, subscriptions
- **NO usar `useEffect` para:**
  - Estado derivado (ej: concatenar `firstName + lastName`)
  - Filtrados locales de listas
  - Sincronizar estado entre componentes (usar lifting o Zustand)

### 6.2 Cleanup Obligatorio

- Cualquier recurso inicializado en un efecto debe limpiarse retornando una función:
  ```ts
  useEffect(() => {
    const id = setInterval(() => console.log("tick"), 1000);
    return () => clearInterval(id); // Cleanup obligatorio
  }, []);
  ```

### 6.3 Custom Hooks

- Crear custom hooks para encapsular lógica reutilizable.
- Al consumir un contexto con `useContext`, es buena práctica crear un custom hook (ej: `useTheme()`) que valide si el contexto es `null` y arroje un error claro si se usa fuera del Provider.

---

## 8. Reglas de TypeScript

### 7.1 Configuración Obligatoria

- `tsconfig.json` debe tener `strict: true` (activa todos los chequeos estrictos).

### 7.2 `interface` vs `type`

| Caso | Usar |
|------|------|
| Formas de objetos, APIs públicas, props de componentes | `interface` |
| Uniones (`A \| B`), tuplas, primitivos complejos | `type` |

### 7.3 Tipado de Componentes

- Usar `interface` o `type` para las props.
- **Evitar `React.FC`**.
- Ejemplo:
  ```tsx
  interface CardProps {
    title: string;
    price: number;
  }
  function Card({ title, price }: CardProps) { ... }
  ```

### 7.4 Inferencia de Tipos

- Confiar en la inferencia de TypeScript.
- Solo tipar explícitamente cuando la inferencia no alcance: parámetros de funciones, valores que pueden cambiar, estados iniciales vacíos.

---

## 9. Zod — Fuente Única de Verdad

> En la **Idea 17**, Zod cumple un rol doble: validador de formularios **y** motor de reglas dinámicas (D2). El motor de reglas vive en `src/features/form-builder/` y se compone en tiempo de ejecución a partir del `rules[]` declarado por el usuario.

### 8.1 Reglas de Zod

- **Zod es la única fuente de verdad** para los tipos y reglas de validación.
- **Prohibido** crear interfaces de TypeScript a mano para los datos que ya valida Zod.
- Derivar tipos automáticamente con `z.infer<typeof schema>`.
- En el motor de reglas (D2), los tipos `Rule`, `FormField`, `FieldError` (ver §0) se mantienen como **tipos TS** descriptivos, pero el schema concreto que se resuelve con RHF se construye dinámicamente con `z.object({...})` a partir de `rules[]`. **El schema concreto nunca se hardcodea.**

### 8.2 Ejemplo de schema y tipos

```ts
// src/features/products/schema.ts
import { z } from "zod";

export const productSchema = z.object({
  id: z.string(),
  title: z.string().min(1),
  description: z.string(),
  price: z.number().positive(),
  imageUrl: z.string(),
  category: z.enum(["frontend", "backend", "design", "tools"]),
});

export const productsSchema = z.array(productSchema);

// Derivar el tipo del schema — una sola fuente de verdad
export type Product = z.infer<typeof productSchema>;
```

### 8.3 Integración con React Hook Form

```ts
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productSchema } from "./schema";
import type { z } from "zod";

type ProductFormData = z.infer<typeof productSchema>;

const form = useForm<ProductFormData>({
  resolver: zodResolver(productSchema),
});
```

---

## 10. Clean Code y Principios SOLID

### 9.1 Single Responsibility Principle (SRP)

- Cada componente, función y módulo debe tener **una sola razón para cambiar**.
- Componentes monolíticos que hacen de todo son un antipatrón.
- Delegar lógica a `utils.ts`, hooks y subcomponentes.

### 9.2 Nombres Descriptivos

- Los nombres de variables, funciones y componentes deben explicar claramente su propósito.
- Ejemplos:
  - ✅ `calculateResult()` — ❌ `doStuff()`
  - ✅ `displayElement` — ❌ `x`
  - ✅ `ProductCard` — ❌ `Card`
- Un buen nombre **reduce la necesidad de comentarios**.

### 9.3 Composición sobre Herencia

- Regla estricta: si puedes decir que **"X tiene un Y"**, usá composición; si puedes decir que **"X es un Y"**, usá herencia.
- Ejemplo:
  ```ts
  // ❌ Herencia forzada
  class Auto extends Motor { /* ... */ }

  // ✅ Composición
  class Auto {
    constructor(private motor: Motor) {}
    arrancar() { this.motor.encender(); }
  }
  ```

### 9.4 Inyección de Dependencias (DI)

- Una clase no debe crear sus propias dependencias internamente (acoplamiento rígido).
- Inyectar dependencias a través del constructor usando **abstracciones** (interfaces):
  ```ts
  interface Logger { log(mensaje: string): void; }

  class ServicioNotificacion {
    constructor(private logger: Logger) {}
    enviar(destinatario: string, texto: string): void {
      // lógica...
      this.logger.log(`Notificación enviada a ${destinatario}`);
    }
  }
  ```
- Beneficio: en tests se puede inyectar un `FakeLogger`.

### 9.5 Separación de Responsabilidades Visuales y Lógicas

> **CSS es para estilos, JS es para estados.**

- JavaScript decide **cuándo** algo está activo (agregar/quitar clases).
- CSS decide **cómo** se ve visualmente esa clase.
- **Prohibido** mezclar estilos inline dentro de la lógica:
  ```ts
  // ❌ Prohibido
  button.style.backgroundColor = "blue";

  // ✅ Obligatorio
  button.classList.add("active");
  // CSS: .active { background-color: blue; }
  ```

### 9.6 Separación Estricta de Lógica Pura

- Toda la lógica pura (cálculos, formato, validaciones auxiliares) debe vivir en `utils.ts` como funciones puras.
- Facilita razonamiento, reutilización y testing.

---

## 11. Reglas de Componentes

### 10.1 Principio de Responsabilidad Única (Single Responsibility)

> **Regla de oro:** Cada componente hace **UNA sola cosa** y la hace bien.

- **Prohibido** crear componentes monolíticos que mezcluen header, navegación, artículos y footer todo junto.
- Dividir en componentes pequeños y enfocados: `<Header>`, `<Navigation>`, `<Article>`, `<ProductCard>`, `<CheckoutForm>`, `<UserAvatar>`.
- Los nombres deben explicar claramente qué hace el componente (ej: `ProductCard`, no `Card` genérico).
- Los event listeners y manejadores también deben delegar a funciones con una sola responsabilidad.

### 10.2 HTML Semántico (Prohibido el "Div Soup")

- Usar etiquetas semánticas: `<header>`, `<nav>`, `<main>`, `<article>`, `<section>`, `<footer>`.
- **Prohibido** construir la interfaz solo con `<div>` y `<span>` sin significado estructural.
- Esto mejora accesibilidad, SEO y legibilidad del código.

### 10.3 Características de un Buen Componente

- Tiene una **responsabilidad específica**.
- Es **reutilizable** cuando aplica.
- Recibe datos a través de **props**.
- Puede tener su propio **estado interno**.
- Devuelve **JSX válido**.

### 10.4 CSS Modules (Recomendado para estilos locales)

- Vite soporta CSS Modules nativamente.
- Convención: un archivo `.module.css` al lado de su componente.
- Garantiza encapsulamiento y nombres de clase únicos.

```
src/features/<feature>/components/
  Card/
    Card.tsx
    Card.module.css
```

### 10.5 Tailwind CSS v4

- Importar con `@import "tailwindcss";` en `index.css`.
- Tokens personalizados vía `@theme` en el CSS, **NO** en `tailwind.config.js`.
- Usar clases utilitarias para diseño rápido; CSS Modules para estilos específicos de componente cuando sea necesario.

---

## 12. Reglas de Git, GitHub y Deploy

### 11.1 Repositorio y Ramas

- **Repositorio público** en GitHub.
- **Una rama por feature/desafío** (D1–D5).
- El responsable del D1 revisa e integra los PRs a la rama principal.

### 11.2 Pull Requests

- PRs **chicos y frecuentes**.
- **Prohibido** que 5 personas toquen el mismo archivo simultáneamente.
- Si un desafío depende de otro que no sea D1, los integrantes deben **acordar la interfaz (tipos/props) ANTES de empezar** y trabajar en paralelo contra ese contrato.

### 11.3 Conventional Commits (Obligatorio)

| Prefijo | Uso |
|---------|-----|
| `feat:` | Nueva funcionalidad |
| `fix:` | Corrección de bug |
| `docs:` | Documentación |
| `refactor:` | Refactorización |
| `chore:` | Tareas de mantenimiento |

- **Prohibidos** mensajes genéricos: `"cambios"`, `"avance"`, `"arreglos"`, `"commit final"`, `"cosas"`, `"asdf"`.

### 11.4 Deploy

- Deploy funcional en **Vercel, Netlify o GitHub Pages**.
- Configurar redirección SPA para que el router funcione al recargar páginas.

### 11.5 README Obligatorio

El `README.md` debe incluir:
- Nombre del proyecto y descripción breve
- Integrantes del grupo
- Idea elegida
- Tecnologías utilizadas
- Funcionalidades principales
- Link al deploy funcional
- Link al repositorio
- Instrucciones de uso
- Estructura del proyecto

---

## 13. Accesibilidad y Calidad (Recomendado)

- Imágenes con `alt` cuando corresponda.
- Contraste legible entre texto y fondo.
- Formularios con labels asociadas correctamente.
- Botones y enlaces identificables; navegación clara.
- No depender solo del color para transmitir información.
- Estados de error o éxito visibles en pantalla.
- **Linter:** ESLint 9 (flat config) o Biome como alternativa todo-en-uno.

---

## 14. Criterios de Aprobación (Obligatorios)

Para que el proyecto sea aprobado, debe cumplir estrictamente con estos requisitos mínimos:

1. **SPA funcional** construida con React 19 + TypeScript + Vite.
2. **Ruteo entre vistas** con React Router v7 (o equivalente tipado fuerte).
3. **Estado global** con Zustand/Context donde corresponda (no para estados locales).
4. **Persistencia real** en localStorage que tenga sentido dentro del proyecto (vía Zustand persist).
5. **Arquitectura feature-first** y lógica pura separada en `utils.ts`.
6. **Los 5 desafíos (D1–D5) resueltos e integrados** respetando la idea elegida.
7. **Repositorio público** en GitHub que refleje trabajo colaborativo (ramas, PRs, commits).
8. **Deploy funcional** y README completo con todos los puntos requeridos.

> El equipo evaluador analizará la **coherencia general** entre arquitectura, estado, funcionalidades y proceso de trabajo documentado, demostrando que el grupo comprende cómo desarrollar una SPA.

---

## 15. Modalidad de Trabajo en Equipo

- Grupos de **exactamente 5 estudiantes**.
- Cada idea tiene **5 desafíos obligatorios (D1–D5)**, uno por integrante.
- **D1 es la base**: el integrante a cargo levanta el proyecto primero (Vite + router + store global + modelo de datos + layout base). Desbloquea al resto.
- **Integrantes 2–5 (D2–D5)**: toman un desafío que cuelga de la base y lo desarrollan en su propia rama, en paralelo.

---

## 16. Checklist antes de entregar

### Configuración base
- [ ] React 19 + TypeScript (`strict: true`) + Vite configurados correctamente
- [ ] `vite.config.ts` con alias `@/src`, plugin React + React Compiler, plugin Tailwind v4
- [ ] `providers.tsx` en `src/app/providers.tsx` con `AppProviders` y `PropsWithChildren`
- [ ] `index.css` con `@import "tailwindcss";` y tokens vía `@theme` (sin `tailwind.config.js`)

### Arquitectura y código
- [ ] Estructura feature-first respetada (sin carpetas globales `components/`, `hooks/`, `types/`, `services/`)
- [ ] Cada feature tiene su `utils.ts` con lógica pura (funciones sin side effects)
- [ ] Cada feature tiene su `schema.ts` con Zod como fuente de verdad y tipos derivados vía `z.infer`
- [ ] Componentes con **responsabilidad única** (SRP) — no monolitos
- [ ] HTML semántico usado correctamente (`<header>`, `<main>`, `<article>`, etc.) — sin "div soup"
- [ ] Nombres descriptivos en variables, funciones y componentes
- [ ] Separación CSS/JS: clases CSS para estilos, JS para estados (sin `style.inline`)
- [ ] Composición sobre herencia en modelos de datos

### Estado y persistencia
- [ ] Zustand persist para estado global que cruza rutas; NO hay `localStorage.setItem` disperso
- [ ] `useState`/`useReducer`/`useContext` para estado de una sola pantalla (sin abusar de Zustand)
- [ ] Inmutabilidad de estado respetada en todo momento (spread, filter, map — no mutar directamente)

### React 19 y hooks
- [ ] React Compiler activado (sin `useMemo`/`useCallback` innecesarios)
- [ ] `ref` pasado como prop normal (sin `forwardRef`)
- [ ] `useEffect` usado SOLO para sincronización con sistemas externos (con cleanup obligatorio)
- [ ] Custom hooks para encapsular lógica reutilizable y consumo de contextos

### Git, GitHub y entrega
- [ ] Repo público en GitHub
- [ ] Conventional Commits en todo el historial (`feat:`, `fix:`, `refactor:`, `docs:`)
- [ ] Una rama por feature/desafío (D1–D5); PRs chicos y frecuentes
- [ ] README completo con todos los puntos requeridos
- [ ] Deploy funcional (Vercel/Netlify/GH Pages) con redirección SPA para recargas
- [ ] Los 5 desafíos (D1–D5) resueltos e integrados
- [ ] `crypto.randomUUID()` usado para IDs (sin librerías externas)

### Calidad y accesibilidad
- [ ] Imágenes con `alt` descriptivo
- [ ] Contraste legible entre texto y fondo
- [ ] Formularios con labels asociadas correctamente
- [ ] Estados de error y éxito visibles en pantalla
- [ ] ESLint 9 (flat config) o Biome configurado (recomendado)
