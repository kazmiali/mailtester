# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.2] - 2026-01-20

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

## [1.1.1] - 2026-01-20

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

## [1.1.0] - 2026-01-20

### Changed
- **Node.js support expanded** from 18.0.0 to 16.0.0 for broader compatibility
- Updated documentation to reflect Node 16 support

### Updated
- Root package.json engines: >=16.0.0
- @mailtester/core package.json engines: >=16.0.0
- README.md requirements section
- Documentation site (getting-started.md, why.md)

---

## [1.0.0] - 2025-11-28

### 🎉 First Stable Release!

This is the first stable release of `@mailtester/core`, a modern, high-performance email validation library.

### Added

#### Core Validation
- **RFC 5322 Compliant Regex Validator** - Full email format validation with strict and loose modes
- **Typo Detection** - Suggests corrections for common domain typos (e.g., gmaill.com → gmail.com)
- **Disposable Email Blocking** - Detects 40,000+ temporary email services with pattern-based detection
- **MX Record Validation** - Verifies domain has valid mail servers with retry logic and quality scoring
- **SMTP Verification** - Checks if mailbox actually exists with greylisting detection

#### Bulk Validation
- **Concurrent Processing** - Validate thousands of emails with configurable concurrency limits
- **Progress Tracking** - Real-time progress callbacks for bulk operations
- **Rate Limiting** - Built-in token bucket algorithm with per-domain and global limits
- **Error Handling** - Continue on error option for resilient batch processing

#### Configuration
- **Preset Configurations** - Three built-in presets: `strict`, `balanced`, `permissive`
- **Flexible Configuration** - Enable/disable individual validators, set timeouts, early exit options
- **TypeScript First** - Full type safety with strict mode and comprehensive type definitions

#### API
- `validate(email, options?)` - Simple single email validation
- `validateBulk(emails, options?)` - Bulk email validation with concurrency control
- `createValidator(config?)` - Create reusable validator instances with custom configuration

#### Performance
- **3x Faster** - Optimized validation pipeline
- **Lazy Loading** - Disposable domain dataset loaded on-demand
- **Lightweight** - ~25KB gzipped package size

### Technical Details

- **Node.js 18+** required
- **TypeScript 5.3+** with strict mode
- **Dual Module Support** - ESM and CommonJS exports
- **90%+ Test Coverage** - 644 tests covering all functionality
- **Zero Config** - Sensible defaults, works out of the box

### Dependencies

- `disposable-email-domains` - Disposable email domain dataset
- `mailcheck` - Typo detection algorithm

---

## [1.0.0-beta.1] - 2025-11-27

### Added
- Initial beta release with all core features
- See [1.0.0] for full feature list

---

## Future Releases

### Planned for v1.1.0
- Enhanced reputation scoring with configurable weights
- In-memory LRU caching for improved performance
- Domain reputation database
- MX quality scoring enhancements

### Planned for v1.2.0
- Plugin system for third-party integrations
- Browser-compatible build
- Custom validator plugins

[1.1.2]: https://github.com/kazmiali/mailtester/releases/tag/v1.1.2
[1.1.1]: https://github.com/kazmiali/mailtester/releases/tag/v1.1.1
[1.1.0]: https://github.com/kazmiali/mailtester/releases/tag/v1.1.0
[1.0.0]: https://github.com/kazmiali/mailtester/releases/tag/v1.0.0
[1.0.0-beta.1]: https://github.com/kazmiali/mailtester/releases/tag/v1.0.0-beta.1
