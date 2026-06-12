import { isValidVariable } from '@/utils';
import { z } from 'zod';

export const arrayOfStringsOrVariablesSchema = z
  .string()
  .transform((val) => {
    if (val === '') return [];
    if (isValidVariable(val) as boolean) {
      return [val];
    }
    try {
      return JSON.parse(val);
    } catch {
      // Plain string (not JSON-encoded array) — treat as single-item array.
      // This handles legacy SELECT filter values stored without JSON wrapping.
      return [val];
    }
  })
  .refine(
    (parsed) =>
      Array.isArray(parsed) && parsed.every((item) => typeof item === 'string'),
    {
      error: 'Expected an array of strings',
    },
  );
