/** Maximum messages allowed per code per month */
export const MAX_MESSAGES_PER_MONTH = 300;

/** Length of the access code */
export const CODE_LENGTH = 6;

/** Regex for valid code format (6 alphanumeric characters, case-insensitive) */
export const CODE_FORMAT = /^[A-Za-z0-9]{6}$/;

/** A book access code */
export interface Code {
  code: string;
  monthlyUsage: number;
  lastResetMonth: string;
  createdAt: Date;
}

/** Validates that a string matches the expected code format */
export function isValidCodeFormat(value: string): boolean {
  return CODE_FORMAT.test(value);
}
