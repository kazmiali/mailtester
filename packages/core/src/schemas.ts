/**
 * Zod schemas for runtime validation
 *
 * @packageDocumentation
 */

import { z } from 'zod';
import { ErrorCode } from './types';

/**
 * Schema for error severity levels
 */
export const errorSeveritySchema = z.enum(['warning', 'error', 'critical']);

/**
 * Schema for error codes
 */
export const errorCodeSchema = z.nativeEnum(ErrorCode).or(z.string());

/**
 * Schema for validation error details
 */
export const validationErrorSchema = z.object({
  code: errorCodeSchema,
  message: z.string().min(1, 'Error message cannot be empty'),
  suggestion: z.string().optional(),
  severity: errorSeveritySchema,
  validator: z.string().optional(),
  details: z.unknown().optional(),
});

/**
 * Schema for validator result
 */
export const validatorResultSchema = z.object({
  valid: z.boolean(),
  validator: z.string().min(1, 'Validator name cannot be empty'),
  error: validationErrorSchema.optional(),
  details: z.record(z.string(), z.unknown()).optional(),
});

/**
 * Schema for validator configuration
 */
export const validatorConfigSchema = z.object({
  enabled: z.boolean(),
});

/**
 * Schema for validator options (validators can be boolean or config object)
 */
const validatorOptionsConfigSchema = z.object({
  regex: z.union([validatorConfigSchema, z.boolean()]).optional(),
  typo: z.union([validatorConfigSchema, z.boolean()]).optional(),
  disposable: z.union([validatorConfigSchema, z.boolean()]).optional(),
  mx: z.union([validatorConfigSchema, z.boolean()]).optional(),
  smtp: z.union([validatorConfigSchema, z.boolean()]).optional(),
});

/**
 * Schema for validator options (single email validation)
 */
export const validatorOptionsSchema = z.object({
  email: z.string().email('Invalid email format'),
  validators: validatorOptionsConfigSchema.optional(),
  earlyExit: z.boolean().optional(),
  timeout: z.number().int().positive('Timeout must be a positive integer').optional(),
});

/**
 * Schema for validation result reason
 */
const validationReasonSchema = z.enum(['regex', 'typo', 'disposable', 'mx', 'smtp', 'custom']);

/**
 * Schema for validation result validators object
 */
const validatorsResultSchema = z
  .object({
    regex: validatorResultSchema.optional(),
    typo: validatorResultSchema.optional(),
    disposable: validatorResultSchema.optional(),
    mx: validatorResultSchema.optional(),
    smtp: validatorResultSchema.optional(),
  })
  .catchall(validatorResultSchema.optional());

/**
 * Schema for validation result (output format)
 */
export const validationResultSchema = z.object({
  valid: z.boolean(),
  email: z.string().email('Invalid email format'),
  score: z
    .number()
    .int()
    .min(0, 'Score must be between 0 and 100')
    .max(100, 'Score must be between 0 and 100'),
  reason: validationReasonSchema.optional(),
  validators: validatorsResultSchema,
});

/**
 * Schema for configuration preset
 */
export const presetSchema = z.enum(['strict', 'balanced', 'permissive']);

/**
 * Schema for full configuration (will be expanded in Task 2.3)
 */
export const configSchema = z.object({
  preset: presetSchema.optional(),
  validators: validatorOptionsConfigSchema.optional(),
  earlyExit: z.boolean().optional(),
  timeout: z.number().int().positive('Timeout must be a positive integer').optional(),
});
