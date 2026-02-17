# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**mailtester** is a modern, high-performance email validation library built with TypeScript 5.3+ and Node.js 20+. It provides RFC 5322 compliant validation, typo detection, disposable email blocking, MX record verification, SMTP validation, bulk processing, and intelligent reputation scoring.

**Key Architecture:**
- Monorepo with Yarn workspaces (single package: `@mailtester/core`)
- Pipeline-based validation with independent, composable validators
- Dual ESM/CJS exports via tsup
- Vitest for testing with 90%+ coverage target
- Strict TypeScript with custom runtime validation (dependency-free schemas)

## Common Development Commands

### Root Level (from project root)
```bash
# Build all packages
yarn build

# Run all tests
yarn test

# Run tests with coverage
yarn test:coverage  (from packages/core)

# Run linting
yarn lint

# Format code
yarn format

# Type checking
yarn typecheck

# Clean all build artifacts
yarn clean
```

### Package Level (from packages/core)
```bash
# Build the package
yarn build

# Run tests
yarn test

# Run tests in watch mode
yarn test:watch

# Run tests with coverage
yarn test:coverage

# Lint TypeScript files
yarn lint

# Auto-fix lint issues
yarn lint:fix

# Format code with Prettier
yarn format

# Check format without changing
yarn format:check

# Type check without emitting
yarn typecheck

# Clean dist directory
yarn clean
```

## Architecture Overview

### Validator Pattern
All validators extend `BaseValidator` (in [validators/base.ts](packages/core/src/validators/base.ts)) and implement a consistent interface:

```typescript
class ExampleValidator extends BaseValidator {
  constructor(options?: ValidatorConfig) {
    super('example', options)
  }

  async validate(email: string, context: ValidationContext): Promise<ValidatorResult> {
    // Implementation
  }
}
```

**Key validators:**
- `RegexValidator` - RFC 5322 format validation ([validators/regex.ts](packages/core/src/validators/regex.ts))
- `TypoValidator` - Common typo detection with suggestions ([validators/typo.ts](packages/core/src/validators/typo.ts))
- `DisposableValidator` - Blocks 40k+ disposable email domains ([validators/disposable.ts](packages/core/src/validators/disposable.ts))
- `MXValidator` - DNS MX record verification ([validators/mx.ts](packages/core/src/validators/mx.ts))
- `SMTPValidator` - Mailbox existence verification via SMTP ([validators/smtp.ts](packages/core/src/validators/smtp.ts))

### Validation Pipeline

The `ValidationOrchestrator` ([orchestrator.ts](packages/core/src/orchestrator.ts)) coordinates validators through a sequential pipeline:

1. Check cache (if enabled)
2. Run validators in order (regex → typo → disposable → mx → smtp)
3. Calculate reputation score
4. Format and return result

**Early exit:** When `earlyExit: true` in config, pipeline stops on first failure.

### Configuration System

`ConfigManager` ([config/config.ts](packages/core/src/config/config.ts)) handles configuration with:
- Preset configurations: `strict`, `balanced`, `permissive`
- Custom validation schemas using Zod-like pattern (in [schemas.ts](packages/core/src/schemas.ts))
- Deep merging: user config > preset > defaults

### Bulk Validation

`BulkProcessor` ([bulk/processor.ts](packages/core/src/bulk/processor.ts)) handles concurrent validation with:
- Configurable concurrency limits
- Progress callbacks
- Rate limiting integration
- Continue-on-error behavior

### Error Handling

Custom error classes in [errors/errors.ts](packages/core/src/errors/errors.ts):
- `ValidationError` - Base validation error
- `ConfigurationError` - Config validation failed
- `NetworkError` - DNS/SMTP network issues
- `TimeoutError` - Operation timed out
- `RateLimitError` - Rate limit exceeded

All errors include structured codes, messages, and actionable suggestions.

## Code Conventions

### Naming
- **Files:** kebab-case (`smtp-validator.ts`, `bulk-processor.ts`)
- **Classes:** PascalCase (`ValidationOrchestrator`, `BaseValidator`)
- **Functions/Variables:** camelCase (`validateEmail`, `mxRecords`)
- **Constants:** UPPER_SNAKE_CASE (`DEFAULT_TIMEOUT`, `MAX_RETRIES`)
- **Types/Interfaces:** PascalCase (`ValidationResult`, `ValidatorConfig`)

