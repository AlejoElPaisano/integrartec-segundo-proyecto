import {
  formSchema,
  formTemplateSchema,
} from "@/features/form-lab/schema";
import type { Form, FormTemplate } from "@/features/form-lab/schema";

interface CreateFormFromTemplateDependencies {
  createId: () => string;
  getCreatedAt: () => string;
}

export const formTemplates: FormTemplate[] = formTemplateSchema.array().parse([
  {
    id: "login",
    name: "Login",
    description: "Acceso para usuarios que ya tienen una cuenta.",
    fields: [
      {
        label: "Correo electrónico",
        type: "email",
        placeholder: "nombre@ejemplo.com",
        rules: [
          { type: "required", message: "El correo es obligatorio" },
          { type: "email", message: "Ingresá un correo válido" },
        ],
      },
      {
        label: "Contraseña",
        type: "password",
        placeholder: "Ingresá tu contraseña",
        rules: [
          { type: "required", message: "La contraseña es obligatoria" },
          {
            type: "min",
            value: "6",
            message: "Debe tener al menos 6 caracteres",
          },
        ],
      },
    ],
  },
  {
    id: "signup",
    name: "Registro de usuario",
    description: "Datos esenciales para crear una cuenta nueva.",
    fields: [
      {
        label: "Nombre completo",
        type: "text",
        placeholder: "Nombre y apellido",
        rules: [{ type: "required", message: "El nombre es obligatorio" }],
      },
      {
        label: "Correo electrónico",
        type: "email",
        placeholder: "nombre@ejemplo.com",
        rules: [
          { type: "required", message: "El correo es obligatorio" },
          { type: "email", message: "Ingresá un correo válido" },
        ],
      },
      {
        label: "Contraseña",
        type: "password",
        placeholder: "Creá una contraseña",
        rules: [
          { type: "required", message: "La contraseña es obligatoria" },
          {
            type: "min",
            value: "8",
            message: "Debe tener al menos 8 caracteres",
          },
        ],
      },
      {
        label: "Fecha de nacimiento",
        type: "date",
        rules: [
          { type: "required", message: "La fecha de nacimiento es obligatoria" },
        ],
      },
    ],
  },
  {
    id: "checkout",
    name: "Checkout",
    description: "Información de contacto, envío y pago para una compra.",
    fields: [
      {
        label: "Nombre completo",
        type: "text",
        placeholder: "Nombre y apellido",
        rules: [{ type: "required", message: "El nombre es obligatorio" }],
      },
      {
        label: "Correo electrónico",
        type: "email",
        placeholder: "nombre@ejemplo.com",
        rules: [
          { type: "required", message: "El correo es obligatorio" },
          { type: "email", message: "Ingresá un correo válido" },
        ],
      },
      {
        label: "Dirección de envío",
        type: "textarea",
        placeholder: "Calle, número, ciudad y referencias",
        rules: [{ type: "required", message: "La dirección es obligatoria" }],
      },
      {
        label: "Código postal",
        type: "text",
        placeholder: "Ej: 1000",
        rules: [
          { type: "required", message: "El código postal es obligatorio" },
          {
            type: "regex",
            value: "^\\d{4,8}$",
            message: "Ingresá un código postal válido",
          },
        ],
      },
      {
        label: "Número de tarjeta",
        type: "text",
        placeholder: "0000 0000 0000 0000",
        rules: [
          { type: "required", message: "El número de tarjeta es obligatorio" },
          {
            type: "min",
            value: "13",
            message: "Revisá el número de tarjeta",
          },
        ],
      },
    ],
  },
  {
    id: "contact",
    name: "Formulario de contacto",
    description: "Canal breve para consultas, solicitudes o comentarios.",
    fields: [
      {
        label: "Nombre",
        type: "text",
        placeholder: "Tu nombre",
        rules: [{ type: "required", message: "El nombre es obligatorio" }],
      },
      {
        label: "Correo electrónico",
        type: "email",
        placeholder: "nombre@ejemplo.com",
        rules: [
          { type: "required", message: "El correo es obligatorio" },
          { type: "email", message: "Ingresá un correo válido" },
        ],
      },
      {
        label: "Asunto",
        type: "text",
        placeholder: "Motivo de la consulta",
        rules: [{ type: "required", message: "El asunto es obligatorio" }],
      },
      {
        label: "Mensaje",
        type: "textarea",
        placeholder: "Escribí tu consulta",
        rules: [
          { type: "required", message: "El mensaje es obligatorio" },
          {
            type: "min",
            value: "10",
            message: "El mensaje debe tener al menos 10 caracteres",
          },
        ],
      },
    ],
  },
  {
    id: "satisfaction",
    name: "Encuesta de satisfacción",
    description: "Opinión rápida sobre una experiencia, producto o servicio.",
    fields: [
      {
        label: "Nombre",
        type: "text",
        placeholder: "Tu nombre (opcional)",
        rules: [],
      },
      {
        label: "Puntuación",
        type: "number",
        placeholder: "Del 1 al 5",
        rules: [
          { type: "required", message: "La puntuación es obligatoria" },
          { type: "min", value: "1", message: "La puntuación mínima es 1" },
          { type: "max", value: "5", message: "La puntuación máxima es 5" },
        ],
      },
      {
        label: "Fecha de la experiencia",
        type: "date",
        rules: [{ type: "required", message: "La fecha es obligatoria" }],
      },
      {
        label: "Comentarios",
        type: "textarea",
        placeholder: "Contanos qué podríamos mejorar",
        rules: [],
      },
    ],
  },
  {
    id: "appointment",
    name: "Reserva de turno",
    description: "Solicitud de fecha para recibir un servicio o atención.",
    fields: [
      {
        label: "Nombre completo",
        type: "text",
        placeholder: "Nombre y apellido",
        rules: [{ type: "required", message: "El nombre es obligatorio" }],
      },
      {
        label: "Correo electrónico",
        type: "email",
        placeholder: "nombre@ejemplo.com",
        rules: [
          { type: "required", message: "El correo es obligatorio" },
          { type: "email", message: "Ingresá un correo válido" },
        ],
      },
      {
        label: "Servicio solicitado",
        type: "text",
        placeholder: "Indicá el servicio que necesitás",
        rules: [{ type: "required", message: "El servicio es obligatorio" }],
      },
      {
        label: "Fecha del turno",
        type: "date",
        rules: [{ type: "required", message: "La fecha es obligatoria" }],
      },
      {
        label: "Observaciones",
        type: "textarea",
        placeholder: "Agregá información útil para el turno",
        rules: [],
      },
    ],
  },
  {
    id: "event-registration",
    name: "Inscripción a evento",
    description: "Registro de asistentes para una actividad o encuentro.",
    fields: [
      {
        label: "Nombre completo",
        type: "text",
        placeholder: "Nombre y apellido",
        rules: [{ type: "required", message: "El nombre es obligatorio" }],
      },
      {
        label: "Correo electrónico",
        type: "email",
        placeholder: "nombre@ejemplo.com",
        rules: [
          { type: "required", message: "El correo es obligatorio" },
          { type: "email", message: "Ingresá un correo válido" },
        ],
      },
      {
        label: "Nombre del evento",
        type: "text",
        placeholder: "Evento al que querés asistir",
        rules: [{ type: "required", message: "El evento es obligatorio" }],
      },
      {
        label: "Fecha del evento",
        type: "date",
        rules: [{ type: "required", message: "La fecha es obligatoria" }],
      },
      {
        label: "Cantidad de asistentes",
        type: "number",
        placeholder: "Ej: 2",
        rules: [
          { type: "required", message: "La cantidad es obligatoria" },
          {
            type: "min",
            value: "1",
            message: "Debe asistir al menos una persona",
          },
        ],
      },
      {
        label: "Comentarios",
        type: "textarea",
        placeholder: "Información adicional (opcional)",
        rules: [],
      },
    ],
  },
  {
    id: "quote-request",
    name: "Pedido de presupuesto",
    description: "Detalle inicial para cotizar un servicio o proyecto.",
    fields: [
      {
        label: "Nombre o empresa",
        type: "text",
        placeholder: "Tu nombre o razón social",
        rules: [{ type: "required", message: "El nombre es obligatorio" }],
      },
      {
        label: "Correo electrónico",
        type: "email",
        placeholder: "nombre@ejemplo.com",
        rules: [
          { type: "required", message: "El correo es obligatorio" },
          { type: "email", message: "Ingresá un correo válido" },
        ],
      },
      {
        label: "Servicio solicitado",
        type: "text",
        placeholder: "Servicio que necesitás cotizar",
        rules: [{ type: "required", message: "El servicio es obligatorio" }],
      },
      {
        label: "Presupuesto estimado",
        type: "number",
        placeholder: "Importe aproximado",
        rules: [
          {
            type: "min",
            value: "0",
            message: "El presupuesto no puede ser negativo",
          },
        ],
      },
      {
        label: "Fecha deseada",
        type: "date",
        rules: [],
      },
      {
        label: "Descripción del proyecto",
        type: "textarea",
        placeholder: "Describí el alcance y tus necesidades",
        rules: [
          { type: "required", message: "La descripción es obligatoria" },
          {
            type: "min",
            value: "20",
            message: "La descripción debe tener al menos 20 caracteres",
          },
        ],
      },
    ],
  },
  {
    id: "job-application",
    name: "Solicitud de empleo",
    description: "Presentación inicial de una candidatura laboral.",
    fields: [
      {
        label: "Nombre completo",
        type: "text",
        placeholder: "Nombre y apellido",
        rules: [{ type: "required", message: "El nombre es obligatorio" }],
      },
      {
        label: "Correo electrónico",
        type: "email",
        placeholder: "nombre@ejemplo.com",
        rules: [
          { type: "required", message: "El correo es obligatorio" },
          { type: "email", message: "Ingresá un correo válido" },
        ],
      },
      {
        label: "Puesto solicitado",
        type: "text",
        placeholder: "Puesto al que te postulás",
        rules: [{ type: "required", message: "El puesto es obligatorio" }],
      },
      {
        label: "Años de experiencia",
        type: "number",
        placeholder: "Ej: 3",
        rules: [
          { type: "required", message: "La experiencia es obligatoria" },
          {
            type: "min",
            value: "0",
            message: "Los años no pueden ser negativos",
          },
        ],
      },
      {
        label: "Fecha de disponibilidad",
        type: "date",
        rules: [
          { type: "required", message: "La disponibilidad es obligatoria" },
        ],
      },
      {
        label: "Experiencia profesional",
        type: "textarea",
        placeholder: "Contanos sobre tu experiencia relevante",
        rules: [
          { type: "required", message: "La experiencia es obligatoria" },
          {
            type: "min",
            value: "20",
            message: "La experiencia debe tener al menos 20 caracteres",
          },
        ],
      },
      {
        label: "Presentación personal",
        type: "textarea",
        placeholder: "Agregá una breve presentación (opcional)",
        rules: [],
      },
    ],
  },
]);

export function createFormFromTemplate(
  template: FormTemplate,
  dependencies: CreateFormFromTemplateDependencies
): Form {
  const form = {
    id: dependencies.createId(),
    name: template.name,
    description: template.description,
    createdAt: dependencies.getCreatedAt(),
    fields: template.fields.map((field) => ({
      ...field,
      id: dependencies.createId(),
      rules: field.rules.map((rule) => ({
        ...rule,
        id: dependencies.createId(),
      })),
    })),
  };

  return formSchema.parse(form);
}
