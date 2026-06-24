import { useNavigate } from "react-router-dom";
import {
  Plus,
  LayoutTemplate,
  Sparkles,
  Palette,
  ShieldCheck,
  MousePointerClick,
  Zap,
  ArrowRight,
  Layers,
  Eye,
} from "lucide-react";
import { Button } from "@/shared/components/ui/Button";
import { Card } from "@/shared/components/ui/Card";
import { cssVars } from "@/shared/lib/helpers";
import { useFormLabStore } from "@/features/form-lab/store";

const FEATURES = [
  {
    icon: Palette,
    title: "Diseño totalmente libre",
    description:
      "Colores, fuentes, sombras, gradientes, imágenes y animaciones temáticas. Cada formulario tiene su propia personalidad.",
    gradient: "from-blue-500/20 to-violet-500/20",
  },
  {
    icon: ShieldCheck,
    title: "Reglas combinables",
    description:
      "Agregá validaciones por campo: required, min, max, email y regex. Combiná reglas para entender validación a fondo.",
    gradient: "from-emerald-500/20 to-teal-500/20",
  },
  {
    icon: MousePointerClick,
    title: "Respuesta en tiempo real",
    description:
      "Feedback inmediato mientras completás cada campo. Estados visuales claros: válido, inválido o pendiente.",
    gradient: "from-amber-500/20 to-orange-500/20",
  },
  {
    icon: Zap,
    title: "Experiencia inmersiva",
    description:
      "Desde un formulario de F1 con banderas a cuadros hasta una fiesta con confeti. El límite lo ponés vos.",
    gradient: "from-pink-500/20 to-rose-500/20",
  },
] as const;

const SHOWCASE_STEPS = [
  {
    icon: Layers,
    step: "1",
    title: "Creá los campos",
    description: "Arrastrá, reordená y configurá cada campo con su tipo y placeholder.",
  },
  {
    icon: Palette,
    step: "2",
    title: "Personalizá el diseño",
    description: "Elegí colores, tipografías, sombras, gradientes y animaciones únicas.",
  },
  {
    icon: Eye,
    step: "3",
    title: "Previsualizá en vivo",
    description: "Mirá cómo queda tu formulario en tiempo real mientras lo editás.",
  },
] as const;

