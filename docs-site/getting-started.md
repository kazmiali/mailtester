---
title: 'Getting Started — Install Node.js Email Validator'
description: 'Install @mailtester/core and validate emails in Node.js in minutes. Supports npm, yarn, pnpm. Works with TypeScript and CommonJS. Node.js 16+ required.'
head:
  - - meta
    - name: keywords
      content: 'install email validator nodejs, npm email validation package, how to validate email in nodejs, email validation tutorial nodejs, typescript email validator install'
  - - link
    - rel: canonical
      href: 'https://mailtester.alikazmi.dev/getting-started'
---

# Getting Started with Node.js Email Validation

Get up and running with `@mailtester/core` — a fast, lightweight email validation library for Node.js — in minutes.

## Requirements

- **Node.js** 16.0.0 or higher
- **TypeScript** 5.3+ (for TypeScript users)

## Installation

Install the package using your preferred package manager:

::: code-group

```bash [npm]
npm install @mailtester/core
```

```bash [yarn]
yarn add @mailtester/core
```

```bash [pnpm]
pnpm add @mailtester/core
```

:::

## Basic Usage

### Simple Validation

```typescript
import { validate } from '@mailtester/core';

const result = await validate('user@gmail.com');

console.log(result.valid);  // true
console.log(result.score);  // 85 (0-100 reputation score)
```

### Check Why Email is Invalid

```typescript
import { validate } from '@mailtester/core';

const result = await validate('test@mailinator.com');

if (!result.valid) {
  console.log(`Invalid: ${result.reason}`);
  // Output: "Invalid: disposable"
}
```

### Validation Result

The `validate()` function returns a `ValidationResult` object:

```typescript
{
  valid: boolean;           // Overall validity
  email: string;            // Email that was validated
  score: number;            // Reputation score (0-100)
  reason?: string;          // Which validator failed (if invalid)
  validators: {             // Individual validator results
    regex?: ValidatorResult;
    typo?: ValidatorResult;
    disposable?: ValidatorResult;
    mx?: ValidatorResult;
    smtp?: ValidatorResult;
  };
  metadata?: {
    timestamp?: string;     // ISO 8601 timestamp
    duration?: number;      // Validation duration in ms
  };
}
```

## Configuration Presets

Use presets for common validation scenarios:

### Strict (Default)

All validators enabled, stops on first failure. Best for maximum validation.

```typescript
await validate('user@example.com', { preset: 'strict' });
```

### Balanced

SMTP disabled for faster validation. Good balance of speed and coverage.

```typescript
await validate('user@example.com', { preset: 'balanced' });
```

### Permissive

Only regex validation. Quick format check.

```typescript
await validate('user@example.com', { preset: 'permissive' });
```

## Custom Configuration

Fine-tune validation by enabling/disabling specific validators:

```typescript
import { validate } from '@mailtester/core';

const result = await validate('user@example.com', {
  validators: {
    regex: { enabled: true },
    typo: { enabled: true },
    disposable: { enabled: true },
    mx: { enabled: true },
    smtp: { enabled: false }  // Disable SMTP for speed
  },
  earlyExit: true  // Stop on first failure
});
```

## Bulk Validation

Process multiple emails concurrently:

```typescript
import { validateBulk } from '@mailtester/core';

const emails = [
  'user1@gmail.com',
  'user2@yahoo.com',
  'fake@mailinator.com'
];

const result = await validateBulk(emails, {
  concurrency: 10,
  onProgress: (completed, total) => {
    console.log(`Progress: ${completed}/${total}`);
  }
});

console.log(`Valid: ${result.valid}/${result.total}`);
// Output: "Valid: 2/3"
```

## Next Steps

- Read the [API Reference](/api) for detailed documentation
- Learn about [Validators](/validators) and what each one checks
- See more [Examples](/examples) for common use cases

