# Why mailtester?

There are many email validation libraries out there. Here's why @mailtester/core stands out.

## The Problem

Email validation seems simple, but it's not:

- **Format validation** isn't enough - `test@fake-domain.xyz` passes regex
- **MX validation** adds latency - every validation hits DNS
- **SMTP validation** is unreliable - servers block verification
- **Disposable emails** slip through - new services pop up daily
- **Typos** cause lost users - `gmaill.com` looks valid

Most libraries solve one problem. We solve them all.

## Comparison

| Feature | @mailtester/core | deep-email-validator | email-validator |
|---------|-----------------|---------------------|-----------------|
| **RFC 5322 Regex** | Full | Full | Basic |
| **Typo Detection** | Yes | Yes | No |
| **Disposable Check** | 40K+ domains | Yes | No |
| **MX Validation** | Yes | Yes | No |
| **SMTP Validation** | Yes | Yes | No |
| **Bulk Validation** | Built-in | No | No |
| **Rate Limiting** | Built-in | No | No |
| **TypeScript** | Native | Basic types | Basic types |
| **Scoring** | 0-100 score | No | No |
| **Performance** | 3x faster | Slower | Fast |
| **Bundle Size** | 25KB | 50KB+ | 5KB |
| **Maintained** | Active | Limited | Active |

## Key Advantages

### 1. Performance

We're **3x faster** than `deep-email-validator`:

- Single validation: **< 150ms** (without SMTP)
- Bulk 100 emails: **< 5 seconds**
- Optimized DNS lookups
- Efficient concurrency

### 2. TypeScript First

Built from the ground up with TypeScript 5.3+ strict mode:

```typescript
// Full type safety and IntelliSense
import type { ValidationResult, Config } from '@mailtester/core';

const config: Config = {
  preset: 'strict',
  earlyExit: true
};

const result: ValidationResult = await validate('user@example.com', config);
```

### 3. Bulk Validation

Process thousands of emails efficiently:

```typescript
const result = await validateBulk(emails, {
  concurrency: 20,
  rateLimit: {
    global: { requests: 100, window: 60 },
    perDomain: { requests: 5, window: 60 }
  },
  onProgress: (completed, total) => {
    console.log(`${completed}/${total}`);
  }
});
```

### 4. Smart Scoring

Get a reputation score (0-100) for each email:

```typescript
const result = await validate('user@gmail.com');

console.log(result.score);  // 85
// Higher score = more trustworthy
```

### 5. Flexible Presets

Three presets for common use cases:

| Preset | Use Case | Speed |
|--------|----------|-------|
| `strict` | Maximum validation | ~200ms |
| `balanced` | Good coverage, no SMTP | ~100ms |
| `permissive` | Quick format check | ~1ms |

### 6. Modern Architecture

- **Zero config** - Works out of the box
- **Tree-shakeable** - Import only what you need
- **ESM + CJS** - Works everywhere
- **Node.js 18+** - Modern runtime features

## When to Use

### Use @mailtester/core when you need:

- Comprehensive email validation
- Bulk email list cleaning
- User registration validation
- Marketing email verification
- TypeScript type safety
- High performance at scale

### Consider alternatives when:

- You only need basic format validation → use `validator.js`
- You need browser-side validation → use regex only
- You're on Node.js < 18 → check compatibility

## Getting Started

```bash
npm install @mailtester/core
```

```typescript
import { validate } from '@mailtester/core';

const result = await validate('user@gmail.com');
console.log(result.valid);  // true
console.log(result.score);  // 85
```

[Read the full documentation →](/getting-started)

