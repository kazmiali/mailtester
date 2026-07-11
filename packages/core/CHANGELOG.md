# Changelog

All notable changes to `@mailtester/core` will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.2.0] - 2026-07-12

### Changed
- **Disposable detection** now uses [`detect-disposable-email`](https://www.npmjs.com/package/detect-disposable-email) `^1.1.0` instead of the unmaintained `disposable-email-domains` package.
- Domain dataset expanded to **~167k** exact-match domains + **399** wildcard bases (multi-source, actively maintained).
- Matching now includes **wildcard subdomains** (e.g. `x.y.10mail.org`) and IDN-aware lookups — not only exact domain equality.
- **Node.js requirement raised to ≥ 20.0.0** (aligned with `detect-disposable-email` and current LTS).

### Fixed
- **Early exit no longer stops on warning-severity results** (e.g. typo suggestions). Previously, with default `earlyExit: true`, a typo warning could skip disposable (and later) checks — so addresses like `user@gmaill.com` could pass overall validation without a disposable check.

### Removed
- Dependency on `disposable-email-domains` and the brittle `require()` / JSON-file fallback loaders.

### Notes for consumers
- **Public API is unchanged** (`validate()`, config keys, error codes, whitelist/blacklist/pattern options).
- **Behavior is intentionally stricter:** more temporary / burner domains are blocked. Major free providers (Gmail, Outlook, Proton, etc.) remain allowed.
- If a legitimate domain is flagged, use `validators.disposable.customWhitelist` or report it for a data fix in `detect-disposable-email`.

---

## [1.1.3] - 2026-05-06

### Fixed
- Added `co.in` to typo detector TLD list for better Indian email validation

### Changed
- Updated documentation homepage URL to https://mailtester.alikazmi.dev/

---

## [1.1.0] - 2026-01-20

### Changed
- **Node.js support expanded** from 18.0.0 to 16.0.0 for broader compatibility
- Updated documentation to reflect Node 16 support

### Updated
- Root package.json engines: >=16.0.0
- Core package.json engines: >=16.0.0
- README.md requirements section
- Documentation site (getting-started.md, why.md)

---

## [1.0.2] - 2025-11-28

### Changed
- **Node.js requirement lowered** from 20.0.0 to 18.0.0 for broader compatibility

---

## [1.0.2] - 2025-11-28

### Added
- **Documentation Site** - VitePress-powered documentation at https://mailtester.alikazmi.dev/
  - Getting Started guide
  - API Reference
  - Validators documentation
  - Configuration guide
  - Code examples

### Changed
- Updated package homepage to point to documentation site

---

## [1.0.0] - 2025-11-28

### 🎉 First Stable Release!

This is the first stable release of `@mailtester/core`, a modern, high-performance email validation library.

### Added

#### Validators
- **Regex Validator** - RFC 5322 compliant email format validation
  - Strict mode: Full RFC compliance with quoted strings
  - Loose mode: Practical validation for common formats
  - Support for internationalized domain names (IDN)
  - Detailed error messages for validation failures

- **Typo Validator** - Domain typo detection and suggestions
  - Detects common typos (gmaill.com → gmail.com)
  - 100+ TLD coverage
  - Confidence scoring
  - Custom domain list support

- **Disposable Validator** - Temporary email detection
  - 40,000+ known disposable domains
  - Pattern-based detection (10minutemail, tempmail, etc.)
  - Custom blacklist/whitelist support
  - Lazy loading for performance

- **MX Validator** - Mail server verification
  - DNS MX record lookup
  - Retry logic with exponential backoff
  - Quality scoring (0-20 points)
  - A record fallback

- **SMTP Validator** - Mailbox existence verification
  - SMTP command sequence (HELO → MAIL FROM → RCPT TO)
  - TLS/STARTTLS support
  - Greylisting detection
  - Configurable timeout and retries

#### Bulk Validation
- `validateBulk()` function for processing multiple emails
- Configurable concurrency (default: 10)
- Progress tracking via callbacks
- Continue on error option
- Rate limiting integration

#### Rate Limiting
- Token bucket algorithm
- Per-domain rate limits
- Global rate limits
- Configurable requests per time window

#### Configuration
- Three presets: `strict`, `balanced`, `permissive`
- Per-validator enable/disable
- Early exit on failure option
- Timeout configuration

#### API Functions
- `validate(email, options?)` - Single email validation
- `validateBulk(emails, options?)` - Bulk validation
- `createValidator(config?)` - Reusable validator factory

#### Types & Exports
- Full TypeScript type definitions
- `ValidationResult` interface
- `ValidatorResult` interface
- `BulkValidationResult` interface
- Error classes: `ValidationError`, `ConfigurationError`, `NetworkError`, `TimeoutError`

### Performance
- Single validation: < 150ms (without SMTP)
- Bulk 100 emails: < 5 seconds
- Package size: ~25KB gzipped

### Technical
- Node.js 18+ required
- TypeScript 5.3+ with strict mode
- ESM and CommonJS dual exports
- 90%+ test coverage (644 tests)

---

## [1.0.0-beta.1] - 2025-11-27

### Added
- Initial beta release with all core features
- See [1.0.0] for full feature list

[1.1.3]: https://github.com/kazmiali/mailtester/releases/tag/v1.1.3
[1.1.0]: https://github.com/kazmiali/mailtester/releases/tag/v1.1.0
[1.0.0]: https://github.com/kazmiali/mailtester/releases/tag/v1.0.0
[1.0.0-beta.1]: https://github.com/kazmiali/mailtester/releases/tag/v1.0.0-beta.1