### Import Order
1. Node.js built-ins
2. External dependencies
3. Internal imports (@/...)
4. Relative imports (./...)

```typescript
import { promises as dns } from 'node:dns'
import { setTimeout } from 'node:timers/promises'
import type { MxRecord } from 'node:dns'

import { disposableDomains } from 'disposable-email-domains'

import type { ValidationContext } from '@/context'
import { ValidationError } from '@/errors/errors'
import { BaseValidator } from '@/validators/base'

import type { SmtpValidatorConfig } from './types'
```

### Function Design
- Max 50 lines per function
- Max 3-4 parameters (use options object for more)
- Early returns over deep nesting
- async/await (not Promises directly)
- Self-documenting names

### TypeScript Guidelines
- **Always** use strict mode (already configured)
- Avoid `any` - use `unknown` or proper types
- Use discriminated unions for state/result types
- Prefer type inference where clear
- Export types used by consumers

## Testing Guidelines

### Test Structure
```
packages/core/tests/
├── unit/              # Unit tests for individual components
│   ├── validators/    # Validator-specific tests
│   ├── bulk/          # Bulk processing tests
│   └── *.test.ts      # Other unit tests
├── integration/       # Cross-component tests
└── e2e/              # End-to-end workflow tests
```

### Test Patterns
```typescript
describe('ComponentName', () => {
  let component: ComponentName

  beforeEach(() => {
    // Fresh instance for each test
    component = new ComponentName()
  })

  describe('methodName()', () => {
    it('should do X when Y', async () => {
      const result = await component.methodName('input')
      expect(result).toBe('expected')
    })

    it('should throw error when invalid input', async () => {
      await expect(component.methodName('invalid'))
        .rejects.toThrow(ValidationError)
    })
  })
})
```

### Coverage Targets (vitest.config.ts)
- Lines: 89%+
- Functions: 90%+
- Branches: 78%+
- Statements: 89%+

## Important Implementation Notes

### Custom Validation Schemas
The project uses custom runtime validation (not Zod) for dependency-free config validation. See [schemas.ts](packages/core/src/schemas.ts) for patterns. Always validate config with schemas before use.

### Disposable Domain Loading
Domains are lazy-loaded on first validation to reduce initial memory footprint. Do not import directly - use `DisposableValidator`'s internal loading.

### SMTP Connection Handling
SMTP validator uses TCP sockets with optional TLS. Connections timeout after configured duration (default 10s). Pooling is implemented for bulk operations.

### Rate Limiting
`RateLimiter` ([rate-limit/limiter.ts](packages/core/src/rate-limit/limiter.ts)) uses token bucket algorithm with per-domain and global limits to avoid blacklisting.

### Cache Key Privacy
Cache keys are SHA-256 hashed to avoid storing plain emails. Include config hash to invalidate on config changes.

## Pre-Commit Checklist

Before committing changes:
1. `yarn lint` passes (run in packages/core)
2. `yarn test` passes
3. `yarn typecheck` passes
4. `yarn build` succeeds
5. No console.log statements in production code (use logger)
6. Error handling covers edge cases
7. New features have tests
8. Types are exported for public APIs

## Key Files Reference

| File | Purpose |
|------|---------|
| [src/index.ts](packages/core/src/index.ts) | Public API - `validate()`, `createValidator()`, `validateBulk()` |
| [src/orchestrator.ts](packages/core/src/orchestrator.ts) | Main validation pipeline coordinator |
| [src/config/config.ts](packages/core/src/config/config.ts) | Configuration management |
| [src/types.ts](packages/core/src/types.ts) | Core type definitions |
| [src/validators/](packages/core/src/validators/) | All validator implementations |
| [src/bulk/processor.ts](packages/core/src/bulk/processor.ts) | Bulk validation logic |
| [docs/PRD.md](docs/PRD.md) | Product requirements and roadmap |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | Detailed architecture documentation |

## Version Roadmap

**v1.0** (Current - core complete, documentation remaining)
- ✅ All 5 core validators
- ✅ Basic reputation scoring
- ✅ Bulk validation
- ✅ Custom validators
- ✅ Rate limiting
- ⏳ Documentation and publish

**v1.1** (Planned)
- Enhanced reputation scoring (configurable weights)
- In-memory LRU caching
- Streaming API for large datasets

**v1.2+** (Future)
- Plugin system
- Browser build
- Framework integrations
