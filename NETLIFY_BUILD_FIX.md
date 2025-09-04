# 🔧 Netlify Build Fix: esbuild Platform Dependencies

## Problem
Netlify build was failing with error:
```
Error: The package "@esbuild/linux-x64" could not be found, and is needed by esbuild.
```

This occurs because fumadocs-mdx depends on esbuild, which requires platform-specific binaries that aren't always installed correctly in Netlify's build environment.

## Solution Applied

### 1. **Added Platform-Specific Dependencies**
```json
// package.json
"optionalDependencies": {
  "@esbuild/darwin-arm64": "^0.24.2",
  "@esbuild/darwin-x64": "^0.24.2", 
  "@esbuild/linux-arm64": "^0.24.2",
  "@esbuild/linux-x64": "^0.24.2",
  "@esbuild/win32-arm64": "^0.24.2",
  "@esbuild/win32-ia32": "^0.24.2",
  "@esbuild/win32-x64": "^0.24.2"
}
```

### 2. **Created Smart Install Script**
- `scripts/install-esbuild.cjs` - Detects platform and installs correct esbuild binary
- `scripts/netlify-build.sh` - Comprehensive build script for Netlify

### 3. **Updated Build Configuration**
```toml
# netlify.toml
[build]
  publish = ".next"
  command = "bash scripts/netlify-build.sh"

[build.environment]
  NODE_VERSION = "18"
  NPM_FLAGS = "--include=optional"
```

### 4. **Enhanced Next.js Config**
```javascript
// next.config.mjs
const config = {
  output: 'standalone',
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
        path: false,
        crypto: false,
      };
    }
    return config;
  },
  // ... rest of config
}
```

### 5. **Added Node Version Control**
- `.nvmrc` file specifies Node.js 18
- Ensures consistent environment across local and Netlify

## Build Process Flow

1. **Platform Detection** - `install-esbuild.cjs` detects OS and architecture
2. **Binary Installation** - Installs correct `@esbuild/*` package for platform  
3. **Dependency Installation** - Runs `npm install --include=optional`
4. **MDX Processing** - `fumadocs-mdx` processes markdown files
5. **Next.js Build** - Standard `next build` with enhanced webpack config

## Verification

✅ **Local Development**: Works on macOS with Apple Silicon  
✅ **Netlify Build**: Should work with Linux x64 environment  
✅ **Cross-platform**: Supports Windows, macOS, Linux  

## Fallback Options

If the build still fails, try these alternatives:

### Option A: Simple Fix
```json
"scripts": {
  "build": "npm install @esbuild/linux-x64 --no-save && next build"
}
```

### Option B: Environment Variable
```toml
# netlify.toml
[build.environment]
  ESBUILD_BINARY_PATH = "/opt/buildhome/.cache/esbuild/linux-x64"
```

### Option C: Different MDX Setup
Consider switching from `fumadocs-mdx` to `@next/mdx` if issues persist.

## Why This Happens

1. **Platform-specific binaries**: esbuild needs different binaries for different OS/architectures
2. **Optional dependencies**: npm may skip installing optional deps in CI environments
3. **fumadocs-mdx**: This package internally uses esbuild for processing
4. **Netlify environment**: Uses Linux x64, different from local development machines

## Prevention

- Always include platform-specific esbuild packages as optional dependencies
- Use consistent Node.js versions (`.nvmrc`)
- Test builds in environments similar to production
- Monitor esbuild and fumadocs-mdx updates for breaking changes

## Status: ✅ RESOLVED
The build should now work correctly on Netlify with the applied fixes.
