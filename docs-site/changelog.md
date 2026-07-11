---
title: 'Changelog — @mailtester/core'
description: 'Release history and changelog for @mailtester/core Node.js email validation library. All notable changes, new features, and breaking changes documented.'
head:
  - - link
    - rel: canonical
      href: 'https://mailtester.alikazmi.dev/changelog'
---

# Changelog

All notable changes to `@mailtester/core` are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.2.0] — 2026-07-12

> **Latest release** on npm: [`@mailtester/core@1.2.0`](https://www.npmjs.com/package/@mailtester/core)

### Changed
- **Disposable detection** now uses [`detect-disposable-email`](https://www.npmjs.com/package/detect-disposable-email) `^1.1.0` (resolves to **1.1.1+**) instead of the unmaintained `disposable-email-domains` package
- Domain dataset expanded to **~167k** exact-match domains + **399** wildcard bases (multi-source, actively maintained)
- Matching includes **wildcard subdomains** (e.g. `x.y.10mail.org`) and IDN-aware lookups — not only exact domain equality
- **Node.js requirement raised to ≥ 20.0.0** (aligned with `detect-disposable-email` and current LTS)

### Fixed
- **Early exit no longer stops on warning-severity results** (e.g. typo suggestions). Previously, with default `earlyExit: true`, a typo warning could skip disposable (and later) checks — so addresses like `user@gmaill.com` could pass overall validation without a disposable check

### Removed
- Dependency on `disposable-email-domains` and fragile `require()` / JSON-file load fallbacks

### Notes for consumers
- **Public API is unchanged** (`validate()`, config keys, error codes, whitelist / blacklist / pattern options)
- **Behavior is intentionally stricter:** more temporary / burner domains are blocked. Major free providers (Gmail, Outlook, Proton, etc.) remain allowed
- If a legitimate domain is flagged, use `validators.disposable.customWhitelist` or report it for a data fix upstream in [`detect-disposable-email`](https://github.com/kazmiali/detect-disposable-email)

### Upgrade

```bash
npm install @mailtester/core@1.2.0
# requires Node.js 20+
```

---

## [1.1.3] — 2026-05-06

### Fixed
- Added `co.in` to typo detector TLD list for better Indian email validation

---

## [1.1.2] — 2026-01-20

### Changed
- **Replaced mailcheck dependency** with custom Levenshtein distance implementation
- Improved typo detection algorithm with better accuracy
- Reduced bundle size by removing external dependency

### Removed
- `mailcheck` dependency (deprecated library, last updated 2014)
- `@types/mailcheck` type definitions

### Added
- Custom string distance utilities (`levenshteinDistance`, `similarityScore`, `findClosestMatch`)
- Enhanced typo detection with 60+ popular domains and 100+ TLDs
- Smart typo detection that avoids false positives

### Fixed
- Typo detection now properly handles correct domains without suggesting changes
- Improved confidence scoring for typo suggestions

---

## [1.1.1] — 2026-01-20

### Changed
- **Replaced mailcheck dependency** with custom Levenshtein distance implementation
- Improved typo detection algorithm with better accuracy
- Reduced bundle size by removing external dependency

### Removed
- `mailcheck` dependency (deprecated library, last updated 2014)
- `@types/mailcheck` type definitions

### Added
- Custom string distance utilities (`levenshteinDistance`, `similarityScore`, `findClosestMatch`)
- Enhanced typo detection with 60+ popular domains and 100+ TLDs
- Smart typo detection that avoids false positives

### Fixed
- Typo detection now properly handles correct domains without suggesting changes
- Improved confidence scoring for typo suggestions

---

## [1.1.0] — 2026-01-20

### Changed
- **Node.js support expanded** from 18.0.0 to 16.0.0 for broader compatibility
- Updated documentation to reflect Node 16 support

### Updated
- Root `package.json` engines: `>=16.0.0`
- `@mailtester/core` package.json engines: `>=16.0.0`
- README.md requirements section
- Documentation site (`getting-started.md`, `why.md`)

---

## [1.0.0] — 2025-11-28

### 🎉 First Stable Release!

This is the first stable release of `@mailtester/core`.

### Added

#### Core Validation
- **RFC 5322 Compliant Regex Validator** — Full email format validation with strict and loose modes
- **Typo Detection** — Suggests corrections for common domain typos (e.g. `gmaill.com` → `gmail.com`)
- **Disposable Email Blocking** — Detects 40,000+ temporary email services with pattern-based detection
- **MX Record Validation** — Verifies domain has valid mail servers with retry logic and quality scoring
- **SMTP Verification** — Checks if mailbox actually exists with greylisting detection

#### Bulk Validation
- **Concurrent Processing** — Validate thousands of emails with configurable concurrency limits
- **Progress Tracking** — Real-time progress callbacks for bulk operations
- **Rate Limiting** — Built-in token bucket algorithm with per-domain and global limits
- **Error Handling** — Continue on error option for resilient batch processing

#### Configuration
- **Preset Configurations** — Three built-in presets: `strict`, `balanced`, `permissive`
- **Flexible Configuration** — Enable/disable individual validators, set timeouts, early exit options
- **TypeScript First** — Full type safety with strict mode and comprehensive type definitions

#### API
- `validate(email, options?)` — Single email validation
- `validateBulk(emails, options?)` — Bulk email validation with concurrency control
- `createValidator(config?)` — Create reusable validator instances with custom configuration

#### Performance
- **3x Faster** — Optimized validation pipeline
- **Lazy Loading** — Disposable domain dataset loaded on-demand
- **Lightweight** — ~25KB gzipped

### Technical Details
- Node.js 16+ required
- TypeScript 5.3+ with strict mode
- Dual Module Support — ESM and CommonJS exports
- 90%+ Test Coverage — 644 tests covering all functionality
- Zero Config — Sensible defaults, works out of the box

### Dependencies
- `disposable-email-domains` — Disposable email domain dataset

---

## [1.0.0-beta.1] — 2025-11-27

### Added
- Initial beta release with all core features
- See [1.0.0](#_1-0-0-2025-11-28) for full feature list

---

## Roadmap

### Shipped in v1.2.0
- Migrated disposable detection to [`detect-disposable-email`](https://www.npmjs.com/package/detect-disposable-email) (~167k domains + wildcards)
- Node.js 20+ requirement
- Early-exit fix so typo warnings do not skip disposable checks

### Planned for v1.3.0
- Enhanced reputation scoring with configurable weights
- In-memory LRU caching for improved performance
- Domain reputation database / MX quality scoring enhancements

### Planned for v1.4.0
- Plugin system for third-party integrations
- Browser-compatible build
- Custom validator plugins

[1.2.0]: https://github.com/kazmiali/mailtester/compare/v1.1.3...main
[1.1.3]: https://github.com/kazmiali/mailtester/releases/tag/v1.1.3
[1.1.2]: https://github.com/kazmiali/mailtester/releases/tag/v1.1.2
[1.1.1]: https://github.com/kazmiali/mailtester/releases/tag/v1.1.1
[1.1.0]: https://github.com/kazmiali/mailtester/releases/tag/v1.1.0
[1.0.0]: https://github.com/kazmiali/mailtester/releases/tag/v1.0.0
[1.0.0-beta.1]: https://github.com/kazmiali/mailtester/releases/tag/v1.0.0-beta.1
