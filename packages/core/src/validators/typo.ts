/**
 * Typo Detector Validator
 *
 * Detects and suggests corrections for common email domain typos.
 * Uses custom string distance algorithm with expanded TLD coverage and custom domain support.
 */

import { BaseValidator } from './base';
import type { ValidatorResult } from '../types';
import { ValidationError, ErrorCode } from '../errors/errors';
import {
  detectTypo,
  calculateConfidence,
  POPULAR_DOMAINS,
  POPULAR_SECOND_LEVEL_DOMAINS,
  POPULAR_TOP_LEVEL_DOMAINS,
} from '../utils/typo-detector';

/**
 * Configuration options for TypoValidator
 */
export interface TypoValidatorConfig {
  enabled?: boolean;
  /**
   * Custom list of domains to check against
   * @default POPULAR_DOMAINS
   */
  domains?: string[];
  /**
   * Custom list of second-level domains (e.g., "yahoo", "hotmail")
   * @default POPULAR_SECOND_LEVEL_DOMAINS
   */
  secondLevelDomains?: string[];
  /**
   * Custom list of top-level domains (e.g., "com", "net", "org")
   * Expanded to 100+ TLDs by default
   * @default POPULAR_TOP_LEVEL_DOMAINS
   */
  topLevelDomains?: string[];
  /**
   * Confidence threshold (0-1) for accepting suggestions
   * Lower values = more suggestions, higher values = fewer suggestions
   * @default 0.8
   */
  threshold?: number;
}

/**
 * Typo detection validator
 *
 * Detects common typos in email domains and suggests corrections.
 * Uses custom Levenshtein distance algorithm with expanded TLD coverage.
 *
 * @example
 * ```typescript
 * const validator = new TypoValidator({
 *   threshold: 0.8,
 *   domains: ['company.com', 'subsidiary.com']
 * });
 * const result = await validator.validate('user@gmaill.com');
 * // result.valid = false
 * // result.error.suggestion = "Did you mean user@gmail.com?"
 * ```
 */
export class TypoValidator extends BaseValidator {
  private readonly domains: string[];
  private readonly secondLevelDomains: string[];
  private readonly topLevelDomains: string[];
  private readonly threshold: number;

  constructor(config?: TypoValidatorConfig) {
    super('typo', { enabled: config?.enabled ?? true });

    this.domains = config?.domains ?? POPULAR_DOMAINS;
    this.secondLevelDomains = config?.secondLevelDomains ?? POPULAR_SECOND_LEVEL_DOMAINS;
    this.topLevelDomains = config?.topLevelDomains ?? POPULAR_TOP_LEVEL_DOMAINS;
    this.threshold = config?.threshold ?? 0.8;
  }

  /**
   * Validate email for typos
   */
  async validate(email: string): Promise<ValidatorResult> {
    try {
      // Basic checks
      if (!email || typeof email !== 'string') {
        throw new ValidationError(
          'Email must be a non-empty string',
          ErrorCode.TYPO_DETECTED,
          this.name
        );
      }

      // Normalize email
      const normalized = this.normalizeEmail(email);

      // Extract domain for validation
      const domain = this.extractDomain(normalized);
      if (!domain) {
        throw new ValidationError(
          'Invalid email format: missing domain',
          ErrorCode.TYPO_DETECTED,
          this.name
        );
      }

      const suggestion = detectTypo(normalized, {
        domains: this.domains,
        secondLevelDomains: this.secondLevelDomains,
        topLevelDomains: this.topLevelDomains,
        threshold: 0.7,
      });

      if (!suggestion) {
        return this.createResult(true, {
          checked: true,
          suggestion: null,
        });
      }

      const confidence = calculateConfidence(domain, suggestion.domain);

      // If confidence is below threshold, don't flag as typo
      if (confidence < this.threshold) {
        return this.createResult(true, {
          checked: true,
          suggestion: suggestion.full,
          confidence,
          belowThreshold: true,
        });
      }

      // Typo detected with sufficient confidence
      const suggestedEmail = suggestion.full;

      // Create error result with suggestion
      return {
        valid: false,
        validator: this.name,
        error: {
          code: ErrorCode.TYPO_DETECTED,
          message: `Possible typo in domain: ${domain}`,
          suggestion: `Did you mean ${suggestedEmail}?`,
          severity: 'warning',
          validator: this.name,
          details: {
            original: normalized,
            suggestion: suggestedEmail,
            confidence,
            domain: suggestion.domain,
          },
        },
        details: {
          checked: true,
          suggestion: suggestedEmail,
          confidence,
        },
      };
    } catch (error) {
      return this.handleError(error);
    }
  }
}
