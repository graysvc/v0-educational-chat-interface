"use client";

import { firstTimePrompts, returningOptions } from "./welcome-prompts";

interface WelcomeProps {
  onSelectPrompt: (prompt: string) => void;
  isReturning: boolean;
  onPrefill: (text: string) => void;
}

export function Welcome({ onSelectPrompt, isReturning, onPrefill }: WelcomeProps) {
  if (isReturning) {
    return (
      <div className="flex flex-1 items-center justify-center px-6">
        <div className="w-full max-w-md text-center">
          <p className="text-lg leading-relaxed text-foreground md:text-xl">
            Este es un espacio para practicar.
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            No hay preguntas correctas ni incorrectas.
          </p>

          <div className="mt-10 flex flex-col gap-3">
            {returningOptions.map((option) => {
              const Icon = option.icon;
              return (
                <button
                  key={option.label}
                  type="button"
                  onClick={() => onPrefill(option.prefill)}
                  className="flex w-full items-start gap-4 rounded-xl border border-border bg-card px-6 py-5 text-left transition-colors hover:bg-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <Icon className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" aria-hidden="true" />
                  <div>
                    <span className="block text-base font-semibold text-foreground md:text-lg">
                      {option.label}
                    </span>
                    <span className="mt-1 block text-sm text-muted-foreground">
                      {option.subtext}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 items-center justify-center px-6">
      <div className="w-full max-w-md text-center">
        <p className="text-lg leading-relaxed text-foreground md:text-xl">
          Este es un espacio para practicar.
        </p>
        <p className="mt-2 text-lg leading-relaxed text-foreground md:text-xl">
          {"Podes escribir lo que quieras."}
        </p>
        <p className="mt-2 text-lg leading-relaxed text-muted-foreground md:text-xl">
          No hay preguntas correctas ni incorrectas.
        </p>

        <div className="mt-10 flex flex-col gap-3">
          {firstTimePrompts.map((prompt) => {
            const Icon = prompt.icon;
            return (
              <button
                key={prompt.label}
                type="button"
                onClick={() => onSelectPrompt(prompt.value)}
                className="flex w-full items-start gap-4 rounded-xl border border-border bg-card px-6 py-5 text-left transition-colors hover:bg-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <Icon className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" aria-hidden="true" />
                <div>
                  <span className="block text-base font-semibold text-foreground md:text-lg">
                    {prompt.label}
                  </span>
                  <span className="mt-1 block text-sm text-muted-foreground">
                    {prompt.subtext}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
