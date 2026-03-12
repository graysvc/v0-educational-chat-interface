import type { LucideIcon } from "lucide-react";
import {
  HelpCircle,
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
    label: "Empezar con una pregunta simple",
    subtext: "Empeza con algo facil.",
    value:
      "Hola, quiero probar hacerte una pregunta simple para ver como funciona esto.",
  },
  {
    icon: PenLine,
    label: "Escribir libremente",
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