export function HomePage() {
  const navigate = useNavigate();
  const formCount = useFormLabStore((state) => state.forms.length);

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden px-6 pb-20 pt-16 hero-gradient">
        {/* Animated orbs */}
        <div className="hero-orb hero-orb-1" aria-hidden="true" />
        <div className="hero-orb hero-orb-2" aria-hidden="true" />
        <div className="hero-orb hero-orb-3" aria-hidden="true" />

        <div className="relative mx-auto max-w-5xl">
          <div className="flex flex-col items-center text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary animate-fade-in">
              <Sparkles size={16} />
              <span>Laboratorio de validación de formularios</span>
            </div>

            <h1
              className="mb-6 text-5xl font-extrabold tracking-tight text-text sm:text-6xl lg:text-7xl animate-fade-up"
            >
              Creá formularios con{" "}
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-primary via-[#8b5cf6] to-[#ec4899] bg-clip-text text-transparent">
                  personalidad
                </span>
                <svg
                  className="absolute -bottom-2 left-0 w-full"
                  viewBox="0 0 300 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    d="M2 8C50 2 250 2 298 8"
                    stroke="url(#hero-underline)"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient id="hero-underline" x1="0" y1="0" x2="300" y2="0" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#3b82f6" stopOpacity="0.5" />
                      <stop offset="0.5" stopColor="#8b5cf6" stopOpacity="0.5" />
                      <stop offset="1" stopColor="#ec4899" stopOpacity="0.5" />
                    </linearGradient>
                  </defs>
                </svg>
              </span>
            </h1>

            <p
              className="form-anim-stagger mb-10 max-w-2xl text-lg text-text-muted sm:text-xl animate-fade-up"
              style={cssVars({ "--anim-delay": "100ms" })}
            >
              Diseñá formularios únicos con reglas de validación combinables,
              animaciones temáticas y una experiencia de usuario que destaca.
            </p>

            <div
              className="form-anim-stagger flex flex-col items-center gap-3 sm:flex-row animate-fade-up"
              style={cssVars({ "--anim-delay": "200ms" })}
            >
              <Button
                size="lg"
                onClick={() => navigate("/builder")}
                className="min-w-[14rem] shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-shadow"
              >
                <Plus size={20} />
                Crear formulario
              </Button>
              <Button
                variant="secondary"
                size="lg"
                onClick={() => navigate("/templates")}
                className="min-w-[14rem]"
              >
                <LayoutTemplate size={20} />
                Explorar plantillas
              </Button>
            </div>

            {/* Stats */}
            <div
              className="form-anim-stagger mt-12 flex flex-wrap items-center justify-center gap-6 animate-fade-up"
              style={cssVars({ "--anim-delay": "300ms" })}
            >
              <div className="flex flex-col items-center gap-1">
                <span className="text-3xl font-bold text-text">{formCount}</span>
                <span className="text-xs text-text-muted">
                  {formCount === 1 ? "Formulario creado" : "Formularios creados"}
                </span>
              </div>
              <div className="h-8 w-px bg-border" aria-hidden="true" />
              <div className="flex flex-col items-center gap-1">
                <span className="text-3xl font-bold text-text">15+</span>
                <span className="text-xs text-text-muted">Plantillas temáticas</span>
              </div>
              <div className="h-8 w-px bg-border" aria-hidden="true" />
              <div className="flex flex-col items-center gap-1">
                <span className="text-3xl font-bold text-text">8</span>
                <span className="text-xs text-text-muted">Animaciones únicas</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="px-6 py-20 bg-surface/50">
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-text sm:text-4xl animate-fade-up">
              Todo lo que necesitás para{" "}
              <span className="text-primary">validación</span>
            </h2>
            <p className="form-anim-stagger mt-3 text-lg text-text-muted animate-fade-up" style={cssVars({ "--anim-delay": "80ms" })}>
              Una herramienta que va más allá de los creadores de formularios clásicos.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={feature.title}
                  className="form-anim-stagger group relative overflow-hidden p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl animate-fade-up"
                  style={cssVars({ "--anim-delay": `${(index + 2) * 80}ms` })}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 transition-opacity group-hover:opacity-100`} />
                  <div className="relative">
                    <div className="mb-4 inline-flex rounded-xl bg-primary/10 p-3 text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-white group-hover:shadow-lg group-hover:shadow-primary/25">
                      <Icon size={22} aria-hidden="true" />
                    </div>
                    <h3 className="mb-2 font-semibold text-text">
                      {feature.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-text-muted">
                      {feature.description}
                    </p>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-text sm:text-4xl">
              Cómo funciona
            </h2>
            <p className="mt-3 text-lg text-text-muted">
              Tres pasos para crear formularios espectaculares
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-3">
            {SHOWCASE_STEPS.map((step, index) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.step}
                  className="form-anim-stagger relative flex flex-col items-center text-center animate-fade-up"
                  style={cssVars({ "--anim-delay": `${index * 100}ms` })}
                >
                  <div className="relative mb-5">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-[#8b5cf6]/20 text-primary">
                      <Icon size={28} />
                    </div>
                    <span className="absolute -top-2 -right-2 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-white shadow-lg shadow-primary/25">
                      {step.step}
                    </span>
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-text">
                    {step.title}
                  </h3>
                  <p className="text-sm text-text-muted leading-relaxed">
                    {step.description}
                  </p>

                  {/* Connector line */}
                  {index < SHOWCASE_STEPS.length - 1 && (
                    <div className="hidden sm:block absolute top-8 left-[calc(50%+3rem)] w-[calc(100%-6rem)] h-px bg-gradient-to-r from-border to-transparent" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-3xl">
          <Card className="relative overflow-hidden p-10 text-center">
            <div className="absolute inset-0 hero-gradient opacity-60" />
            <div className="relative">
              <h2 className="text-2xl font-bold text-text sm:text-3xl">
                ¿Listo para crear algo único?
              </h2>
              <p className="mt-3 text-text-muted">
                Empezá ahora y diseñá formularios que dejen huella.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Button
                  size="lg"
                  onClick={() => navigate("/builder")}
                  className="shadow-lg shadow-primary/25"
                >
                  <Plus size={18} />
                  Empezar a crear
                  <ArrowRight size={16} />
                </Button>
                {formCount > 0 && (
                  <Button
                    variant="secondary"
                    size="lg"
                    onClick={() => navigate("/forms")}
                  >
                    Ver mis formularios ({formCount})
                  </Button>
                )}
              </div>
            </div>
          </Card>
        </div>
      </section>
    </main>
  );
}
