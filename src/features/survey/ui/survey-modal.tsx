"use client";

import type { UtilityResponse, FeelingResponse } from "../model/types";

export interface SurveyModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (utility: UtilityResponse, feeling: FeelingResponse) => void;
}

export function SurveyModal({ open, onClose, onSubmit }: SurveyModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-lg bg-card p-6 shadow-lg">
        <h2 className="text-lg font-medium mb-4">
          ¿Cómo te fue?
        </h2>
        <p className="text-sm text-muted-foreground mb-6">
          Tu respuesta nos ayuda a mejorar. Es anónima y opcional.
        </p>
        {/* TODO: Utility question (sí / más o menos / no) */}
        {/* TODO: Feeling question (tranquilo / bien / confundido / frustrado) */}
        {/* TODO: Submit + skip buttons */}
      </div>
    </div>
  );
}
