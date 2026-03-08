import type { LucideIcon } from "lucide-react";
import {
  HelpCircle,
  BookOpen,
  Sparkles,
  PenLine,
} from "lucide-react";

export interface FirstTimePrompt {
  icon: LucideIcon;
  label: string;
  subtext: string;
  value: string;
}

export interface ReturningOption {
  icon: LucideIcon;
  label: string;
  subtext: string;
  prefill: string;
}

export const firstTimePrompts: FirstTimePrompt[] = [
  {
    icon: HelpCircle,
    label: "Quiero probar una pregunta simple",
    subtext: "Empeza con algo facil.",
    value:
      "Hola, quiero probar hacerte una pregunta simple para ver como funciona esto.",
  },
  {
    icon: BookOpen,
    label: "Quiero entender algo del libro",
    subtext: "Pregunta sobre lo que estas leyendo.",
    value:
      "Quiero que me ayudes a entender algo del libro que estoy leyendo sobre inteligencia artificial.",
  },
  {
    icon: Sparkles,
    label: "Quiero practicar como preguntar mejor",
    subtext: "Te ayudo a reformular.",
    value:
      "Quiero practicar como hacer mejores preguntas a una inteligencia artificial. Ayudame a mejorar.",
  },
  {
    icon: PenLine,
    label: "Quiero escribir libremente",
    subtext: "Escribi lo que tengas en mente.",
    value:
      "Quiero escribir libremente y conversar con vos sobre lo que se me ocurra.",
  },
];

export const returningOptions: ReturningOption[] = [
  {
    icon: HelpCircle,
    label: "Empezar con una pregunta simple",
    subtext: "Empeza con algo facil.",
    prefill: "Hola, quiero probar hacerte una pregunta simple para ver como funciona esto.",
  },
  {
    icon: PenLine,
    label: "Escribir libremente",
    subtext: "Escribi lo que tengas en mente.",
    prefill: "",
  },
];
