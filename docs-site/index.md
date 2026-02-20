---
layout: home
title: 'Node.js Email Validation Library — mailtester'
description: 'Fast, lightweight Node.js email validation. Validates format (RFC 5322), detects typos, blocks disposable emails, checks MX records & SMTP. TypeScript-first. npm install @mailtester/core'
head:
  - - meta
    - name: keywords
      content: 'nodejs email validation, email validator npm, typescript email validation, smtp email check nodejs, disposable email detection, mx record validation, bulk email validation, check email exists nodejs'
  - - meta
    - property: og:title
      content: 'Node.js Email Validation Library — mailtester'
  - - meta
    - property: og:description
      content: 'Fast, lightweight email validation for Node.js. Detect typos, block disposable emails, verify MX & SMTP. TypeScript-first. 25KB.'
  - - link
    - rel: canonical
      href: 'https://mailtester.alikazmi.dev/'

hero:
  name: "@mailtester/core"
  text: "Email Validation Done Right"
  tagline: Modern, high-performance email validation for Node.js with RFC 5322 compliance, typo detection, and bulk processing.
  image:
    src: /logo.svg
    alt: mailtester
  actions:
    - theme: brand
      text: Get Started
      link: /getting-started
    - theme: alt
      text: View on GitHub
      link: https://github.com/kazmiali/mailtester

features:
  - title: Blazing Fast
    details: 3x faster than alternatives. Single validation under 150ms, bulk 100 emails in under 5 seconds.
  - title: Comprehensive Validation
    details: 5 validators - Regex (RFC 5322), Typo Detection, Disposable Blocking, MX Records, and SMTP verification.
  - title: Lightweight
    details: Only 25KB gzipped with minimal dependencies. No bloat, just what you need.
  - title: TypeScript First
    details: Built with TypeScript 5.3+ strict mode. Full type safety and IntelliSense support.
  - title: Bulk Processing
    details: Process thousands of emails concurrently with built-in rate limiting and progress tracking.
  - title: Zero Config
    details: Works out of the box with sensible defaults. Customize when you need to with presets.
---

## Quick Install

```bash
npm install @mailtester/core
```

## Quick Start

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

## Why mailtester?

| Feature | @mailtester/core | deep-email-validator |
|---------|-----------------|---------------------|
| Performance | 3x faster | Slower |
| Bundle Size | 25KB | 50KB+ |
| TypeScript | Native | Basic |
| Bulk Validation | Built-in | No |
| Rate Limiting | Built-in | No |
| Maintained | Active | Limited |

## About the Author

<div class="author-card">
  <div class="author-avatar">MAK</div>
  <div class="author-info">
    <h3>Muhammad Ali Kazmi</h3>
    <p>Full-stack developer passionate about building fast, developer-friendly open-source tools. <code>@mailtester/core</code> is crafted with care to solve real-world email validation challenges.</p>
    <div class="author-links">
      <a href="https://alikazmi.dev" target="_blank" rel="noopener" class="author-link author-link--portfolio">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
        alikazmi.dev
      </a>
      <a href="https://linkedin.com/in/alikazmidev" target="_blank" rel="noopener" class="author-link author-link--linkedin">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
        alikazmidev
      </a>
    </div>
  </div>
</div>
