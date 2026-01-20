<div align="center">

# mailtester

**Modern, high-performance email validation for Node.js**

[![npm version](https://img.shields.io/npm/v/@mailtester/core.svg?style=flat-square)](https://www.npmjs.com/package/@mailtester/core)
[![npm downloads](https://img.shields.io/npm/dt/@mailtester/core.svg?style=flat-square)](https://www.npmjs.com/package/@mailtester/core)
[![Build Status](https://img.shields.io/github/actions/workflow/status/kazmiali/mailtester/ci.yml?branch=main&style=flat-square)](https://github.com/kazmiali/mailtester/actions)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3+-blue?style=flat-square)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)

A comprehensive email validation library with RFC 5322 compliance, typo detection, disposable email blocking, MX record verification, and SMTP validation.

</div>

---

## Packages

| Package | Description | Version |
|---------|-------------|---------|
| [@mailtester/core](./packages/core) | Core email validation library | [![npm](https://img.shields.io/npm/v/@mailtester/core.svg?style=flat-square)](https://www.npmjs.com/package/@mailtester/core) |

## Quick Start

```bash
npm install @mailtester/core
```

```typescript
import { validate } from '@mailtester/core';

const result = await validate('user@example.com');

console.log(result.valid);  // true
console.log(result.score);  // 85
```

See the [core package documentation](./packages/core/README.md) for detailed usage instructions.

## Features

- **RFC 5322 Compliant** — Full regex validation with strict and loose modes
- **Typo Detection** — Suggests corrections for common domain typos
- **Disposable Email Blocking** — Detects 40,000+ temporary email services
- **MX Record Validation** — Verifies domain has valid mail servers
- **SMTP Verification** — Checks if mailbox actually exists
- **Bulk Validation** — Process thousands of emails concurrently
- **Rate Limiting** — Built-in protection against API abuse
- **TypeScript First** — Full type safety with strict mode
- **Lightweight** — ~25KB gzipped, minimal dependencies

## Requirements

- Node.js 16.0.0 or higher
- TypeScript 5.3+ (for TypeScript users)

## Development

```bash
# Clone the repository
git clone https://github.com/kazmiali/mailtester.git
cd mailtester

# Install dependencies
yarn install

# Build all packages
yarn build

# Run tests
yarn test

# Lint code
yarn lint
```

## Project Structure

```
mailtester/
├── packages/
│   └── core/           # Core validation library
│       ├── src/
│       │   ├── validators/   # Individual validators
│       │   ├── bulk/         # Bulk processing
│       │   ├── config/       # Configuration management
│       │   └── ...
│       └── tests/
├── docs/               # Documentation
└── README.md
```

## License

MIT © [Ali Kazmi](https://github.com/kazmiali)

---

<div align="center">

**[Documentation](./packages/core/README.md)** •
**[Report Bug](https://github.com/kazmiali/mailtester/issues)** •
**[Request Feature](https://github.com/kazmiali/mailtester/issues)**

</div>

