# Publishing Guide

This guide covers the process of publishing new versions of `@mailtester/core` to npm and updating the documentation site.

## Prerequisites

- **npm Account**: You must be logged in to npm (`npm login`) and be a collaborator on the `@mailtester/core` package.
- **Node.js & Yarn**: Ensure you have Node.js 20+ and Yarn 4+ installed.
- **Git**: Changes should be committed to the `main` branch before publishing.

### Authentication & 2FA

npm requires 2FA for publishing. If you use a **passkey** (e.g., Google Pass Manager, Touch ID) instead of a TOTP authenticator app, the CLI will not be able to prompt you for a code.

**Solution for Passkey Users:**
1. Go to [npmjs.com](https://www.npmjs.com) → Profile → **Access Tokens**.
2. Generate a **Granular Access Token**.
3. Select **Read and write** permissions for the `@mailtester` scope.
4. Enable **Bypass 2FA for publishing**.
5. Save the token securely. You can use it during publishing if the CLI prompts for 2FA and your passkey flow isn't supported.

## Release Steps

### 1. Bump Version

Update the version in `packages/core/package.json`:

```json
{
  "name": "@mailtester/core",
  "version": "1.x.x",
  ...
}
```

### 2. Update Changelogs

Update the changelogs to reflect the new version and changes.

**Package Changelog** (`packages/core/CHANGELOG.md`):
- Add the new version entry at the top.
- Link the version at the bottom: `[1.x.x]: https://github.com/kazmiali/mailtester/releases/tag/v1.x.x`

**Docs Site Changelog** (`docs-site/changelog.md`):
- Mirror the changes from the package changelog.
- Update the version links at the bottom.

### 3. Update Docs Site Version

Update the version displayed in the docs site header in `docs-site/.vitepress/config.mts`:

```typescript
nav: [
  {
    text: 'v1.x.x',
    items: [ ... ]
  }
]
```

### 4. Build the Package

Run the build from the root or the core package directory:

```bash
# From project root
yarn build

# Or from packages/core
cd packages/core && yarn build
```

Verify the build output in `packages/core/dist/`:
- `index.js` (ESM)
- `index.cjs` (CommonJS)
- `index.d.ts` / `index.d.cts` (Types)

### 5. Publish to npm

Navigate to the core package directory and publish:

```bash
cd packages/core
npm publish --access public
```

If prompted for a one-time password (OTP) and you cannot provide one due to passkey authentication, use the Granular Access Token method described in the prerequisites.

### 6. Commit and Push

Commit all changes including version bumps, changelogs, and docs config:

```bash
git add .
git commit -m "chore: bump version to 1.x.x"
git push origin main
```

## Docs Site Deployment

The documentation site is automatically deployed via GitHub Actions when changes are pushed to the `main` branch.

- **Workflow**: `.github/workflows/docs.yml`
- **Trigger**: Push to `main`
- **Output**: Deploys to the configured hosting (Vercel/GitHub Pages/Custom Domain)

Ensure all changes (especially `docs-site/` files) are pushed to `main` to trigger the deployment.

## Troubleshooting

- **EOTP Error**: "This operation requires a one-time password."
  - Cause: npm CLI doesn't support WebAuthn/Passkey 2FA flows.
  - Fix: Create a Granular Access Token with 2FA bypass enabled and use it for publishing.
- **EPUBLISH Error**: "Package name already exists."
  - Fix: Ensure you are bumping the version in `package.json` before publishing.
- **Build Errors**:
  - Run `yarn lint` and `yarn typecheck` to catch issues before building.
